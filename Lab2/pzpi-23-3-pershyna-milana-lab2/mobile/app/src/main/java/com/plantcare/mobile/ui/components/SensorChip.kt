package com.plantcare.mobile.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Opacity
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.plantcare.mobile.R
import com.plantcare.mobile.data.model.SensorData

private data class SensorDisplay(val label: String, val unit: String, val icon: ImageVector)

@Composable
fun SensorChip(
    sensorType: String,
    latestData: SensorData?,
    modifier: Modifier = Modifier
) {
    val display = when (sensorType) {
        "humidity" -> SensorDisplay(
            label = stringResource(R.string.sensor_humidity),
            unit = stringResource(R.string.sensor_unit_humidity),
            icon = Icons.Default.Opacity
        )
        "temperature" -> SensorDisplay(
            label = stringResource(R.string.sensor_temperature),
            unit = stringResource(R.string.sensor_unit_temperature),
            icon = Icons.Default.Thermostat
        )
        else -> SensorDisplay(
            label = stringResource(R.string.sensor_light),
            unit = stringResource(R.string.sensor_unit_light),
            icon = Icons.Default.WbSunny
        )
    }

    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = display.icon,
                contentDescription = display.label,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp)
            )
            Column {
                Text(
                    text = display.label,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = if (latestData != null) {
                        val v = latestData.value
                        when (sensorType) {
                            "light" -> "%.0f %s".format(v, display.unit)
                            else -> "%.1f%s".format(v, display.unit)
                        }
                    } else {
                        stringResource(R.string.sensor_no_data)
                    },
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}
