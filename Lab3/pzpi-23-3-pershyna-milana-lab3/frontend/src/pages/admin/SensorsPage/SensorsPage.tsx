import { Box, Button, Switch, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useGetSensorsQuery,
    useUpdateSensorMutation,
    useDeleteSensorMutation,
    useCreateSensorMutation,
} from '@/api/sensorsApi';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { useSnackbar } from '@/hooks/useSnackbar';
import type { Sensor, SensorType } from '@/types';
import { SENSOR_COLORS } from '@/utils/constants';
import { SensorForm } from './SensorForm';
import type { SensorFormValues } from '@/utils/validators';

export const SensorsPage = () => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const [modalOpen, setModalOpen] = useState(false);
    const [editSensor, setEditSensor] = useState<Sensor | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading } = useGetSensorsQuery();
    const [updateSensor] = useUpdateSensorMutation();
    const [deleteSensor, { isLoading: deleting }] = useDeleteSensorMutation();
    const [createSensor, { isLoading: creating }] = useCreateSensorMutation();

    const sensors = data?.data ?? [];

    const handleToggle = async (sensor: Sensor) => {
        try {
            await updateSensor({
                id: sensor.sensor_id,
                body: { is_active: !sensor.is_active },
            }).unwrap();
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteSensor(deleteId).unwrap();
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        } finally {
            setDeleteId(null);
        }
    };

    const handleCreate = async (values: SensorFormValues) => {
        try {
            await createSensor(values).unwrap();
            snackbar.success(t('common.success'));
            setModalOpen(false);
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const handleEdit = async (values: SensorFormValues) => {
        if (!editSensor) return;
        try {
            await updateSensor({ id: editSensor.sensor_id, body: values }).unwrap();
            snackbar.success(t('common.success'));
            setEditSensor(null);
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const openEdit = (sensor: Sensor) => setEditSensor(sensor);

    const columns: GridColDef[] = [
        { field: 'sensor_id', headerName: t('common.id'), width: 60 },
        {
            field: 'sensor_type',
            headerName: t('sensors.sensorType'),
            width: 130,
            renderCell: (params: GridRenderCellParams<Sensor, SensorType>) => {
                const color = SENSOR_COLORS[params.value!];
                return (
                    <Chip
                        label={t(`sensors.${params.value}`)}
                        size="small"
                        sx={{ bgcolor: `${color}20`, color, border: `1px solid ${color}40` }}
                    />
                );
            },
        },
        { field: 'hardware_id', headerName: t('sensors.hardwareId'), flex: 1, minWidth: 140 },
        { field: 'plant_id', headerName: t('sensors.plant') + ' ID', width: 90 },
        {
            field: 'is_active',
            headerName: t('sensors.isActive'),
            width: 90,
            renderCell: (params: GridRenderCellParams<Sensor, boolean>) => (
                <Switch
                    checked={params.value}
                    size="small"
                    onChange={() => handleToggle(params.row as Sensor)}
                    color="success"
                />
            ),
        },
        {
            field: 'actions',
            headerName: t('common.actions'),
            width: 110,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Sensor>) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        size="small"
                        onClick={() => openEdit(params.row as Sensor)}
                        sx={{ minWidth: 0, p: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => setDeleteId((params.row as Sensor).sensor_id)}
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
                title={t('sensors.title')}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setModalOpen(true)}
                    >
                        {t('common.add')}
                    </Button>
                }
            />
            <Box sx={{ height: 520, bgcolor: 'background.paper', borderRadius: 3 }}>
                <DataGrid
                    rows={sensors}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row: Sensor) => row.sensor_id}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    sx={{ border: 'none', '& .MuiDataGrid-cell': { borderColor: 'divider' } }}
                />
            </Box>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={t('sensors.addSensor')}
            >
                <SensorForm
                    onSubmit={handleCreate}
                    onCancel={() => setModalOpen(false)}
                    loading={creating}
                />
            </Modal>

            <Modal
                open={!!editSensor}
                onClose={() => setEditSensor(null)}
                title={t('sensors.editSensor')}
            >
                {editSensor && (
                    <SensorForm
                        defaultValues={{
                            plant_id: editSensor.plant_id,
                            sensor_type: editSensor.sensor_type,
                            hardware_id: editSensor.hardware_id,
                            is_active: editSensor.is_active,
                        }}
                        onSubmit={handleEdit}
                        onCancel={() => setEditSensor(null)}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                title={t('sensors.deleteSensor')}
                message={t('sensors.confirmDelete')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </Box>
    );
};
