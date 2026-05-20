import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Divider,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    PictureAsPdf as PictureAsPdfIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetMyPlantQuery, useDeleteMyPlantMutation } from '@/api/plantsApi';
import { useGetSensorHistoryQuery, useGetSensorDataQuery } from '@/api/sensorDataApi';
import { PlantStatusBadge } from '@/components/plant/PlantStatusBadge';
import { SensorChart } from '@/components/sensor/SensorChart';
import { SensorReadingCard } from '@/components/sensor/SensorReadingCard';
import { ThresholdSlider } from '@/components/sensor/ThresholdSlider';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { calculatePlantStatus } from '@/utils/plantStatus';
import { useExportPDF } from '@/hooks/useExportPDF';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ROUTES } from '@/routes/routes';
import type { SensorType } from '@/types';

type Period = 'day' | 'week' | 'month';

const PERIOD_LIMITS: Record<Period, number> = { day: 48, week: 168, month: 720 };

export const PlantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const plantId = Number(id);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const { exportPlantReport } = useExportPDF();

    const [period, setPeriod] = useState<Period>('week');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeSensorId, setActiveSensorId] = useState<number | null>(null);

    const { data: plantData, isLoading } = useGetMyPlantQuery(plantId);
    const plant = plantData?.data;

    const firstSensor = plant?.sensors?.[0];
    const selectedSensorId = activeSensorId ?? firstSensor?.sensor_id ?? 0;

    const { data: historyData } = useGetSensorHistoryQuery(
        { sensorId: selectedSensorId, limit: PERIOD_LIMITS[period] },
        { skip: !selectedSensorId },
    );

    const { data: recentSensorData } = useGetSensorDataQuery({ limit: 100 });

    const [deletePlant, { isLoading: isDeleting }] = useDeleteMyPlantMutation();

    if (isLoading) return <LoadingSpinner />;
    if (!plant)
        return (
            <Box>
                <Typography>{t('errors.notFound')}</Typography>
            </Box>
        );

    const allSensorData = recentSensorData?.data ?? [];
    const latestReadings: Partial<Record<SensorType, number>> = {};
    plant.sensors?.forEach((sensor) => {
        const latest = allSensorData.find((d) => d.sensor_id === sensor.sensor_id);
        if (latest) latestReadings[sensor.sensor_type] = latest.value;
    });

    const status = calculatePlantStatus(plant, latestReadings);
    const sensorData = historyData?.data ?? [];
    const selectedSensor = plant.sensors?.find((s) => s.sensor_id === selectedSensorId);

    const handleDelete = async () => {
        try {
            await deletePlant(plantId).unwrap();
            snackbar.success(t('common.success'));
            navigate(ROUTES.PLANTS);
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const handleExport = async () => {
        try {
            await exportPlantReport(plant, sensorData);
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const uniqueSensorTypes = [...new Set(plant.sensors?.map((s) => s.sensor_type) ?? [])];

    return (
        <Box>
            <PageHeader
                title={plant.name}
                subtitle={plant.location}
                breadcrumbs={[
                    { label: t('plants.title'), href: ROUTES.PLANTS },
                    { label: plant.name },
                ]}
                actions={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            size="small"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(ROUTES.PLANTS)}
                        >
                            {t('common.back')}
                        </Button>
                        <Button
                            size="small"
                            startIcon={<PictureAsPdfIcon />}
                            variant="outlined"
                            onClick={handleExport}
                        >
                            PDF
                        </Button>
                        <Button
                            size="small"
                            startIcon={<EditIcon />}
                            variant="outlined"
                            onClick={() => navigate(`/plants/${plantId}/edit`)}
                        >
                            {t('common.edit')}
                        </Button>
                        <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            color="error"
                            variant="outlined"
                            onClick={() => setDeleteOpen(true)}
                        >
                            {t('common.delete')}
                        </Button>
                    </Box>
                }
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <PlantStatusBadge status={status} />
                {plant.plantType && (
                    <Chip label={plant.plantType.name} size="small" variant="outlined" />
                )}
            </Box>

            {uniqueSensorTypes.length > 0 && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {uniqueSensorTypes.map((type) => (
                        <Grid item xs={12} sm={4} key={type}>
                            <SensorReadingCard
                                type={type}
                                value={latestReadings[type] ?? null}
                                optimalValue={
                                    type === 'humidity'
                                        ? plant.plantType?.optimal_humidity
                                        : type === 'temperature'
                                          ? plant.plantType?.optimal_temperature
                                          : plant.plantType?.optimal_light
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {plant.sensors && plant.sensors.length > 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6">
                                {selectedSensor
                                    ? t(`sensors.${selectedSensor.sensor_type}`)
                                    : t('sensors.title')}
                            </Typography>
                            <ToggleButtonGroup
                                value={period}
                                exclusive
                                onChange={(_, v) => v && setPeriod(v)}
                                size="small"
                            >
                                <ToggleButton value="day">{t('sensors.period.day')}</ToggleButton>
                                <ToggleButton value="week">{t('sensors.period.week')}</ToggleButton>
                                <ToggleButton value="month">
                                    {t('sensors.period.month')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            {plant.sensors.map((s) => (
                                <Chip
                                    key={s.sensor_id}
                                    label={`${t(`sensors.${s.sensor_type}`)} #${s.sensor_id}`}
                                    onClick={() => setActiveSensorId(s.sensor_id)}
                                    variant={
                                        selectedSensorId === s.sensor_id ? 'filled' : 'outlined'
                                    }
                                    color={selectedSensorId === s.sensor_id ? 'primary' : 'default'}
                                    size="small"
                                />
                            ))}
                        </Box>

                        {selectedSensor && (
                            <SensorChart
                                data={sensorData}
                                type={selectedSensor.sensor_type}
                                period={period}
                                optimalValue={
                                    selectedSensor.sensor_type === 'humidity'
                                        ? plant.plantType?.optimal_humidity
                                        : selectedSensor.sensor_type === 'temperature'
                                          ? plant.plantType?.optimal_temperature
                                          : plant.plantType?.optimal_light
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {plant.sensors && plant.sensors.length > 0 && plant.plant_id && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('sensors.thresholds')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {uniqueSensorTypes.map((type) => (
                                <Box key={type}>
                                    <ThresholdSlider
                                        plantId={plant.plant_id}
                                        sensorType={type}
                                        defaultMin={
                                            type === 'humidity'
                                                ? (plant.plantType?.optimal_humidity ?? 50) * 0.8
                                                : type === 'temperature'
                                                  ? (plant.plantType?.optimal_temperature ?? 20) *
                                                    0.8
                                                  : 0
                                        }
                                        defaultMax={
                                            type === 'humidity'
                                                ? Math.min(
                                                      (plant.plantType?.optimal_humidity ?? 50) *
                                                          1.2,
                                                      100,
                                                  )
                                                : type === 'temperature'
                                                  ? (plant.plantType?.optimal_temperature ?? 20) *
                                                    1.2
                                                  : 10000
                                        }
                                        globalMin={type === 'temperature' ? -20 : 0}
                                        globalMax={
                                            type === 'humidity'
                                                ? 100
                                                : type === 'temperature'
                                                  ? 60
                                                  : 10000
                                        }
                                    />
                                    <Divider sx={{ mt: 2 }} />
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            <ConfirmDialog
                open={deleteOpen}
                title={t('plants.deletePlant')}
                message={t('plants.deleteConfirm')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteOpen(false)}
                loading={isDeleting}
            />
        </Box>
    );
};
