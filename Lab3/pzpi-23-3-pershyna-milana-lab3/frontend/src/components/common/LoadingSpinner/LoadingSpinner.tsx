import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    size?: number;
}

export const LoadingSpinner = ({ fullScreen = false, size = 40 }: LoadingSpinnerProps) => {
    if (fullScreen) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <CircularProgress size={size} color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={size} color="primary" />
        </Box>
    );
};
