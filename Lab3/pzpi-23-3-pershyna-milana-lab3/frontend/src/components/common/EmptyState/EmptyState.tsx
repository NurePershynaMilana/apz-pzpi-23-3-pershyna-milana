import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
    icon?: ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 4,
            textAlign: 'center',
        }}
    >
        <Box sx={{ color: 'text.disabled', mb: 2 }}>
            {icon ?? <InboxIcon sx={{ fontSize: 64 }} />}
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
        </Typography>
        {description && (
            <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                {description}
            </Typography>
        )}
        {action && (
            <Button variant="contained" onClick={action.onClick}>
                {action.label}
            </Button>
        )}
    </Box>
);
