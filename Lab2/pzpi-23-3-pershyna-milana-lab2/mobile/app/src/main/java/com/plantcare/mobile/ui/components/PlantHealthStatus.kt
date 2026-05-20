package com.plantcare.mobile.ui.components

import com.plantcare.mobile.data.model.PlantType
import com.plantcare.mobile.data.model.Sensor
import com.plantcare.mobile.data.model.SensorData

enum class PlantHealthStatus { NORMAL, NEEDS_ATTENTION, CRITICAL }

fun computePlantStatus(
    sensors: List<Sensor>,
    latestData: Map<Int, SensorData?>,
    plantType: PlantType?
): PlantHealthStatus {
    if (plantType == null || sensors.isEmpty()) return PlantHealthStatus.NORMAL

    val deviations = sensors.count { sensor ->
        val data = latestData[sensor.sensorId] ?: return@count false
        val value = data.value
        when (sensor.sensorType) {
            "humidity" -> {
                val optimal = plantType.optimalHumidity
                val tolerance = optimal * 0.20
                value < optimal - tolerance || value > optimal + tolerance
            }
            "temperature" -> {
                val optimal = plantType.optimalTemperature
                val tolerance = optimal * 0.15
                value < optimal - tolerance || value > optimal + tolerance
            }
            "light" -> {
                val optimal = plantType.optimalLight.toDouble()
                val tolerance = optimal * 0.30
                value < optimal - tolerance || value > optimal + tolerance
            }
            else -> false
        }
    }

    return when {
        deviations >= 2 -> PlantHealthStatus.CRITICAL
        deviations == 1 -> PlantHealthStatus.NEEDS_ATTENTION
        else -> PlantHealthStatus.NORMAL
    }
}
