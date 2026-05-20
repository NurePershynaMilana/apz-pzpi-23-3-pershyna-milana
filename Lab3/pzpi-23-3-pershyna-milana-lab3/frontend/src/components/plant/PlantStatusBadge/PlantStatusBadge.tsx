import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { PlantStatus } from '@/utils/plantStatus';
import { STATUS_COLORS } from '@/utils/constants';
import { FiberManualRecord as FiberManualRecordIcon } from '@mui/icons-material';

interface PlantStatusBadgeProps {
    status: PlantStatus;
}

export const PlantStatusBadge = ({ status }: PlantStatusBadgeProps) => {
    const { t } = useTranslation();
    const color = STATUS_COLORS[status];

    return (
        <Chip
            icon={
                <FiberManualRecordIcon
                    sx={{ fontSize: '10px !important', color: `${color} !important` }}
                />
            }
            label={t(`plants.status.${status}`)}
            size="small"
            sx={{
                bgcolor: `${color}18`,
                color,
                border: `1px solid ${color}40`,
                fontWeight: 600,
                fontSize: '0.7rem',
            }}
        />
    );
};
