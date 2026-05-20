import { Box, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { SensorType } from '@/types';
import { THRESHOLD_KEY, SENSOR_COLORS, SENSOR_UNITS } from '@/utils/constants';

interface ThresholdSliderProps {
    plantId: number;
    sensorType: SensorType;
    defaultMin?: number;
    defaultMax?: number;
    globalMin?: number;
    globalMax?: number;
}

export const ThresholdSlider = ({
    plantId,
    sensorType,
    defaultMin = 0,
    defaultMax = 100,
    globalMin = 0,
    globalMax = 100,
}: ThresholdSliderProps) => {
    const { t } = useTranslation();
    const color = SENSOR_COLORS[sensorType];
    const unit = SENSOR_UNITS[sensorType];

    const [min, setMin] = useLocalStorage(THRESHOLD_KEY(plantId, sensorType, 'min'), defaultMin);
    const [max, setMax] = useLocalStorage(THRESHOLD_KEY(plantId, sensorType, 'max'), defaultMax);

    const handleChange = (_: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setMin(newValue[0]);
            setMax(newValue[1]);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {t(`sensors.${sensorType}`)} {t('sensors.thresholds')}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color }}>
                    {min}
                    {unit} – {max}
                    {unit}
                </Typography>
            </Box>
            <Slider
                value={[min, max]}
                onChange={handleChange}
                min={globalMin}
                max={globalMax}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}${unit}`}
                sx={{
                    color,
                    '& .MuiSlider-thumb': { borderRadius: 2 },
                }}
            />
        </Box>
    );
};
