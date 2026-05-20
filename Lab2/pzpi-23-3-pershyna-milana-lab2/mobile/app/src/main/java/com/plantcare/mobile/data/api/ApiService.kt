package com.plantcare.mobile.data.api

import com.plantcare.mobile.data.model.ApiResponse
import com.plantcare.mobile.data.model.CreatePlantRequest
import com.plantcare.mobile.data.model.LoginData
import com.plantcare.mobile.data.model.LoginRequest
import com.plantcare.mobile.data.model.Plant
import com.plantcare.mobile.data.model.PlantType
import com.plantcare.mobile.data.model.RegisterRequest
import com.plantcare.mobile.data.model.RegisterResponseData
import com.plantcare.mobile.data.model.Sensor
import com.plantcare.mobile.data.model.SensorData
import com.plantcare.mobile.data.model.UpdatePlantRequest
import com.plantcare.mobile.data.model.User
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // Auth
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): ApiResponse<LoginData>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): ApiResponse<RegisterResponseData>

    @POST("auth/logout")
    suspend fun logout(): ApiResponse<Unit>

    @GET("auth/me")
    suspend fun getMe(): ApiResponse<User>

    // My Plants (authenticated)
    @GET("my-plants")
    suspend fun getMyPlants(): ApiResponse<List<Plant>>

    @GET("my-plants/{id}")
    suspend fun getMyPlantById(@Path("id") id: Int): ApiResponse<Plant>

    @POST("my-plants")
    suspend fun createMyPlant(@Body request: CreatePlantRequest): ApiResponse<Plant>

    @PUT("my-plants/{id}")
    suspend fun updateMyPlant(
        @Path("id") id: Int,
        @Body request: UpdatePlantRequest
    ): ApiResponse<Plant>

    @DELETE("my-plants/{id}")
    suspend fun deleteMyPlant(@Path("id") id: Int): ApiResponse<Unit>

    // Plant Types
    @GET("plant-types")
    suspend fun getPlantTypes(): ApiResponse<List<PlantType>>

    // Sensors
    @GET("plants/{plantId}/sensors")
    suspend fun getSensors(@Path("plantId") plantId: Int): ApiResponse<List<Sensor>>

    // Sensor Data
    @GET("sensors/{sensorId}/data")
    suspend fun getSensorData(
        @Path("sensorId") sensorId: Int,
        @Query("limit") limit: Int? = null,
        @Query("from") from: String? = null,
        @Query("to") to: String? = null
    ): ApiResponse<List<SensorData>>
}
