package com.plantcare.mobile.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.appDataStore: DataStore<Preferences> by preferencesDataStore(name = "plant_care_prefs")

object DataStoreKeys {
    val TOKEN = stringPreferencesKey("auth_token")
    val LANGUAGE = stringPreferencesKey("language")
    val SEASON_MODE = stringPreferencesKey("season_mode")
    val NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
    val CHECK_INTERVAL_MINUTES = intPreferencesKey("check_interval_minutes")
}

class TokenDataStore(private val dataStore: DataStore<Preferences>) {

    val token: Flow<String?> = dataStore.data.map { it[DataStoreKeys.TOKEN] }

    val language: Flow<String> = dataStore.data.map { it[DataStoreKeys.LANGUAGE] ?: "uk" }

    val seasonMode: Flow<String> = dataStore.data.map { it[DataStoreKeys.SEASON_MODE] ?: "normal" }

    val notificationsEnabled: Flow<Boolean> = dataStore.data.map {
        it[DataStoreKeys.NOTIFICATIONS_ENABLED] ?: true
    }

    val checkIntervalMinutes: Flow<Int> = dataStore.data.map {
        it[DataStoreKeys.CHECK_INTERVAL_MINUTES] ?: 30
    }

    suspend fun saveToken(token: String) {
        dataStore.edit { it[DataStoreKeys.TOKEN] = token }
    }

    suspend fun clearToken() {
        dataStore.edit { it.remove(DataStoreKeys.TOKEN) }
    }

    suspend fun setLanguage(lang: String) {
        dataStore.edit { it[DataStoreKeys.LANGUAGE] = lang }
    }

    suspend fun setSeasonMode(mode: String) {
        dataStore.edit { it[DataStoreKeys.SEASON_MODE] = mode }
    }

    suspend fun setNotificationsEnabled(enabled: Boolean) {
        dataStore.edit { it[DataStoreKeys.NOTIFICATIONS_ENABLED] = enabled }
    }

    suspend fun setCheckIntervalMinutes(minutes: Int) {
        dataStore.edit { it[DataStoreKeys.CHECK_INTERVAL_MINUTES] = minutes }
    }
}
