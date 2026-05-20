package com.plantcare.mobile.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.plantcare.mobile.ui.auth.LoginScreen
import com.plantcare.mobile.ui.auth.RegisterScreen
import com.plantcare.mobile.ui.auth.SplashScreen
import com.plantcare.mobile.ui.home.HomeScreen
import com.plantcare.mobile.ui.plant.AddPlantScreen
import com.plantcare.mobile.ui.plant.PlantDetailScreen
import com.plantcare.mobile.ui.settings.SettingsScreen
import com.plantcare.mobile.util.AuthEventBus

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String = Routes.Splash.route
) {
    LaunchedEffect(Unit) {
        AuthEventBus.events.collect {
            navController.navigate(Routes.Login.route) {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Routes.Splash.route) {
            SplashScreen(
                onNavigateToHome = {
                    navController.navigate(Routes.Home.route) {
                        popUpTo(Routes.Splash.route) { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.navigate(Routes.Login.route) {
                        popUpTo(Routes.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.Login.route) {
            LoginScreen(
                onNavigateToHome = {
                    navController.navigate(Routes.Home.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Routes.Register.route)
                }
            )
        }

        composable(Routes.Register.route) {
            RegisterScreen(
                onNavigateToLogin = {
                    navController.popBackStack()
                }
            )
        }

        composable(Routes.Home.route) {
            HomeScreen(
                onNavigateToPlantDetail = { plantId ->
                    navController.navigate(Routes.PlantDetail.createRoute(plantId))
                },
                onNavigateToAddPlant = {
                    navController.navigate(Routes.AddPlant.route)
                },
                onNavigateToSettings = {
                    navController.navigate(Routes.Settings.route)
                }
            )
        }

        composable(
            route = Routes.PlantDetail.route,
            arguments = listOf(navArgument("plantId") { type = NavType.IntType })
        ) {
            PlantDetailScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToEdit = { plantId ->
                    navController.navigate("add_plant?plantId=$plantId")
                }
            )
        }

        composable(
            route = Routes.AddPlant.route
        ) {
            AddPlantScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = "add_plant?plantId={plantId}",
            arguments = listOf(navArgument("plantId") {
                type = NavType.IntType
                defaultValue = -1
            })
        ) {
            AddPlantScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Routes.Settings.route) {
            SettingsScreen(
                onNavigateBack = { navController.popBackStack() },
                onLogout = {
                    navController.navigate(Routes.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}
