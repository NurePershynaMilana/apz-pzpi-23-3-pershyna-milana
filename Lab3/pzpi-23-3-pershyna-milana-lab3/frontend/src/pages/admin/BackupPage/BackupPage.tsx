import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Alert,
    LinearProgress,
} from '@mui/material';
import { Download as DownloadIcon, Upload as UploadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetUsersQuery } from '@/api/usersApi';
import { useGetAllPlantsQuery, useAdminCreatePlantMutation } from '@/api/plantsApi';
import { useGetPlantTypesQuery, useCreatePlantTypeMutation } from '@/api/plantTypesApi';
import { useGetSensorsQuery, useCreateSensorMutation } from '@/api/sensorsApi';
import { useGetSensorDataQuery } from '@/api/sensorDataApi';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import { downloadJson, readJsonFile, formatBackupDate } from '@/utils/exportImport';
import type { PlantType, Plant, Sensor } from '@/types';

interface BackupData {
    exportedAt: string;
    version: string;
    data: {
        users: unknown[];
        plants: Plant[];
        plantTypes: PlantType[];
        sensors: Sensor[];
        sensorData: unknown[];
    };
}

export const BackupPage = () => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const fileRef = useRef<HTMLInputElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [parsedBackup, setParsedBackup] = useState<BackupData | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    const { refetch: refetchUsers } = useGetUsersQuery();
    const { refetch: refetchPlants } = useGetAllPlantsQuery();
    const { data: plantTypesData, refetch: refetchTypes } = useGetPlantTypesQuery();
    const { data: sensorsData, refetch: refetchSensors } = useGetSensorsQuery();
    const { data: sensorDataResult } = useGetSensorDataQuery({ limit: 1000 });

    const [createPlantType] = useCreatePlantTypeMutation();
    const [adminCreatePlant] = useAdminCreatePlantMutation();
    const [createSensor] = useCreateSensorMutation();

    const handleExportAll = async () => {
        setIsExporting(true);
        try {
            const [usersRes, plantsRes, typesRes, sensorsRes] = await Promise.all([
                refetchUsers(),
                refetchPlants(),
                refetchTypes(),
                refetchSensors(),
            ]);

            const backup = {
                exportedAt: new Date().toISOString(),
                version: '1.0',
                data: {
                    users: usersRes.data?.data ?? [],
                    plants: plantsRes.data?.data ?? [],
                    plantTypes: typesRes.data?.data ?? [],
                    sensors: sensorsRes.data?.data ?? [],
                    sensorData: sensorDataResult?.data ?? [],
                },
            };

            downloadJson(backup, `plant-care-backup-${formatBackupDate()}.json`);
            snackbar.success(t('admin.backupSuccess'));
        } catch {
            snackbar.error(t('admin.backupError'));
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportSettings = () => {
        const settings = {
            exportedAt: new Date().toISOString(),
            type: 'settings',
            data: {
                plantTypes: plantTypesData?.data ?? [],
                sensors: sensorsData?.data ?? [],
            },
        };
        downloadJson(settings, `plant-care-settings-${formatBackupDate()}.json`);
        snackbar.success(t('admin.backupSuccess'));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const parsed = await readJsonFile(file);
            setParsedBackup(parsed as BackupData);
        } catch {
            snackbar.error(t('admin.importError'));
        } finally {
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleImportConfirm = async () => {
        if (!parsedBackup?.data) return;
        setConfirmOpen(false);
        setIsImporting(true);

        let imported = 0;
        let failed = 0;

        const { plantTypes = [], plants = [], sensors = [] } = parsedBackup.data;
        const total = plantTypes.length + plants.length + sensors.length;
        let done = 0;

        for (const pt of plantTypes) {
            try {
                await createPlantType({
                    name: pt.name,
                    optimal_humidity: pt.optimal_humidity,
                    optimal_temperature: pt.optimal_temperature,
                    optimal_light: pt.optimal_light,
                    watering_frequency: pt.watering_frequency,
                }).unwrap();
                imported++;
            } catch {
                failed++;
            }
            done++;
            setImportProgress(total > 0 ? Math.round((done / total) * 100) : 100);
        }

        for (const plant of plants) {
            try {
                await adminCreatePlant({
                    user_id: plant.user_id,
                    plant_type_id: plant.plant_type_id,
                    name: plant.name,
                    location: plant.location,
                }).unwrap();
                imported++;
            } catch {
                failed++;
            }
            done++;
            setImportProgress(total > 0 ? Math.round((done / total) * 100) : 100);
        }

        for (const sensor of sensors) {
            try {
                await createSensor({
                    plant_id: sensor.plant_id,
                    sensor_type: sensor.sensor_type,
                    hardware_id: sensor.hardware_id,
                    is_active: sensor.is_active,
                }).unwrap();
                imported++;
            } catch {
                failed++;
            }
            done++;
            setImportProgress(total > 0 ? Math.round((done / total) * 100) : 100);
        }

        setIsImporting(false);
        setParsedBackup(null);
        setImportProgress(0);

        if (failed === 0) {
            snackbar.success(t('admin.importSummary', { imported, failed }));
        } else {
            snackbar.error(t('admin.importSummary', { imported, failed }));
        }
    };

    return (
        <Box>
            <PageHeader title={t('admin.backup')} />

            {(isExporting || isImporting) && (
                <LinearProgress
                    variant={isImporting ? 'determinate' : 'indeterminate'}
                    value={importProgress}
                    sx={{ mb: 2, borderRadius: 1 }}
                />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {t('admin.exportData')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('admin.exportAllDescription')}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportAll}
                            disabled={isExporting}
                        >
                            {isExporting ? t('common.loading') : t('admin.exportData')}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {t('admin.exportSettings')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('admin.exportSettingsDescription')}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<SettingsIcon />}
                            onClick={handleExportSettings}
                        >
                            {t('admin.exportSettings')}
                        </Button>
                    </CardContent>
                </Card>

                <Divider />

                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {t('admin.importData')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('admin.importDescription')}
                        </Typography>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".json"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            onClick={() => fileRef.current?.click()}
                            disabled={isImporting}
                        >
                            {t('admin.importData')}
                        </Button>

                        {parsedBackup && (
                            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {t('common.createdAt')}: {new Date(parsedBackup.exportedAt).toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {t('plantTypes.title')}: {parsedBackup.data.plantTypes?.length ?? 0} •{' '}
                                    {t('plants.title')}: {parsedBackup.data.plants?.length ?? 0} •{' '}
                                    {t('sensors.title')}: {parsedBackup.data.sensors?.length ?? 0}
                                </Typography>
                                <Box sx={{ mt: 1.5 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => setConfirmOpen(true)}
                                        disabled={isImporting}
                                    >
                                        {t('common.confirm')}
                                    </Button>
                                    <Button
                                        size="small"
                                        sx={{ ml: 1 }}
                                        onClick={() => setParsedBackup(null)}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </Box>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Box>

            <ConfirmDialog
                open={confirmOpen}
                title={t('admin.confirmImportTitle')}
                message={t('admin.confirmImportMessage')}
                onConfirm={handleImportConfirm}
                onCancel={() => setConfirmOpen(false)}
                loading={isImporting}
            />
        </Box>
    );
};
