package com.plantcare.mobile.util

import com.plantcare.mobile.data.model.ApiResponse
import com.squareup.moshi.Json
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.HttpException

private data class ErrorBody(
    @Json(name = "error") val error: String?,
    @Json(name = "message") val message: String?
)

private val errorMoshi = Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build()
private val errorAdapter = errorMoshi.adapter(ErrorBody::class.java)

suspend fun <T> safeApiCall(call: suspend () -> ApiResponse<T>): Result<T> {
    return try {
        val response = call()
        if (response.success) {
            val data = response.data
            if (data != null) {
                Result.success(data)
            } else {
                // Unit responses (logout, delete) return success=true with no data
                @Suppress("UNCHECKED_CAST")
                Result.success(Unit as T)
            }
        } else {
            Result.failure(Exception(response.message ?: "Помилка сервера"))
        }
    } catch (e: HttpException) {
        val bodyString = e.response()?.errorBody()?.string()
        val message = try {
            val parsed = errorAdapter.fromJson(bodyString ?: "")
            parsed?.error ?: parsed?.message ?: e.message()
        } catch (_: Exception) {
            e.message()
        }
        Result.failure(Exception(message))
    } catch (e: Exception) {
        Result.failure(e)
    }
}
