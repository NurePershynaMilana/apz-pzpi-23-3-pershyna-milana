import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nature as NatureIcon } from '@mui/icons-material';
import { ROUTES } from '@/routes/routes';

export const NotFoundPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                textAlign: 'center',
                p: 4,
            }}
        >
            <NatureIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 1 }}>
                404
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                {t('notFound.title')}
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
                {t('notFound.description')}
            </Typography>
            <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>
                {t('notFound.goHome')}
            </Button>
        </Box>
    );
};
