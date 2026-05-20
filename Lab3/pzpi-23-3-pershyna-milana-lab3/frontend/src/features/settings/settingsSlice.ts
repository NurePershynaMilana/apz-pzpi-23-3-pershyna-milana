import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    language: string;
    notificationsEnabled: boolean;
}

const initialState: SettingsState = {
    language: localStorage.getItem('plantcare_language') ?? 'uk',
    notificationsEnabled: false,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLanguage(state, action: PayloadAction<string>) {
            state.language = action.payload;
            localStorage.setItem('plantcare_language', action.payload);
        },
        setNotifications(state, action: PayloadAction<boolean>) {
            state.notificationsEnabled = action.payload;
        },
    },
});

export const { setLanguage, setNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
