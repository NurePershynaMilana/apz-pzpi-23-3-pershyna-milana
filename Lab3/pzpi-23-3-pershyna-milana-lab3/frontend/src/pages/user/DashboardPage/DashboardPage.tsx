import { Box, Grid, Card, CardContent, Typography, Button, Skeleton } from '@mui/material';
import { Add as AddIcon, PictureAsPdf as PictureAsPdfIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetMyPlantsQuery } from '@/api/plantsApi';
import { useGetSensorDataQuery } from '@/api/sensorDataApi';
import { useAuth } from '@/hooks/useAuth';
import { useExportPDF } from '@/hooks/useExportPDF';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useFormatters } from '@/i18n/useFormatters';
import { PlantCard } from '@/components/plant/PlantCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { calculatePlantStatus } from '@/utils/plantStatus';
import { STATUS_COLORS } from '@/utils/constants';
import { ROUTES } from '@/routes/routes';
import { useMemo } from 'react';
import { format } from 'date-fns';
import type { SensorType } from '@/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ color, mt: 0.5 }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

export const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { exportDashboardReport } = useExportPDF();
    const snackbar = useSnackbar();
    const { formatDate } = useFormatters();

    const { data: plantsData, isLoading: plantsLoading } = useGetMyPlantsQuery();
    const { data: sensorData } = useGetSensorDataQuery({ limit: 200 });

    const plants = plantsData?.data ?? [];
    const allSensorData = sensorData?.data ?? [];

    const statuses = useMemo(
        () =>
            plants.map((plant) => {
                const readings: Partial<Record<SensorType, number>> = {};
                plant.sensors?.forEach((sensor) => {
                    const latest = allSensorData.find((d) => d.sensor_id === sensor.sensor_id);
                    if (latest) readings[sensor.sensor_type] = latest.value;
                });
                return calculatePlantStatus(plant, readings);
            }),
        [plants, allSensorData],
    );

    const normalCount = statuses.filter((s) => s === 'normal').length;
    const attentionCount = statuses.filter((s) => s === 'attention').length;
    const criticalCount = statuses.filter((s) => s === 'critical').length;

    const weekChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        allSensorData.forEach((d) => {
            const key = format(new Date(d.timestamp || d.created_at), 'yyyy-MM-dd');
            counts[key] = (counts[key] ?? 0) + 1;
        });
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const key = format(date, 'yyyy-MM-dd');
            return { day: formatDate(date), count: counts[key] ?? 0 };
        });
    }, [allSensorData, formatDate]);

    const handleExportPDF = async () => {
        try {
            await exportDashboardReport(plants);
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    return (
        <Box>
            <PageHeader
                title={t('dashboard.greeting', { name: user?.first_name ?? '' })}
                subtitle={t('dashboard.today', { date: formatDate(new Date()) })}
                actions={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportPDF}
                            size="small"
                        >
                            {t('dashboard.exportPDF')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(ROUTES.ADD_PLANT)}
                            size="small"
                        >
                            {t('plants.addPlant')}
                        </Button>
                    </Box>
                }
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: t('plants.total'), value: plants.length, color: '#7C3AED' },
                    { label: t('plants.normal'), value: normalCount, color: STATUS_COLORS.normal },
                    {
                        label: t('plants.attention'),
                        value: attentionCount,
                        color: STATUS_COLORS.attention,
                    },
                    {
                        label: t('plants.critical'),
                        value: criticalCount,
                        color: STATUS_COLORS.critical,
                    },
                ].map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <DashboardIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6">{t('dashboard.sensorActivity')}</Typography>
                        </Box>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weekChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 11, fill: '#A1A1AA' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#A1A1AA' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1A1A1A',
                                        border: '1px solid #2A2A2A',
                                        borderRadius: 8,
                                    }}
                                    formatter={(value) => [value, t('sensors.title')]}
                                    cursor={false}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#7C3AED"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('dashboard.myPlants')}
            </Typography>

            {plantsLoading ? (
                <Grid container spacing={2}>
                    {[1, 2, 3].map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : plants.length === 0 ? (
                <EmptyState
                    title={t('plants.noPlants')}
                    description={t('plants.noPlantDescription')}
                    action={{
                        label: t('plants.addPlant'),
                        onClick: () => navigate(ROUTES.ADD_PLANT),
                    }}
                />
            ) : (
                <Grid container spacing={2}>
                    {plants.map((plant, i) => (
                        <Grid item xs={12} sm={6} md={4} key={plant.plant_id}>
                            <PlantCard
                                plant={plant}
                                status={statuses[i]}
                                onEdit={() => navigate(`/plants/${plant.plant_id}/edit`)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
