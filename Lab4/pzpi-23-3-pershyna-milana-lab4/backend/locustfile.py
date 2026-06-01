"""
Plant Care System - Locust Load Test
Lab 4: Backend Scaling demonstration

Usage:
  locust -f locustfile.py --host=http://<minikube-ip>:30000

Then open http://localhost:8089 in your browser.

Test scenario for scaling demo:
  1. Start with 1 backend pod, run ~50 users → note RPS
  2. Scale to 3 pods: kubectl scale deployment backend --replicas=3 -n plant-care
  3. Run same 50 users → RPS should ~triple
  4. Scale to 5 pods → RPS increases further
"""

from locust import HttpUser, task, between, events
import json
import logging

logger = logging.getLogger(__name__)

# Test credentials from seed data
TEST_USERS = [
    {"email": "ivan.petrenko@email.com", "password": "password123"},
    {"email": "maria.kovalenko@email.com", "password": "password456"},
    {"email": "oleh.shevchenko@email.com", "password": "password789"},
]


class PlantCareUser(HttpUser):
    """
    Simulates a real user hitting the Plant Care API.
    Mix of lightweight reads, heavier DB queries, and auth calls.
    """
    wait_time = between(0.5, 2)

    def on_start(self):
        """Called once per simulated user on startup — log in and cache the JWT."""
        import random
        creds = random.choice(TEST_USERS)
        self.token = None
        self.user_email = creds["email"]

        with self.client.post(
            "/api/auth/login",
            json=creds,
            catch_response=True,
            name="POST /api/auth/login [startup]",
        ) as resp:
            if resp.status_code == 200:
                data = resp.json()
                # Handle both {token: ...} and {data: {token: ...}} response shapes
                self.token = data.get("token") or (data.get("data") or {}).get("token")
                if self.token:
                    resp.success()
                else:
                    resp.failure("Login response had no token field")
            else:
                resp.failure(f"Login failed: {resp.status_code} {resp.text[:200]}")

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    # ------------------------------------------------------------------ #
    # Lightweight endpoints — high weight, no auth needed
    # ------------------------------------------------------------------ #

    @task(4)
    def health_check(self):
        """Fastest possible endpoint — good baseline for measuring pod throughput."""
        self.client.get("/health", name="GET /health")

    @task(6)
    def get_plant_types(self):
        """Read-only catalog — no auth, small table, very fast."""
        self.client.get("/api/plant-types", name="GET /api/plant-types")

    # ------------------------------------------------------------------ #
    # Authenticated read endpoints — moderate weight
    # ------------------------------------------------------------------ #

    @task(5)
    def get_my_plants(self):
        """Returns authenticated user's plants — JWT decode + DB join."""
        self.client.get(
            "/api/my-plants",
            headers=self.auth_headers(),
            name="GET /api/my-plants",
        )

    @task(4)
    def get_all_plants(self):
        """Admin/general plant list."""
        self.client.get(
            "/api/plants",
            headers=self.auth_headers(),
            name="GET /api/plants",
        )

    @task(3)
    def get_sensors(self):
        """List sensors — DB query with auth overhead."""
        self.client.get(
            "/api/sensors",
            headers=self.auth_headers(),
            name="GET /api/sensors",
        )

    @task(3)
    def get_sensor_data(self):
        """Heavier query — time-series table, tests DB throughput."""
        self.client.get(
            "/api/sensor-data",
            headers=self.auth_headers(),
            name="GET /api/sensor-data",
        )

    # ------------------------------------------------------------------ #
    # Write / CPU-heavy endpoints — low weight
    # ------------------------------------------------------------------ #

    @task(1)
    def login_again(self):
        """bcrypt compare on every call — most CPU-intensive operation."""
        import random
        creds = random.choice(TEST_USERS)
        with self.client.post(
            "/api/auth/login",
            json=creds,
            catch_response=True,
            name="POST /api/auth/login",
        ) as resp:
            if resp.status_code == 200:
                resp.success()
            else:
                resp.failure(f"{resp.status_code}")


class PlantCareHeavyUser(HttpUser):
    """
    Aggressive user that hits sensor-data repeatedly.
    Use this class to stress the DB and trigger HPA scale-up faster.
    Start a separate Locust worker with --tags heavy to use only this class.
    """
    wait_time = between(0.1, 0.5)

    def on_start(self):
        resp = self.client.post(
            "/api/auth/login",
            json={"email": "ivan.petrenko@email.com", "password": "password123"},
        )
        self.token = None
        if resp.status_code == 200:
            data = resp.json()
            self.token = data.get("token") or (data.get("data") or {}).get("token")

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(1)
    def heavy_sensor_data(self):
        self.client.get(
            "/api/sensor-data",
            headers=self.auth_headers(),
            name="GET /api/sensor-data [heavy]",
        )

    @task(1)
    def heavy_login(self):
        self.client.post(
            "/api/auth/login",
            json={"email": "ivan.petrenko@email.com", "password": "password123"},
            name="POST /api/auth/login [heavy]",
        )
