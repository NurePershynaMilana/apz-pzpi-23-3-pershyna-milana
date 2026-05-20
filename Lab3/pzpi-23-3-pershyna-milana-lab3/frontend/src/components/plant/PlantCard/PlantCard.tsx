import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Info as InfoIcon,
    LocalFlorist as LocalFloristIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Plant } from '@/types';
import type { PlantStatus } from '@/utils/plantStatus';
import { PlantStatusBadge } from '../PlantStatusBadge';

interface PlantCardProps {
    plant: Plant;
    status: PlantStatus;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const PlantCard = ({ plant, status, onEdit, onDelete }: PlantCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                },
            }}
        >
            <CardContent sx={{ flex: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        mb: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <LocalFloristIcon sx={{ color: 'white' }} />
                    </Box>
                    <PlantStatusBadge status={status} />
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }} noWrap>
                    {plant.name}
                </Typography>

                {plant.plantType && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                    >
                        {plant.plantType.name}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled" noWrap>
                        {plant.location}
                    </Typography>
                </Box>

                {plant.sensors && plant.sensors.length > 0 && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                    >
                        {t('plants.sensors')}: {plant.sensors.length}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                <Tooltip title={t('common.details')}>
                    <IconButton size="small" onClick={() => navigate(`/plants/${plant.plant_id}`)}>
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                {onEdit && (
                    <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={onEdit}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip title={t('common.delete')}>
                        <IconButton size="small" onClick={onDelete} sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </CardActions>
        </Card>
    );
};
