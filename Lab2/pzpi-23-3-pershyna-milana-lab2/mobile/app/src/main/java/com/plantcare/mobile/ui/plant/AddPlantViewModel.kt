package com.plantcare.mobile.ui.plant

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.plantcare.mobile.data.model.Plant
import com.plantcare.mobile.data.model.PlantType
import com.plantcare.mobile.data.repository.PlantRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class AddPlantUiState {
    object Idle : AddPlantUiState()
    object Loading : AddPlantUiState()
    data class Success(val plant: Plant) : AddPlantUiState()
    data class Error(val message: String) : AddPlantUiState()
}

@HiltViewModel
class AddPlantViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val plantRepository: PlantRepository
) : ViewModel() {

    private val editPlantId: Int? = savedStateHandle.get<Int>("plantId")?.takeIf { it > 0 }

    private val _uiState = MutableStateFlow<AddPlantUiState>(AddPlantUiState.Idle)
    val uiState: StateFlow<AddPlantUiState> = _uiState.asStateFlow()

    private val _plantTypes = MutableStateFlow<List<PlantType>>(emptyList())
    val plantTypes: StateFlow<List<PlantType>> = _plantTypes.asStateFlow()

    private val _existingPlant = MutableStateFlow<Plant?>(null)
    val existingPlant: StateFlow<Plant?> = _existingPlant.asStateFlow()

    init {
        loadPlantTypes()
        editPlantId?.let { loadExistingPlant(it) }
    }

    private fun loadPlantTypes() {
        viewModelScope.launch {
            plantRepository.getPlantTypes()
                .onSuccess { _plantTypes.value = it }
        }
    }

    private fun loadExistingPlant(id: Int) {
        viewModelScope.launch {
            plantRepository.getMyPlantById(id)
                .onSuccess { _existingPlant.value = it }
        }
    }

    fun savePlant(name: String, plantTypeId: Int, location: String) {
        viewModelScope.launch {
            _uiState.value = AddPlantUiState.Loading
            if (editPlantId != null) {
                plantRepository.updatePlant(editPlantId, name, location, plantTypeId)
            } else {
                plantRepository.createPlant(name, plantTypeId, location)
            }
                .onSuccess { plant ->
                    _uiState.value = AddPlantUiState.Success(plant)
                }
                .onFailure { e ->
                    _uiState.value = AddPlantUiState.Error(e.message ?: "Помилка збереження")
                }
        }
    }

    fun resetState() {
        _uiState.value = AddPlantUiState.Idle
    }

    val isEditMode: Boolean get() = editPlantId != null
}
