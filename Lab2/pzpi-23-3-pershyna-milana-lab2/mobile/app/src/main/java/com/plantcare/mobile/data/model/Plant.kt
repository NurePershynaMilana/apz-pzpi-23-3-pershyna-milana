package com.plantcare.mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Plant(
    @Json(name = "plant_id") val plantId: Int,
    @Json(name = "user_id") val userId: Int,
    @Json(name = "plant_type_id") val plantTypeId: Int,
    @Json(name = "name") val name: String,
    @Json(name = "location") val location: String,
    @Json(name = "created_at") val createdAt: String,
    @Json(name = "updated_at") val updatedAt: String?,
    @Json(name = "plantType") val plantType: PlantType?,
    @Json(name = "sensors") val sensors: List<Sensor>?
)
