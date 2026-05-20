import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleSidebar } from '@/features/ui/uiSlice';
import { Sidebar } from '../Sidebar';
import { Topbar } from '../Topbar';
import { GlobalSnackbar } from './GlobalSnackbar';

export const AppLayout = () => {
    const dispatch = useAppDispatch();
    const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
            <Sidebar collapsed={collapsed} />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                }}
            >
                <Topbar onToggle={() => dispatch(toggleSidebar())} />
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
            <GlobalSnackbar />
        </Box>
    );
};
