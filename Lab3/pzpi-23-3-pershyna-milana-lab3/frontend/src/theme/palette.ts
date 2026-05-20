export const palette = {
    mode: 'dark' as const,
    primary: {
        main: '#7C3AED',
        light: '#A78BFA',
        dark: '#5B21B6',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#EC4899',
        light: '#F472B6',
        dark: '#BE185D',
    },
    background: {
        default: '#0F0F0F',
        paper: '#1A1A1A',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#A1A1AA',
        disabled: '#52525B',
    },
    divider: '#2A2A2A',
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#3B82F6' },
};

export const statusColors = {
    normal: '#10B981',
    attention: '#F59E0B',
    critical: '#EF4444',
};

export const sensorColors = {
    humidity: '#3B82F6',
    temperature: '#EF4444',
    light: '#F59E0B',
};
