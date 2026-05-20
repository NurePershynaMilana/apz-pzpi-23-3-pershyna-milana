package com.plantcare.mobile.data.repository

import com.plantcare.mobile.data.api.ApiService
import com.plantcare.mobile.data.model.Sensor
import com.plantcare.mobile.data.model.SensorData
import com.plantcare.mobile.util.safeApiCall
import javax.inject.Inject

class SensorRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getSensors(plantId: Int): Result<List<Sensor>> =
        safeApiCall { apiService.getSensors(plantId) }

    suspend fun getSensorData(
        sensorId: Int,
        limit: Int? = null,
        from: String? = null,
        to: String? = null
    ): Result<List<SensorData>> = safeApiCall {
        apiService.getSensorData(sensorId, limit, from, to)
    }
}
