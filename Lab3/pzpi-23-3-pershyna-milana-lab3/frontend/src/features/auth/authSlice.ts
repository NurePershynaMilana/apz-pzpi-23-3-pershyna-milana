import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';
import { TOKEN_KEY } from '@/utils/constants';

interface AuthState {
    token: string | null;
    user: User | null;
    isAuth: boolean;
    isInitializing: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem(TOKEN_KEY),
    user: null,
    isAuth: false,
    isInitializing: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuth = true;
            localStorage.setItem(TOKEN_KEY, action.payload.token);
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuth = true;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuth = false;
            localStorage.removeItem(TOKEN_KEY);
        },
        setInitializing(state, action: PayloadAction<boolean>) {
            state.isInitializing = action.payload;
        },
    },
});

export const { setCredentials, setUser, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
