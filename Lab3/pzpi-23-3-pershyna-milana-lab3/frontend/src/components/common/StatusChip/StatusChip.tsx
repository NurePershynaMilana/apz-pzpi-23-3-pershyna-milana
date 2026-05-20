import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

type StatusVariant = 'normal' | 'attention' | 'critical' | 'success' | 'warning' | 'error' | 'info';

const STATUS_COLORS: Record<StatusVariant, string> = {
    normal: '#10B981',
    success: '#10B981',
    attention: '#F59E0B',
    warning: '#F59E0B',
    critical: '#EF4444',
    error: '#EF4444',
    info: '#3B82F6',
};

interface StatusChipProps {
    status: StatusVariant;
    label?: string;
    size?: 'small' | 'medium';
}

export const StatusChip = ({ status, label, size = 'small' }: StatusChipProps) => {
    const { t } = useTranslation();
    const color = STATUS_COLORS[status];
    const displayLabel = label ?? t(`plants.status.${status}`, { defaultValue: status });

    return (
        <Chip
            label={displayLabel}
            size={size}
            sx={{
                bgcolor: `${color}20`,
                color,
                border: `1px solid ${color}40`,
                fontWeight: 600,
            }}
        />
    );
};
