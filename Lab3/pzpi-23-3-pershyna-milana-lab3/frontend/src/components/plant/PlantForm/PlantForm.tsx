import { Box, TextField, Button, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { plantSchema, type PlantFormValues } from '@/utils/validators';
import { PlantTypeSelector } from '../PlantTypeSelector';

interface PlantFormProps {
    defaultValues?: Partial<PlantFormValues>;
    onSubmit: (data: PlantFormValues) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const PlantForm = ({ defaultValues, onSubmit, onCancel, loading }: PlantFormProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PlantFormValues>({
        resolver: zodResolver(plantSchema),
        defaultValues: { name: '', location: '', plant_type_id: undefined, ...defaultValues },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                <Controller
                    name="plant_type_id"
                    control={control}
                    render={({ field }) => (
                        <PlantTypeSelector
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            error={errors.plant_type_id && t(errors.plant_type_id.message!)}
                        />
                    )}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
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
