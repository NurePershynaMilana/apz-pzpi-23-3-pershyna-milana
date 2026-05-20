package com.plantcare.mobile.data.api

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import com.plantcare.mobile.data.local.DataStoreKeys
import com.plantcare.mobile.util.AuthEventBus
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(
    private val dataStore: DataStore<Preferences>
) : Interceptor {

    private val skipPaths = listOf("/auth/login", "/auth/register")

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val path = request.url.encodedPath
        val shouldSkip = skipPaths.any { path.contains(it) }

        val newRequest = if (shouldSkip) {
            request
        } else {
            val token = runBlocking {
                dataStore.data.map { it[DataStoreKeys.TOKEN] }.firstOrNull()
            }
            if (token != null) {
                request.newBuilder()
                    .addHeader("Authorization", "Bearer $token")
                    .build()
            } else {
                request
            }
        }

        val response = chain.proceed(newRequest)

        if (response.code == 401 && !shouldSkip) {
            runBlocking {
                dataStore.edit { it.remove(DataStoreKeys.TOKEN) }
            }
            AuthEventBus.emit401()
        }

        return response
    }
}
