package com.plantcare.mobile.ui.navigation

sealed class Routes(val route: String) {
    object Splash : Routes("splash")
    object Login : Routes("login")
    object Register : Routes("register")
    object Home : Routes("home")
    object AddPlant : Routes("add_plant")
    object Settings : Routes("settings")
    object PlantDetail : Routes("plant/{plantId}") {
        fun createRoute(plantId: Int) = "plant/$plantId"
    }
}
