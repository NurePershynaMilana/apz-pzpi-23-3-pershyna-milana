import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader = ({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) => (
    <Box sx={{ mb: 3 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs sx={{ mb: 1 }}>
                {breadcrumbs.map((b, i) =>
                    b.href ? (
                        <Link
                            key={i}
                            component={RouterLink}
                            to={b.href}
                            color="inherit"
                            underline="hover"
                            variant="body2"
                        >
                            {b.label}
                        </Link>
                    ) : (
                        <Typography key={i} variant="body2" color="text.secondary">
                            {b.label}
                        </Typography>
                    ),
                )}
            </Breadcrumbs>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Box>
    </Box>
);
