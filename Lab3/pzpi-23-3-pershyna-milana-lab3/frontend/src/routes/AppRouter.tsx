import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/user/DashboardPage';
import { PlantsPage } from '@/pages/user/PlantsPage';
import { PlantDetailPage } from '@/pages/user/PlantDetailPage';
import { AddPlantPage } from '@/pages/user/AddPlantPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { AllPlantsPage } from '@/pages/admin/AllPlantsPage';
import { PlantTypesPage } from '@/pages/admin/PlantTypesPage';
import { SensorsPage } from '@/pages/admin/SensorsPage';
import { BackupPage } from '@/pages/admin/BackupPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from './routes';

const DashboardRedirect = () => {
    const { isAdmin } = useAuth();
    return isAdmin ? <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> : <DashboardPage />;
};

export const AppRouter = () => (
    <Routes>
        <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <ErrorBoundary>
                            <DashboardRedirect />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path={ROUTES.PLANTS}
                    element={
                        <ErrorBoundary>
                            <PlantsPage />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path={ROUTES.ADD_PLANT}
                    element={
                        <ErrorBoundary>
                            <AddPlantPage />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path={ROUTES.EDIT_PLANT}
                    element={
                        <ErrorBoundary>
                            <AddPlantPage />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path={ROUTES.PLANT_DETAIL}
                    element={
                        <ErrorBoundary>
                            <PlantDetailPage />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path={ROUTES.PROFILE}
                    element={
                        <ErrorBoundary>
                            <ProfilePage />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path={ROUTES.SETTINGS}
                    element={
                        <ErrorBoundary>
                            <SettingsPage />
                        </ErrorBoundary>
                    }
                />

                <Route element={<AdminRoute />}>
                    <Route
                        path={ROUTES.ADMIN_DASHBOARD}
                        element={
                            <ErrorBoundary>
                                <AdminDashboardPage />
                            </ErrorBoundary>
                        }
                    />
                    <Route
                        path={ROUTES.ADMIN_USERS}
                        element={
                            <ErrorBoundary>
                                <UsersPage />
                            </ErrorBoundary>
                        }
                    />
                    <Route
                        path={ROUTES.ADMIN_PLANTS}
                        element={
                            <ErrorBoundary>
                                <AllPlantsPage />
                            </ErrorBoundary>
                        }
                    />
                    <Route
                        path={ROUTES.ADMIN_PLANT_TYPES}
                        element={
                            <ErrorBoundary>
                                <PlantTypesPage />
                            </ErrorBoundary>
                        }
                    />
                    <Route
                        path={ROUTES.ADMIN_SENSORS}
                        element={
                            <ErrorBoundary>
                                <SensorsPage />
                            </ErrorBoundary>
                        }
                    />
                    <Route
                        path={ROUTES.ADMIN_BACKUP}
                        element={
                            <ErrorBoundary>
                                <BackupPage />
                            </ErrorBoundary>
                        }
                    />
                </Route>
            </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
