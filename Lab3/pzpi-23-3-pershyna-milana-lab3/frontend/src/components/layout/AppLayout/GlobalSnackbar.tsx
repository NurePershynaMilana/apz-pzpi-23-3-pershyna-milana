import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { hideSnackbar } from '@/features/ui/uiSlice';

export const GlobalSnackbar = () => {
    const dispatch = useAppDispatch();
    const { open, message, severity } = useAppSelector((s) => s.ui.snackbar);

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => dispatch(hideSnackbar())}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={() => dispatch(hideSnackbar())}
                severity={severity}
                variant="filled"
                sx={{ borderRadius: 2 }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};
