package com.plantcare.mobile.di

import com.plantcare.mobile.data.repository.AuthRepository
import com.plantcare.mobile.data.repository.PlantRepository
import com.plantcare.mobile.data.repository.SensorRepository
import com.plantcare.mobile.data.repository.SettingsRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.plantcare.mobile.data.api.ApiService
import com.plantcare.mobile.data.local.TokenDataStore
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideTokenDataStore(dataStore: DataStore<Preferences>): TokenDataStore =
        TokenDataStore(dataStore)

    @Provides
    @Singleton
    fun provideAuthRepository(
        apiService: ApiService,
        tokenDataStore: TokenDataStore
    ): AuthRepository = AuthRepository(apiService, tokenDataStore)

    @Provides
    @Singleton
    fun providePlantRepository(apiService: ApiService): PlantRepository =
        PlantRepository(apiService)

    @Provides
    @Singleton
    fun provideSensorRepository(apiService: ApiService): SensorRepository =
        SensorRepository(apiService)

    @Provides
    @Singleton
    fun provideSettingsRepository(
        tokenDataStore: TokenDataStore
    ): SettingsRepository = SettingsRepository(tokenDataStore)
}
