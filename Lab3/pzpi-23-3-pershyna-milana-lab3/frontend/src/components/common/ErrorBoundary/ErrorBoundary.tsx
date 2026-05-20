import { Component, type ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import i18n from '@/i18n/config';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h5" color="error" gutterBottom>
                        {i18n.t('errors.somethingWentWrong')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {this.state.error?.message}
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        {i18n.t('errors.reload')}
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}
