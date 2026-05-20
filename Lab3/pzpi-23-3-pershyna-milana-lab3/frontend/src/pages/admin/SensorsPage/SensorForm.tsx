import {
    Box,
    TextField,
    Button,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { sensorSchema, type SensorFormValues } from '@/utils/validators';

interface SensorFormProps {
    onSubmit: (data: SensorFormValues) => void;
    onCancel: () => void;
    loading?: boolean;
    defaultValues?: Partial<SensorFormValues>;
}

export const SensorForm = ({ onSubmit, onCancel, loading, defaultValues }: SensorFormProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<SensorFormValues>({
        resolver: zodResolver(sensorSchema),
        defaultValues: defaultValues ?? {
            plant_id: undefined as unknown as number,
            sensor_type: 'humidity',
            hardware_id: '',
            is_active: true,
        },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <TextField
                    label="Plant ID"
                    type="number"
                    {...register('plant_id', { valueAsNumber: true })}
                    error={!!errors.plant_id}
                    fullWidth
                    InputLabelProps={watch('plant_id') ? { shrink: true } : undefined}
                />
                <Controller
                    name="sensor_type"
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small" fullWidth>
                            <InputLabel>{t('sensors.sensorType')}</InputLabel>
                            <Select {...field} label={t('sensors.sensorType')}>
                                <MenuItem value="humidity">{t('sensors.humidity')}</MenuItem>
                                <MenuItem value="temperature">{t('sensors.temperature')}</MenuItem>
                                <MenuItem value="light">{t('sensors.light')}</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <TextField
                    label={t('sensors.hardwareId')}
                    {...register('hardware_id')}
                    error={!!errors.hardware_id}
                    helperText={errors.hardware_id && t(errors.hardware_id.message!)}
                    fullWidth
                    InputLabelProps={watch('hardware_id') ? { shrink: true } : undefined}
                />
                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label={t('sensors.isActive')}
                        />
                    )}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel} disabled={loading}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? t('common.loading') : t('common.save')}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};
