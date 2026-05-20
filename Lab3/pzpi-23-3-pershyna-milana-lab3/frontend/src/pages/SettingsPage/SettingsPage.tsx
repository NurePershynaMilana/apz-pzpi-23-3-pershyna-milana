import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { setLanguage } from '@/features/settings/settingsSlice';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTES } from '@/routes/routes';

export const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        dispatch(setLanguage(lang));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.LOGIN);
    };

    return (
        <Box>
            <PageHeader title={t('settings.title')} />
            <Card sx={{ maxWidth: 560 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t('settings.language')}
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 200, mb: 3 }}>
                        <InputLabel>{t('settings.language')}</InputLabel>
                        <Select
                            value={i18n.language}
                            label={t('settings.language')}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                        >
                            <MenuItem value="uk">🇺🇦 Українська</MenuItem>
                            <MenuItem value="en">🇬🇧 English</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{ mb: 3 }} />

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        {t('auth.logout')}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};
