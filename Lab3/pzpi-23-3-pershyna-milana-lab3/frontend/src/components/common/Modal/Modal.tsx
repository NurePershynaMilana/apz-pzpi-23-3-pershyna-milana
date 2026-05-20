import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm' }: ModalProps) => (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
        <DialogTitle
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
        >
            {title}
            <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <Box sx={{ pt: 1 }}>{children}</Box>
        </DialogContent>
        {actions && <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>}
    </Dialog>
);
