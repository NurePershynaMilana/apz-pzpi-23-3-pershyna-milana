import type { Components, Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:active': {
                    transform: 'scale(0.98)',
                },
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                backgroundImage: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            },
        },
    },
    MuiCardContent: {
        styleOverrides: {
            root: {
                '&:last-child': { paddingBottom: 16 },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                borderRadius: 12,
            },
        },
    },
    MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                },
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                fontWeight: 600,
                fontSize: '0.75rem',
            },
        },
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 12,
            },
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRadius: 0,
                borderRight: '1px solid #2A2A2A',
            },
        },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                marginBottom: 2,
                transition: 'all 0.3s ease',
            },
        },
    },
    MuiSnackbarContent: {
        styleOverrides: {
            root: { borderRadius: 8 },
        },
    },
};
