package com.plantcare.mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Sensor(
    @Json(name = "sensor_id") val sensorId: Int,
    @Json(name = "plant_id") val plantId: Int,
    @Json(name = "sensor_type") val sensorType: String,
    @Json(name = "hardware_id") val hardwareId: String,
    @Json(name = "is_active") val isActive: Boolean
)
