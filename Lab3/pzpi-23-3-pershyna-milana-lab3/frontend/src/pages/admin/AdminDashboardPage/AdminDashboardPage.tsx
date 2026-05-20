import { Box, Grid, Card, CardContent, Typography, Button, Skeleton } from '@mui/material';
import {
    People as PeopleIcon,
    LocalFlorist as LocalFloristIcon,
    Sensors as SensorsIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/i18n/useFormatters';
import { useGetUsersQuery } from '@/api/usersApi';
import { useGetAllPlantsQuery } from '@/api/plantsApi';
import { useGetSensorsQuery } from '@/api/sensorsApi';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTES } from '@/routes/routes';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

const StatCard = ({
    label,
    value,
    icon,
    color,
    loading,
}: {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    loading: boolean;
}) => (
    <Card>
        <CardContent>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                }}
            >
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}20`, color }}>{icon}</Box>
            </Box>
            {loading ? (
                <Skeleton width={60} height={48} />
            ) : (
                <Typography variant="h3" fontWeight={700} sx={{ color }}>
                    {value}
                </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </CardContent>
    </Card>
);

export const AdminDashboardPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { formatMonthYear } = useFormatters();

    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    const { data: plantsData, isLoading: plantsLoading } = useGetAllPlantsQuery();
    const { data: sensorsData, isLoading: sensorsLoading } = useGetSensorsQuery();

    const users = usersData?.data ?? [];
    const plants = plantsData?.data ?? [];
    const sensors = sensorsData?.data ?? [];
    const activeSensors = sensors.filter((s) => s.is_active).length;

    const userGrowthData = useMemo(() => {
        const months: Record<string, number> = {};
        users.forEach((u) => {
            const month = formatMonthYear(u.created_at);
            months[month] = (months[month] ?? 0) + 1;
        });
        return Object.entries(months)
            .slice(-6)
            .map(([month, count]) => ({ month, count }));
    }, [users, formatMonthYear]);

    const quickLinks = [
        { label: t('admin.users'), path: ROUTES.ADMIN_USERS },
        { label: t('admin.allPlants'), path: ROUTES.ADMIN_PLANTS },
        { label: t('admin.plantTypes'), path: ROUTES.ADMIN_PLANT_TYPES },
        { label: t('admin.sensors'), path: ROUTES.ADMIN_SENSORS },
        { label: t('admin.backup'), path: ROUTES.ADMIN_BACKUP },
    ];

    return (
        <Box>
            <PageHeader title={t('admin.title')} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        label={t('admin.totalUsers')}
                        value={users.length}
                        icon={<PeopleIcon />}
                        color="#7C3AED"
                        loading={usersLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        label={t('admin.totalPlants')}
                        value={plants.length}
                        icon={<LocalFloristIcon />}
                        color="#10B981"
                        loading={plantsLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        label={t('admin.totalSensors')}
                        value={sensors.length}
                        icon={<SensorsIcon />}
                        color="#3B82F6"
                        loading={sensorsLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        label={t('admin.activeSensors')}
                        value={activeSensors}
                        icon={<CheckCircleIcon />}
                        color="#10B981"
                        loading={sensorsLoading}
                    />
                </Grid>
            </Grid>

            {userGrowthData.length > 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('admin.userGrowth')}
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                <XAxis
                                    dataKey="month"
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
                                    cursor={false}
                                />
                                <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('admin.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {quickLinks.map((link) => (
                    <Button key={link.path} variant="outlined" onClick={() => navigate(link.path)}>
                        {link.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};
