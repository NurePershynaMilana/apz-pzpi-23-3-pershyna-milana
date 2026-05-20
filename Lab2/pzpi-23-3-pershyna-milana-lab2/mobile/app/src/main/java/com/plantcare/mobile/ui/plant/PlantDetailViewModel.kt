package com.plantcare.mobile.ui.plant

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.plantcare.mobile.data.model.Plant
import com.plantcare.mobile.data.model.Sensor
import com.plantcare.mobile.data.model.SensorData
import com.plantcare.mobile.data.repository.PlantRepository
import com.plantcare.mobile.data.repository.SensorRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.temporal.ChronoUnit
import javax.inject.Inject

enum class ChartRange { WEEK, MONTH }

sealed class PlantDetailUiState {
    object Loading : PlantDetailUiState()
    data class Success(
        val plant: Plant,
        val sensors: List<Sensor>,
        val sensorDataMap: Map<Int, List<SensorData>>
    ) : PlantDetailUiState()
    data class Error(val message: String) : PlantDetailUiState()
}

data class ThresholdValues(val min: Float, val max: Float)

@HiltViewModel
class PlantDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val plantRepository: PlantRepository,
    private val sensorRepository: SensorRepository,
    private val dataStore: DataStore<Preferences>
) : ViewModel() {

    private val plantId: Int = checkNotNull(savedStateHandle["plantId"])

    private val _uiState = MutableStateFlow<PlantDetailUiState>(PlantDetailUiState.Loading)
    val uiState: StateFlow<PlantDetailUiState> = _uiState.asStateFlow()

    private val _chartRange = MutableStateFlow(ChartRange.WEEK)
    val chartRange: StateFlow<ChartRange> = _chartRange.asStateFlow()

    init {
        loadPlant()
    }

    fun loadPlant() {
        viewModelScope.launch {
            _uiState.value = PlantDetailUiState.Loading
            plantRepository.getMyPlantById(plantId)
                .onSuccess { plant ->
                    val sensors = plant.sensors ?: run {
                        sensorRepository.getSensors(plant.plantId).getOrElse { emptyList() }
                    }
                    loadSensorData(plant, sensors)
                }
                .onFailure { e ->
                    _uiState.value = PlantDetailUiState.Error(e.message ?: "Помилка завантаження")
                }
        }
    }

    private suspend fun loadSensorData(plant: Plant, sensors: List<Sensor>) {
        val now = Instant.now()
        val from = when (_chartRange.value) {
            ChartRange.WEEK -> now.minus(7, ChronoUnit.DAYS)
            ChartRange.MONTH -> now.minus(30, ChronoUnit.DAYS)
        }.toString()

        val sensorDataMap = coroutineScope {
            sensors.map { sensor ->
                async {
                    val data = sensorRepository.getSensorData(
                        sensorId = sensor.sensorId,
                        limit = 200,
                        from = from
                    ).getOrElse { emptyList() }
                    sensor.sensorId to data
                }
            }.awaitAll()
        }.toMap()

        _uiState.value = PlantDetailUiState.Success(plant, sensors, sensorDataMap)
    }

    fun toggleChartRange() {
        _chartRange.value = if (_chartRange.value == ChartRange.WEEK) ChartRange.MONTH else ChartRange.WEEK
        val currentState = _uiState.value
        if (currentState is PlantDetailUiState.Success) {
            viewModelScope.launch {
                loadSensorData(currentState.plant, currentState.sensors)
            }
        }
    }

    fun getThreshold(sensorType: String): kotlinx.coroutines.flow.Flow<ThresholdValues?> =
        dataStore.data.map { prefs ->
            val minKey = floatPreferencesKey("threshold_${plantId}_${sensorType}_min")
            val maxKey = floatPreferencesKey("threshold_${plantId}_${sensorType}_max")
            val min = prefs[minKey]
            val max = prefs[maxKey]
            if (min != null && max != null) ThresholdValues(min, max) else null
        }

    fun saveThreshold(sensorType: String, min: Float, max: Float) {
        viewModelScope.launch {
            dataStore.edit { prefs ->
                prefs[floatPreferencesKey("threshold_${plantId}_${sensorType}_min")] = min
                prefs[floatPreferencesKey("threshold_${plantId}_${sensorType}_max")] = max
            }
        }
    }

    fun deletePlant(onSuccess: () -> Unit, onError: (String) -> Unit = {}) {
        viewModelScope.launch {
            plantRepository.deletePlant(plantId)
                .onSuccess { onSuccess() }
                .onFailure { e -> onError(e.message ?: "Помилка видалення") }
        }
    }
}
