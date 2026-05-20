import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useGetPlantTypesQuery } from '@/api/plantTypesApi';
import { useTranslation } from 'react-i18next';

interface PlantTypeSelectorProps {
    value: number | '';
    onChange: (value: number) => void;
    error?: string;
}

export const PlantTypeSelector = ({ value, onChange, error }: PlantTypeSelectorProps) => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetPlantTypesQuery();

    return (
        <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{t('plants.plantType')}</InputLabel>
            <Select
                value={value}
                label={t('plants.plantType')}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={isLoading}
            >
                {data?.data?.map((type) => (
                    <MenuItem key={type.plant_type_id} value={type.plant_type_id}>
                        {type.name}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};
