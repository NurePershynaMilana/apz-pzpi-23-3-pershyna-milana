package com.plantcare.mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class SensorData(
    @Json(name = "data_id") val dataId: Int,
    @Json(name = "sensor_id") val sensorId: Int,
    @Json(name = "value") val value: Double,
    @Json(name = "timestamp") val timestamp: String
)
