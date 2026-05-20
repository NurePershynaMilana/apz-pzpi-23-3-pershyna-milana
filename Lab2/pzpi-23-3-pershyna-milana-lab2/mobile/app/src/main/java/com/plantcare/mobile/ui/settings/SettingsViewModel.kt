package com.plantcare.mobile.ui.settings

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.plantcare.mobile.data.repository.AuthRepository
import com.plantcare.mobile.data.repository.SettingsRepository
import com.plantcare.mobile.worker.WorkManagerScheduler
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SettingsState(
    val language: String = "uk",
    val seasonMode: String = "normal",
    val notificationsEnabled: Boolean = true,
    val checkIntervalMinutes: Int = 30
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val settingsRepository: SettingsRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    val settingsState: StateFlow<SettingsState> = combine(
        settingsRepository.language,
        settingsRepository.seasonMode,
        settingsRepository.notificationsEnabled,
        settingsRepository.checkIntervalMinutes
    ) { lang, season, notifs, interval ->
        SettingsState(lang, season, notifs, interval)
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        SettingsState()
    )

    fun setLanguage(lang: String) {
        viewModelScope.launch {
            settingsRepository.setLanguage(lang)
        }
    }

    fun setSeasonMode(mode: String) {
        viewModelScope.launch {
            settingsRepository.setSeasonMode(mode)
        }
    }

    fun setNotificationsEnabled(enabled: Boolean) {
        viewModelScope.launch {
            settingsRepository.setNotificationsEnabled(enabled)
            if (enabled) {
                val interval = settingsRepository.checkIntervalMinutes.stateIn(
                    viewModelScope,
                    SharingStarted.Eagerly,
                    30
                ).value
                WorkManagerScheduler.schedule(context, interval)
            } else {
                WorkManagerScheduler.cancel(context)
            }
        }
    }

    fun setCheckInterval(minutes: Int) {
        viewModelScope.launch {
            settingsRepository.setCheckIntervalMinutes(minutes)
            if (settingsState.value.notificationsEnabled) {
                WorkManagerScheduler.schedule(context, minutes)
            }
        }
    }

    fun logout(onLoggedOut: () -> Unit) {
        viewModelScope.launch {
            authRepository.logout()
            authRepository.clearToken()
            onLoggedOut()
        }
    }
}
