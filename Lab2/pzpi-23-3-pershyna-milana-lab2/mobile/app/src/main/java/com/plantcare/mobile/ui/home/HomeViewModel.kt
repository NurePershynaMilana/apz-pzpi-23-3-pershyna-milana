package com.plantcare.mobile.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.plantcare.mobile.data.model.Plant
import com.plantcare.mobile.data.model.SensorData
import com.plantcare.mobile.data.repository.PlantRepository
import com.plantcare.mobile.data.repository.SensorRepository
import com.plantcare.mobile.ui.components.PlantHealthStatus
import com.plantcare.mobile.ui.components.computePlantStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PlantWithStatus(
    val plant: Plant,
    val status: PlantHealthStatus,
    val latestData: Map<Int, SensorData?>
)

sealed class HomeUiState {
    object Loading : HomeUiState()
    data class Success(val plants: List<PlantWithStatus>) : HomeUiState()
    data class Error(val message: String) : HomeUiState()
}

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val plantRepository: PlantRepository,
    private val sensorRepository: SensorRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun loadPlants() {
        viewModelScope.launch {
            _uiState.value = HomeUiState.Loading
            plantRepository.getMyPlants()
                .onSuccess { plants ->
                    val plantsWithStatus = coroutineScope {
                        plants.map { plant ->
                            async { buildPlantWithStatus(plant) }
                        }.awaitAll()
                    }
                    _uiState.value = HomeUiState.Success(plantsWithStatus)
                }
                .onFailure { e ->
                    _uiState.value = HomeUiState.Error(e.message ?: "Помилка завантаження")
                }
        }
    }

    private suspend fun buildPlantWithStatus(plant: Plant): PlantWithStatus {
        val sensors = plant.sensors ?: run {
            sensorRepository.getSensors(plant.plantId).getOrElse { emptyList() }
        }

        val latestData = coroutineScope {
            sensors.map { sensor ->
                async {
                    val data = sensorRepository.getSensorData(sensor.sensorId, limit = 1)
                        .getOrElse { emptyList() }
                    sensor.sensorId to data.firstOrNull()
                }
            }.awaitAll()
        }.toMap()

        val status = computePlantStatus(sensors, latestData, plant.plantType)
        return PlantWithStatus(plant, status, latestData)
    }
}
