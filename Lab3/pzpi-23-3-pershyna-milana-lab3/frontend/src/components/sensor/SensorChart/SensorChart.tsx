import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import type { SensorData, SensorType } from '@/types';
import { SENSOR_COLORS, SENSOR_UNITS } from '@/utils/constants';

interface SensorChartProps {
    data: SensorData[];
    type: SensorType;
    period: 'day' | 'week' | 'month';
    optimalValue?: number;
}

const gradientId = (type: SensorType) => `gradient-${type}`;

interface TooltipPayload {
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    unit: string;
    typeLabel: string;
}

const CustomTooltip = ({ active, payload, label, unit, typeLabel }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    bgcolor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: 2,
                    p: 1.5,
                    fontSize: 12,
                }}
            >
                <Typography variant="caption" color="text.secondary" display="block">
                    {label}
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                    {typeLabel}: {payload[0].value}
                    {unit}
                </Typography>
            </Box>
        );
    }
    return null;
};

const PERIOD_FORMAT: Record<string, string> = {
    day: 'HH:mm',
    week: 'dd MMM',
    month: 'dd.MM',
};

export const SensorChart = ({ data, type, period, optimalValue }: SensorChartProps) => {
    const { t, i18n } = useTranslation();
    const color = SENSOR_COLORS[type];
    const unit = SENSOR_UNITS[type];
    const locale = i18n.language === 'uk' ? uk : enUS;
    const timeFormat = PERIOD_FORMAT[period] ?? 'dd MMM HH:mm';

    const chartData = data
        .slice()
        .reverse()
        .map((d) => ({
            time: format(new Date(d.timestamp || d.created_at), timeFormat, { locale }),
            value: d.value,
        }));

    if (chartData.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                }}
            >
                <Typography variant="body2" color="text.disabled">
                    {t('common.noData')}
                </Typography>
            </Box>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId(type)} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#A1A1AA' }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tick={{ fontSize: 10, fill: '#A1A1AA' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}${unit}`}
                />
                <Tooltip content={<CustomTooltip unit={unit} typeLabel={t(`sensors.${type}`)} />} />
                {optimalValue != null && (
                    <ReferenceLine
                        y={optimalValue}
                        stroke={color}
                        strokeDasharray="4 4"
                        strokeOpacity={0.6}
                    />
                )}
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#${gradientId(type)})`}
                    animationDuration={600}
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
