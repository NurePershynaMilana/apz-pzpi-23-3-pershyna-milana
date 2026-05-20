package com.plantcare.mobile.ui.plant

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Opacity
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.RangeSlider
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.foundation.Canvas
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import com.plantcare.mobile.R
import com.plantcare.mobile.data.model.Sensor
import com.plantcare.mobile.data.model.SensorData
import com.plantcare.mobile.ui.components.ErrorMessage
import com.plantcare.mobile.ui.components.LoadingIndicator
import com.plantcare.mobile.ui.components.SensorChip
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlantDetailScreen(
    onNavigateBack: () -> Unit,
    onNavigateToEdit: (Int) -> Unit,
    viewModel: PlantDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val chartRange by viewModel.chartRange.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    var showDeleteDialog by remember { mutableStateOf(false) }
    val commandSentMsg = stringResource(R.string.plant_detail_command_sent)

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text(stringResource(R.string.plant_detail_delete_confirm)) },
            text = { Text(stringResource(R.string.plant_detail_delete_message)) },
            confirmButton = {
                TextButton(onClick = {
                    showDeleteDialog = false
                    viewModel.deletePlant(
                        onSuccess = { onNavigateBack() },
                        onError = { msg -> scope.launch { snackbarHostState.showSnackbar(msg) } }
                    )
                }) { Text(stringResource(R.string.confirm)) }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text(stringResource(R.string.cancel))
                }
            }
        )
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = {
                    if (uiState is PlantDetailUiState.Success) {
                        Text((uiState as PlantDetailUiState.Success).plant.name)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = null)
                    }
                },
                actions = {
                    if (uiState is PlantDetailUiState.Success) {
                        val plant = (uiState as PlantDetailUiState.Success).plant
                        IconButton(onClick = { onNavigateToEdit(plant.plantId) }) {
                            Icon(Icons.Default.Edit, contentDescription = stringResource(R.string.plant_detail_edit))
                        }
                        IconButton(onClick = { showDeleteDialog = true }) {
                            Icon(
                                Icons.Default.Delete,
                                contentDescription = stringResource(R.string.plant_detail_delete),
                                tint = MaterialTheme.colorScheme.error
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { padding ->
        when (val state = uiState) {
            is PlantDetailUiState.Loading -> LoadingIndicator(modifier = Modifier.padding(padding))
            is PlantDetailUiState.Error -> ErrorMessage(
                message = state.message,
                onRetry = { viewModel.loadPlant() },
                modifier = Modifier.padding(padding)
            )
            is PlantDetailUiState.Success -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Plant info
                    item {
                        PlantInfoCard(state)
                    }

                    // Sensor readings
                    item {
                        Text(
                            text = stringResource(R.string.plant_detail_sensors),
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    }
                    item {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            state.sensors.forEach { sensor ->
                                val latestData = state.sensorDataMap[sensor.sensorId]?.firstOrNull()
                                SensorChip(
                                    sensorType = sensor.sensorType,
                                    latestData = latestData,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    // Chart range selector
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = chartRange == ChartRange.WEEK,
                                onClick = { if (chartRange != ChartRange.WEEK) viewModel.toggleChartRange() },
                                label = { Text(stringResource(R.string.plant_detail_chart_week)) }
                            )
                            FilterChip(
                                selected = chartRange == ChartRange.MONTH,
                                onClick = { if (chartRange != ChartRange.MONTH) viewModel.toggleChartRange() },
                                label = { Text(stringResource(R.string.plant_detail_chart_month)) }
                            )
                        }
                    }

                    // Charts per sensor
                    state.sensors.forEach { sensor ->
                        item(key = "chart_${sensor.sensorId}") {
                            SensorChart(
                                sensor = sensor,
                                data = state.sensorDataMap[sensor.sensorId] ?: emptyList()
                            )
                        }
                    }

                    // Threshold sliders
                    item {
                        Text(
                            text = stringResource(R.string.plant_detail_thresholds),
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    }
                    state.sensors.forEach { sensor ->
                        item(key = "threshold_${sensor.sensorId}") {
                            ThresholdSlider(
                                sensor = sensor,
                                plantType = state.plant.plantType,
                                viewModel = viewModel
                            )
                        }
                    }

                    // Action buttons
                    item {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            OutlinedButton(
                                onClick = {
                                    scope.launch {
                                        snackbarHostState.showSnackbar(commandSentMsg)
                                    }
                                },
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Opacity, contentDescription = null)
                                Text(
                                    text = stringResource(R.string.plant_detail_water),
                                    modifier = Modifier.padding(start = 4.dp)
                                )
                            }
                            OutlinedButton(
                                onClick = {
                                    scope.launch {
                                        snackbarHostState.showSnackbar(commandSentMsg)
                                    }
                                },
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.LightMode, contentDescription = null)
                                Text(
                                    text = stringResource(R.string.plant_detail_light_test),
                                    modifier = Modifier.padding(start = 4.dp)
                                )
                            }
                        }
                    }

                    item { Spacer(modifier = Modifier.height(16.dp)) }
                }
            }
        }
    }
}

@Composable
private fun PlantInfoCard(state: PlantDetailUiState.Success) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            state.plant.plantType?.let { type ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = stringResource(R.string.plant_detail_type) + ":",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(text = type.name, style = MaterialTheme.typography.bodyMedium)
                }
                Text(
                    text = stringResource(R.string.plant_detail_watering, type.wateringFrequency),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = stringResource(R.string.plant_detail_location) + ":",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(text = state.plant.location, style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}

@Composable
private fun SensorChart(sensor: Sensor, data: List<SensorData>) {
    val sensorLabel = when (sensor.sensorType) {
        "humidity" -> stringResource(R.string.sensor_humidity)
        "temperature" -> stringResource(R.string.sensor_temperature)
        else -> stringResource(R.string.sensor_light)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = sensorLabel,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(12.dp))
            if (data.isNotEmpty()) {
                LineChart(
                    values = data.map { it.value.toFloat() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp),
                    lineColor = MaterialTheme.colorScheme.primary
                )
            } else {
                Text(
                    text = stringResource(R.string.sensor_no_data),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun LineChart(
    values: List<Float>,
    modifier: Modifier = Modifier,
    lineColor: Color = Color.Unspecified,
    strokeWidth: Dp = 2.dp
) {
    Canvas(modifier = modifier) {
        if (values.size < 2) return@Canvas
        val min = values.min()
        val max = values.max()
        val range = (max - min).let { if (it == 0f) 1f else it }
        val path = Path()
        values.forEachIndexed { i, v ->
            val x = i / (values.size - 1f) * size.width
            val y = (1f - (v - min) / range) * size.height
            if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
        }
        drawPath(path, lineColor, style = Stroke(width = strokeWidth.toPx()))
        values.forEachIndexed { i, v ->
            val x = i / (values.size - 1f) * size.width
            val y = (1f - (v - min) / range) * size.height
            drawCircle(lineColor, radius = strokeWidth.toPx() * 1.5f, center = Offset(x, y))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ThresholdSlider(
    sensor: Sensor,
    plantType: com.plantcare.mobile.data.model.PlantType?,
    viewModel: PlantDetailViewModel
) {
    val savedThreshold by viewModel.getThreshold(sensor.sensorType).collectAsState(initial = null)

    val (defaultMin, defaultMax, unit) = when (sensor.sensorType) {
        "humidity" -> Triple(
            plantType?.optimalHumidity?.toFloat()?.minus(20f) ?: 20f,
            plantType?.optimalHumidity?.toFloat()?.plus(20f) ?: 80f,
            "%"
        )
        "temperature" -> Triple(
            plantType?.optimalTemperature?.toFloat()?.minus(5f) ?: 15f,
            plantType?.optimalTemperature?.toFloat()?.plus(5f) ?: 35f,
            "°C"
        )
        else -> Triple(
            plantType?.optimalLight?.toFloat()?.times(0.5f) ?: 500f,
            plantType?.optimalLight?.toFloat()?.times(1.5f) ?: 5000f,
            "lux"
        )
    }

    val sensorLabel = when (sensor.sensorType) {
        "humidity" -> stringResource(R.string.sensor_humidity)
        "temperature" -> stringResource(R.string.sensor_temperature)
        else -> stringResource(R.string.sensor_light)
    }

    var range by remember(savedThreshold, defaultMin, defaultMax) {
        mutableStateOf(
            (savedThreshold?.min ?: defaultMin)..(savedThreshold?.max ?: defaultMax)
        )
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = sensorLabel,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "%.1f – %.1f %s".format(range.start, range.endInclusive, unit),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            val sliderRange = when (sensor.sensorType) {
                "humidity" -> 0f..100f
                "temperature" -> -10f..60f
                else -> 0f..100000f
            }
            RangeSlider(
                value = range,
                onValueChange = { range = it },
                onValueChangeFinished = {
                    viewModel.saveThreshold(sensor.sensorType, range.start, range.endInclusive)
                },
                valueRange = sliderRange
            )
        }
    }
}
