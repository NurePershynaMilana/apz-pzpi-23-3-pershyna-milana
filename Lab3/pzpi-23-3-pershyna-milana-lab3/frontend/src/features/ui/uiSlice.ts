import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}

interface UiState {
    snackbar: SnackbarState;
    sidebarCollapsed: boolean;
}

const initialState: UiState = {
    snackbar: { open: false, message: '', severity: 'info' },
    sidebarCollapsed: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showSnackbar(
            state,
            action: PayloadAction<{ message: string; severity?: SnackbarSeverity }>,
        ) {
            state.snackbar = {
                open: true,
                message: action.payload.message,
                severity: action.payload.severity ?? 'info',
            };
        },
        hideSnackbar(state) {
            state.snackbar.open = false;
        },
        toggleSidebar(state) {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed(state, action: PayloadAction<boolean>) {
            state.sidebarCollapsed = action.payload;
        },
    },
});

export const { showSnackbar, hideSnackbar, toggleSidebar, setSidebarCollapsed } = uiSlice.actions;
export default uiSlice.reducer;
