package com.plantcare.mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ApiResponse<T>(
    @Json(name = "success") val success: Boolean,
    @Json(name = "data") val data: T?,
    @Json(name = "message") val message: String?
)

@JsonClass(generateAdapter = true)
data class LoginRequest(
    @Json(name = "email") val email: String,
    @Json(name = "password") val password: String
)

@JsonClass(generateAdapter = true)
data class RegisterRequest(
    @Json(name = "email") val email: String,
    @Json(name = "first_name") val firstName: String,
    @Json(name = "last_name") val lastName: String,
    @Json(name = "password") val password: String
)

@JsonClass(generateAdapter = true)
data class LoginData(
    @Json(name = "user") val user: User,
    @Json(name = "token") val token: String
)

@JsonClass(generateAdapter = true)
data class RegisterResponseData(
    @Json(name = "user") val user: User
)

@JsonClass(generateAdapter = true)
data class CreatePlantRequest(
    @Json(name = "plant_type_id") val plantTypeId: Int,
    @Json(name = "name") val name: String,
    @Json(name = "location") val location: String
)

@JsonClass(generateAdapter = true)
data class UpdatePlantRequest(
    @Json(name = "name") val name: String?,
    @Json(name = "location") val location: String?,
    @Json(name = "plant_type_id") val plantTypeId: Int?
)
