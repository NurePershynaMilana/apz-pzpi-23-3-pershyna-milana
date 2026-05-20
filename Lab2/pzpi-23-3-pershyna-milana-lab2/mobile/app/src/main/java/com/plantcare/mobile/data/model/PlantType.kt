package com.plantcare.mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class PlantType(
    @Json(name = "plant_type_id") val plantTypeId: Int,
    @Json(name = "name") val name: String,
    @Json(name = "optimal_humidity") val optimalHumidity: Double,
    @Json(name = "optimal_temperature") val optimalTemperature: Double,
    @Json(name = "optimal_light") val optimalLight: Int,
    @Json(name = "watering_frequency") val wateringFrequency: Int
)
