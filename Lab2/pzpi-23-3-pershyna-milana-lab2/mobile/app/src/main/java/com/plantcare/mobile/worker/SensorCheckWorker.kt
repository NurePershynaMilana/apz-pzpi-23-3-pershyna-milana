package com.plantcare.mobile.worker

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.app.NotificationCompat
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.plantcare.mobile.MainActivity
import com.plantcare.mobile.PlantCareApp
import com.plantcare.mobile.R
import com.plantcare.mobile.data.repository.PlantRepository
import com.plantcare.mobile.data.repository.SensorRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.time.Instant
import java.time.temporal.ChronoUnit

@HiltWorker
class SensorCheckWorker @AssistedInject constructor(
    @Assisted private val appContext: Context,
    @Assisted params: WorkerParameters,
    private val plantRepository: PlantRepository,
    private val sensorRepository: SensorRepository
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        return try {
            val plants = plantRepository.getMyPlants().getOrElse { return Result.failure() }

            plants.forEach { plant ->
                val plantType = plant.plantType ?: return@forEach
                val sensors = plant.sensors ?: sensorRepository.getSensors(plant.plantId)
                    .getOrElse { emptyList() }

                val from = Instant.now().minus(2, ChronoUnit.HOURS).toString()

                sensors.filter { it.isActive }.forEach { sensor ->
                    val latestData = sensorRepository.getSensorData(sensor.sensorId, limit = 1, from = from)
                        .getOrElse { emptyList() }
                        .firstOrNull() ?: return@forEach

                    val value = latestData.value
                    val alertMessage = when (sensor.sensorType) {
                        "humidity" -> {
                            val optimal = plantType.optimalHumidity
                            when {
                                value < optimal * 0.8 -> appContext.getString(R.string.notif_low_humidity)
                                value > optimal * 1.2 -> appContext.getString(R.string.notif_high_humidity)
                                else -> null
                            }
                        }
                        "temperature" -> {
                            val optimal = plantType.optimalTemperature
                            when {
                                value > optimal * 1.15 -> appContext.getString(R.string.notif_overheat)
                                value < optimal * 0.85 -> appContext.getString(R.string.notif_low_temp)
                                else -> null
                            }
                        }
                        "light" -> {
                            val optimal = plantType.optimalLight.toDouble()
                            when {
                                value < optimal * 0.5 -> appContext.getString(R.string.notif_low_light)
                                value > optimal * 1.5 -> appContext.getString(R.string.notif_high_light)
                                else -> null
                            }
                        }
                        else -> null
                    }

                    alertMessage?.let {
                        sendNotification(
                            plantId = plant.plantId,
                            plantName = plant.name,
                            message = it,
                            notifId = sensor.sensorId
                        )
                    }
                }
            }
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }

    private fun sendNotification(plantId: Int, plantName: String, message: String, notifId: Int) {
        val deepLinkUri = Uri.parse("plantcare://plant/$plantId")
        val intent = Intent(Intent.ACTION_VIEW, deepLinkUri, appContext, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            appContext,
            notifId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(appContext, PlantCareApp.CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(plantName)
            .setContentText(message)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        val manager = appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(notifId, notification)
    }
}
