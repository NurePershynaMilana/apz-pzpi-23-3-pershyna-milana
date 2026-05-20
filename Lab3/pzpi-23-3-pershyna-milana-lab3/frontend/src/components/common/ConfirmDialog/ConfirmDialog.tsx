import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: 'error' | 'primary' | 'warning';
    loading?: boolean;
}

export const ConfirmDialog = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmColor = 'error',
    loading = false,
}: ConfirmDialogProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} disabled={loading}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    disabled={loading}
                >
                    {t('common.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
