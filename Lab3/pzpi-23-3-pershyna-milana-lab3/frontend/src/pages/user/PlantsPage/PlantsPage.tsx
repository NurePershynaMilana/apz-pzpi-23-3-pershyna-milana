import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Skeleton,
    Button,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetMyPlantsQuery, useDeleteMyPlantMutation } from '@/api/plantsApi';
import { useGetSensorDataQuery } from '@/api/sensorDataApi';
import { PlantCard } from '@/components/plant/PlantCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { calculatePlantStatus } from '@/utils/plantStatus';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import { ROUTES } from '@/routes/routes';
import type { PlantStatus } from '@/utils/plantStatus';
import type { SensorType } from '@/types';

export const PlantsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const snackbar = useSnackbar();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<PlantStatus | 'all'>('all');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const debouncedSearch = useDebounce(search, 300);

    const { data: plantsData, isLoading } = useGetMyPlantsQuery();
    const { data: sensorData } = useGetSensorDataQuery({ limit: 200 });
    const [deletePlant, { isLoading: isDeleting }] = useDeleteMyPlantMutation();

    const plants = plantsData?.data ?? [];
    const allSensorData = sensorData?.data ?? [];

    const plantsWithStatus = useMemo(
        () =>
            plants.map((plant) => {
                const readings: Partial<Record<SensorType, number>> = {};
                plant.sensors?.forEach((sensor) => {
                    const latest = allSensorData.find((d) => d.sensor_id === sensor.sensor_id);
                    if (latest) readings[sensor.sensor_type] = latest.value;
                });
                return { plant, status: calculatePlantStatus(plant, readings) };
            }),
        [plants, allSensorData],
    );

    const filtered = plantsWithStatus.filter(({ plant, status }) => {
        const matchSearch = plant.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchStatus = statusFilter === 'all' || status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deletePlant(deleteId).unwrap();
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <Box>
            <PageHeader
                title={t('plants.title')}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(ROUTES.ADD_PLANT)}
                    >
                        {t('plants.addPlant')}
                    </Button>
                }
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    placeholder={t('common.search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{t('common.status')}</InputLabel>
                    <Select
                        value={statusFilter}
                        label={t('common.status')}
                        onChange={(e) => setStatusFilter(e.target.value as PlantStatus | 'all')}
                    >
                        <MenuItem value="all">{t('plants.all')}</MenuItem>
                        <MenuItem value="normal">{t('plants.status.normal')}</MenuItem>
                        <MenuItem value="attention">{t('plants.status.attention')}</MenuItem>
                        <MenuItem value="critical">{t('plants.status.critical')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading ? (
                <Grid container spacing={2}>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : filtered.length === 0 ? (
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
                    {filtered.map(({ plant, status }) => (
                        <Grid item xs={12} sm={6} md={4} key={plant.plant_id}>
                            <PlantCard
                                plant={plant}
                                status={status}
                                onEdit={() => navigate(`/plants/${plant.plant_id}/edit`)}
                                onDelete={() => setDeleteId(plant.plant_id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <ConfirmDialog
                open={!!deleteId}
                title={t('plants.deletePlant')}
                message={t('plants.deleteConfirm')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={isDeleting}
            />
        </Box>
    );
};
