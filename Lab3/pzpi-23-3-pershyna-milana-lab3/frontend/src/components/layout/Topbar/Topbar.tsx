import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ROUTES } from '@/routes/routes';

interface TopbarProps {
    onToggle: () => void;
}

export const Topbar = ({ onToggle }: TopbarProps) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.LOGIN);
        setAnchor(null);
    };

    const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'U';

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                top: 0,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ minHeight: 64, gap: 1 }}>
                <IconButton onClick={onToggle} size="small">
                    <MenuIcon />
                </IconButton>
                <Box sx={{ flex: 1 }} />
                <LanguageSwitcher />
                <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
                        {initials}
                    </Avatar>
                </IconButton>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                            {user?.first_name} {user?.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user?.email}
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            navigate(ROUTES.PROFILE);
                            setAnchor(null);
                        }}
                    >
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        {t('profile.title')}
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                        {t('auth.logout')}
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};
