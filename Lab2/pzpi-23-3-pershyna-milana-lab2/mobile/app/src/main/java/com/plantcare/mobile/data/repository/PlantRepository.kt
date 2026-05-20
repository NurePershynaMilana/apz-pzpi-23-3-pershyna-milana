package com.plantcare.mobile.data.repository

import com.plantcare.mobile.data.api.ApiService
import com.plantcare.mobile.data.model.CreatePlantRequest
import com.plantcare.mobile.data.model.Plant
import com.plantcare.mobile.data.model.PlantType
import com.plantcare.mobile.data.model.UpdatePlantRequest
import com.plantcare.mobile.util.safeApiCall
import javax.inject.Inject

class PlantRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getMyPlants(): Result<List<Plant>> =
        safeApiCall { apiService.getMyPlants() }

    suspend fun getMyPlantById(id: Int): Result<Plant> =
        safeApiCall { apiService.getMyPlantById(id) }

    suspend fun createPlant(name: String, plantTypeId: Int, location: String): Result<Plant> =
        safeApiCall { apiService.createMyPlant(CreatePlantRequest(plantTypeId, name, location)) }

    suspend fun updatePlant(
        id: Int,
        name: String? = null,
        location: String? = null,
        plantTypeId: Int? = null
    ): Result<Plant> = safeApiCall {
        apiService.updateMyPlant(id, UpdatePlantRequest(name, location, plantTypeId))
    }

    suspend fun deletePlant(id: Int): Result<Unit> =
        safeApiCall { apiService.deleteMyPlant(id) }

    suspend fun getPlantTypes(): Result<List<PlantType>> =
        safeApiCall { apiService.getPlantTypes() }
}
