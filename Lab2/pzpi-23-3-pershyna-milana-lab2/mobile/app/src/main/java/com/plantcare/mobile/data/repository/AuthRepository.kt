package com.plantcare.mobile.data.repository

import com.plantcare.mobile.data.api.ApiService
import com.plantcare.mobile.data.local.TokenDataStore
import com.plantcare.mobile.data.model.LoginRequest
import com.plantcare.mobile.data.model.LoginData
import com.plantcare.mobile.data.model.RegisterRequest
import com.plantcare.mobile.data.model.RegisterResponseData
import com.plantcare.mobile.data.model.User
import com.plantcare.mobile.util.safeApiCall
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val apiService: ApiService,
    private val tokenDataStore: TokenDataStore
) {
    val token: Flow<String?> = tokenDataStore.token

    suspend fun login(email: String, password: String): Result<LoginData> =
        safeApiCall { apiService.login(LoginRequest(email, password)) }

    suspend fun register(
        email: String,
        firstName: String,
        lastName: String,
        password: String
    ): Result<User> = safeApiCall {
        apiService.register(RegisterRequest(email, firstName, lastName, password))
    }.map { it.user }

    suspend fun logout(): Result<Unit> = safeApiCall { apiService.logout() }

    suspend fun getMe(): Result<User> = safeApiCall { apiService.getMe() }

    suspend fun saveToken(token: String) = tokenDataStore.saveToken(token)

    suspend fun clearToken() = tokenDataStore.clearToken()
}
