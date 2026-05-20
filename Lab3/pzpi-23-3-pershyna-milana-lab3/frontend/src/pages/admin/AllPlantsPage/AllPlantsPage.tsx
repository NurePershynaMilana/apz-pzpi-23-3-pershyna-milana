import { Box, Button, TextField, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useGetAllPlantsQuery, useAdminUpdatePlantMutation, useAdminDeletePlantMutation } from '@/api/plantsApi';
import { useGetUsersQuery } from '@/api/usersApi';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useFormatters } from '@/i18n/useFormatters';
import { plantSchema, type PlantFormValues } from '@/utils/validators';
import type { Plant } from '@/types';

export const AllPlantsPage = () => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const { formatDateTime, sortStrings } = useFormatters();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editPlant, setEditPlant] = useState<Plant | null>(null);

    const { data, isLoading } = useGetAllPlantsQuery();
    const { data: usersData } = useGetUsersQuery();
    const [updatePlant, { isLoading: updating }] = useAdminUpdatePlantMutation();
    const [deletePlant, { isLoading: deleting }] = useAdminDeletePlantMutation();

    const usersMap = new Map(
        (usersData?.data ?? []).map((u) => [u.user_id, `${u.first_name} ${u.last_name}`]),
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PlantFormValues>({ resolver: zodResolver(plantSchema) });

    const plants = data?.data ?? [];

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

    const openEdit = (plant: Plant) => {
        setEditPlant(plant);
        reset({
            name: plant.name,
            location: plant.location,
            plant_type_id: plant.plant_type_id,
        });
    };

    const handleEdit = async (values: PlantFormValues) => {
        if (!editPlant) return;
        try {
            await updatePlant({ id: editPlant.plant_id, body: values }).unwrap();
            snackbar.success(t('common.success'));
            setEditPlant(null);
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const columns: GridColDef[] = [
        { field: 'plant_id', headerName: t('common.id'), width: 60 },
        { field: 'name', headerName: t('common.name'), flex: 1, minWidth: 120, sortComparator: sortStrings },
        { field: 'location', headerName: t('plants.location'), width: 140, sortComparator: sortStrings },
        {
            field: 'plantType',
            headerName: t('plants.plantType'),
            width: 140,
            renderCell: (params: GridRenderCellParams<Plant>) => params.row.plantType?.name ?? '—',
        },
        {
            field: 'user_id',
            headerName: t('admin.owner'),
            width: 150,
            renderCell: (params: GridRenderCellParams<Plant, number>) =>
                usersMap.get(params.value!) ?? `ID: ${params.value}`,
        },
        {
            field: 'created_at',
            headerName: t('common.createdAt'),
            width: 160,
            renderCell: (params: GridRenderCellParams<Plant, string>) =>
                params.value ? formatDateTime(params.value) : '—',
        },
        {
            field: 'actions',
            headerName: t('common.actions'),
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Plant>) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        size="small"
                        onClick={() => openEdit(params.row as Plant)}
                        sx={{ minWidth: 0, p: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => setDeleteId((params.row as Plant).plant_id)}
                        sx={{ minWidth: 0, p: 0.5 }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <PageHeader title={t('admin.allPlants')} />
            <Box sx={{ height: 520, bgcolor: 'background.paper', borderRadius: 3 }}>
                <DataGrid
                    rows={plants}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row: Plant) => row.plant_id}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    sx={{ border: 'none', '& .MuiDataGrid-cell': { borderColor: 'divider' } }}
                />
            </Box>
            <Modal
                open={!!editPlant}
                onClose={() => setEditPlant(null)}
                title={t('plants.editPlant')}
                actions={
                    <>
                        <Button onClick={() => setEditPlant(null)}>{t('common.cancel')}</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit(handleEdit)}
                            disabled={updating}
                        >
                            {updating ? t('common.loading') : t('common.save')}
                        </Button>
                    </>
                }
            >
                <Stack spacing={2}>
                    <TextField
                        label={t('plants.plantName')}
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name && t(errors.name.message!)}
                        fullWidth
                    />
                    <TextField
                        label={t('plants.location')}
                        {...register('location')}
                        error={!!errors.location}
                        helperText={errors.location && t(errors.location.message!)}
                        fullWidth
                    />
                </Stack>
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                title={t('plants.deletePlant')}
                message={t('plants.deleteConfirm')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </Box>
    );
};
