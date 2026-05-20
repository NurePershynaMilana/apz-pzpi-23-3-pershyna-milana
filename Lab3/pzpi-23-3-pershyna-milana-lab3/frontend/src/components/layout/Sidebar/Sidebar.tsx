import type React from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    LocalFlorist as LocalFloristIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    People as PeopleIcon,
    Sensors as SensorsIcon,
    Category as CategoryIcon,
    Backup as BackupIcon,
    Nature as NatureIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/routes';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/utils/constants';

interface SidebarProps {
    collapsed: boolean;
}

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    exact?: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useAuth();

    const userNav: NavItem[] = [
        { label: 'dashboard.title', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
        { label: 'plants.title', icon: <LocalFloristIcon />, path: ROUTES.PLANTS },
        { label: 'profile.title', icon: <PersonIcon />, path: ROUTES.PROFILE },
        { label: 'settings.title', icon: <SettingsIcon />, path: ROUTES.SETTINGS },
    ];

    const adminNav: NavItem[] = [
        {
            label: 'admin.title',
            icon: <DashboardIcon />,
            path: ROUTES.ADMIN_DASHBOARD,
            exact: true,
        },
        { label: 'admin.users', icon: <PeopleIcon />, path: ROUTES.ADMIN_USERS },
        { label: 'admin.allPlants', icon: <LocalFloristIcon />, path: ROUTES.ADMIN_PLANTS },
        { label: 'admin.plantTypes', icon: <CategoryIcon />, path: ROUTES.ADMIN_PLANT_TYPES },
        { label: 'admin.sensors', icon: <SensorsIcon />, path: ROUTES.ADMIN_SENSORS },
        { label: 'admin.backup', icon: <BackupIcon />, path: ROUTES.ADMIN_BACKUP },
    ];

    const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
    const navItems = isAdmin ? adminNav : userNav;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width,
                flexShrink: 0,
                transition: 'width 0.3s ease',
                '& .MuiDrawer-paper': {
                    width,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                },
            }}
        >
            <Box
                onClick={() => navigate(ROUTES.DASHBOARD)}
                sx={{
                    p: collapsed ? 1 : 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minHeight: 64,
                    cursor: 'pointer',
                }}
            >
                <NatureIcon sx={{ color: 'primary.main', fontSize: 28, flexShrink: 0 }} />
                {!collapsed && (
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'primary.main' }}>
                        PlantCare
                    </Typography>
                )}
            </Box>
            <Divider />
            <List sx={{ px: 1, flex: 1 }}>
                {navItems.map((item) => {
                    const active = item.exact
                        ? location.pathname === item.path
                        : location.pathname === item.path ||
                          location.pathname.startsWith(item.path + '/');
                    return (
                        <Tooltip
                            key={item.path}
                            title={collapsed ? t(item.label) : ''}
                            placement="right"
                        >
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={active}
                                sx={{
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    px: collapsed ? 1 : 2,
                                    minHeight: 44,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                        '&:hover': { bgcolor: 'primary.dark' },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: collapsed ? 0 : 36,
                                        color: active ? 'inherit' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!collapsed && (
                                    <ListItemText
                                        primary={t(item.label)}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            fontWeight: active ? 600 : 400,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}
            </List>
        </Drawer>
    );
};
