import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const AuthLayout = () => (
    <Box
        sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1a0a2e 50%, #0F0F0F 100%)',
            position: 'relative',
        }}
    >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LanguageSwitcher />
        </Box>
        <Outlet />
    </Box>
);
