import { Box, Button, TextField, Stack } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/i18n/useFormatters';
import {
    useGetPlantTypesQuery,
    useCreatePlantTypeMutation,
    useUpdatePlantTypeMutation,
    useDeletePlantTypeMutation,
} from '@/api/plantTypesApi';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { useSnackbar } from '@/hooks/useSnackbar';
import { plantTypeSchema, type PlantTypeFormValues } from '@/utils/validators';
import type { PlantType } from '@/types';

export const PlantTypesPage = () => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const { sortStrings } = useFormatters();

    const [modalOpen, setModalOpen] = useState(false);
    const [editType, setEditType] = useState<PlantType | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading } = useGetPlantTypesQuery();
    const [createType, { isLoading: creating }] = useCreatePlantTypeMutation();
    const [updateType, { isLoading: updating }] = useUpdatePlantTypeMutation();
    const [deleteType, { isLoading: deleting }] = useDeletePlantTypeMutation();

    const types = data?.data ?? [];

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PlantTypeFormValues>({
        resolver: zodResolver(plantTypeSchema),
    });

    const nameValue = watch('name');

    const handleOpen = (type?: PlantType) => {
        setEditType(type ?? null);
        reset(
            type ?? {
                name: '',
                optimal_humidity: 60,
                optimal_temperature: 22,
                optimal_light: 500,
                watering_frequency: 3,
            },
        );
        setModalOpen(true);
    };

    const handleSave = async (data: PlantTypeFormValues) => {
        try {
            if (editType) {
                await updateType({ id: editType.plant_type_id, body: data }).unwrap();
            } else {
                await createType(data).unwrap();
            }
            snackbar.success(t('common.success'));
            setModalOpen(false);
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteType(deleteId).unwrap();
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        } finally {
            setDeleteId(null);
        }
    };

    const columns: GridColDef[] = [
        { field: 'plant_type_id', headerName: t('common.id'), width: 60 },
        { field: 'name', headerName: t('common.name'), flex: 1, sortComparator: sortStrings },
        { field: 'optimal_humidity', headerName: t('plantTypes.colHumidity'), width: 110 },
        { field: 'optimal_temperature', headerName: t('plantTypes.colTemperature'), width: 100 },
        { field: 'optimal_light', headerName: t('plantTypes.colLight'), width: 100 },
        { field: 'watering_frequency', headerName: t('plantTypes.colWatering'), width: 110 },
        {
            field: 'actions',
            headerName: t('common.actions'),
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams<PlantType>) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        size="small"
                        onClick={() => handleOpen(params.row as PlantType)}
                        sx={{ minWidth: 0, p: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => setDeleteId((params.row as PlantType).plant_type_id)}
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
            <PageHeader
                title={t('admin.plantTypes')}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        {t('common.add')}
                    </Button>
                }
            />
            <Box sx={{ height: 520, bgcolor: 'background.paper', borderRadius: 3 }}>
                <DataGrid
                    rows={types}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row: PlantType) => row.plant_type_id}
                    pageSizeOptions={[10, 25]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    sx={{ border: 'none', '& .MuiDataGrid-cell': { borderColor: 'divider' } }}
                />
            </Box>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editType ? t('plantTypes.editType') : t('plantTypes.addType')}
            >
                <Box component="form" onSubmit={handleSubmit(handleSave)}>
                    <Stack spacing={2}>
                        <TextField
                            label={t('common.name')}
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name && t(errors.name.message!)}
                            fullWidth
                            InputLabelProps={nameValue ? { shrink: true } : undefined}
                        />
                        <TextField
                            label={t('plantTypes.optimalHumidity')}
                            type="number"
                            {...register('optimal_humidity', { valueAsNumber: true })}
                            error={!!errors.optimal_humidity}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label={t('plantTypes.optimalTemperature')}
                            type="number"
                            {...register('optimal_temperature', { valueAsNumber: true })}
                            error={!!errors.optimal_temperature}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label={t('plantTypes.optimalLight')}
                            type="number"
                            {...register('optimal_light', { valueAsNumber: true })}
                            error={!!errors.optimal_light}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label={t('plantTypes.wateringFrequency')}
                            type="number"
                            {...register('watering_frequency', { valueAsNumber: true })}
                            error={!!errors.watering_frequency}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button onClick={() => setModalOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={creating || updating}
                            >
                                {creating || updating ? t('common.loading') : t('common.save')}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                title={t('plantTypes.deleteType')}
                message={t('plantTypes.confirmDelete')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </Box>
    );
};
