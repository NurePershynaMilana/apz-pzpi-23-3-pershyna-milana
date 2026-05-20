import { useAppDispatch } from '@/app/hooks';
import { showSnackbar } from '@/features/ui/uiSlice';

export const useSnackbar = () => {
    const dispatch = useAppDispatch();

    return {
        success: (message: string) => dispatch(showSnackbar({ message, severity: 'success' })),
        error: (message: string) => dispatch(showSnackbar({ message, severity: 'error' })),
        warning: (message: string) => dispatch(showSnackbar({ message, severity: 'warning' })),
        info: (message: string) => dispatch(showSnackbar({ message, severity: 'info' })),
    };
};
