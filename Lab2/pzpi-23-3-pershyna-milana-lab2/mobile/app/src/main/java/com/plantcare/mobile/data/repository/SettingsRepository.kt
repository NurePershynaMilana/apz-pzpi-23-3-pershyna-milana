package com.plantcare.mobile.data.repository

import com.plantcare.mobile.data.local.TokenDataStore
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class SettingsRepository @Inject constructor(
    private val tokenDataStore: TokenDataStore
) {
    val language: Flow<String> = tokenDataStore.language
    val seasonMode: Flow<String> = tokenDataStore.seasonMode
    val notificationsEnabled: Flow<Boolean> = tokenDataStore.notificationsEnabled
    val checkIntervalMinutes: Flow<Int> = tokenDataStore.checkIntervalMinutes

    suspend fun setLanguage(lang: String) = tokenDataStore.setLanguage(lang)
    suspend fun setSeasonMode(mode: String) = tokenDataStore.setSeasonMode(mode)
    suspend fun setNotificationsEnabled(enabled: Boolean) = tokenDataStore.setNotificationsEnabled(enabled)
    suspend fun setCheckIntervalMinutes(minutes: Int) = tokenDataStore.setCheckIntervalMinutes(minutes)
}
