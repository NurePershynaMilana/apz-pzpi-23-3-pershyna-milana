export const TOKEN_KEY = 'plantcare_token';
export const LANGUAGE_KEY = 'plantcare_language';
export const THRESHOLD_KEY = (plantId: number, sensorType: string, bound: 'min' | 'max') =>
    `threshold_${plantId}_${sensorType}_${bound}`;

export const STATUS_COLORS = {
    normal: '#10B981',
    attention: '#F59E0B',
    critical: '#EF4444',
} as const;

export const SENSOR_COLORS = {
    humidity: '#3B82F6',
    temperature: '#EF4444',
    light: '#F59E0B',
} as const;

export const SENSOR_UNITS = {
    humidity: '%',
    temperature: '°C',
    light: 'lux',
} as const;

export const ANIMATION_DURATION = 300;
export const CHART_ANIMATION_DURATION = 600;
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const DEVIATION_THRESHOLD = 0.1;
