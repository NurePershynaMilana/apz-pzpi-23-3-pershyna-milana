import { Card, CardContent, Box, Typography } from '@mui/material';
import { Opacity as OpacityIcon, Thermostat as ThermostatIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import type { SensorType } from '@/types';
import { SENSOR_COLORS, SENSOR_UNITS } from '@/utils/constants';
import { useTranslation } from 'react-i18next';

const getIcon = (type: SensorType) => {
    if (type === 'humidity') return <OpacityIcon />;
    if (type === 'temperature') return <ThermostatIcon />;
    return <LightModeIcon />;
};

interface SensorReadingCardProps {
    type: SensorType;
    value: number | null;
    optimalValue?: number;
}

export const SensorReadingCard = ({ type, value, optimalValue }: SensorReadingCardProps) => {
    const { t } = useTranslation();
    const color = SENSOR_COLORS[type];
    const unit = SENSOR_UNITS[type];

    const deviation =
        value != null && optimalValue != null
            ? Math.abs(value - optimalValue) / optimalValue
            : null;

    const statusColor =
        deviation == null
            ? '#A1A1AA'
            : deviation > 0.2
              ? '#EF4444'
              : deviation > 0.1
                ? '#F59E0B'
                : '#10B981';

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: `${color}20`,
                            color,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {getIcon(type)}
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {t(`sensors.${type}`)}
                    </Typography>
                </Box>

                <Typography variant="h4" fontWeight={700} sx={{ color: statusColor }}>
                    {value != null ? `${value}${unit}` : '—'}
                </Typography>

                {optimalValue != null && (
                    <Typography variant="caption" color="text.disabled">
                        {t('plants.optimalValues')}: {optimalValue}
                        {unit}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};
