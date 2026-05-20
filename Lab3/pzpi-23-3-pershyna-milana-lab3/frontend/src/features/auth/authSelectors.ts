import type { RootState } from '@/app/store';

export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectIsInitializing = (state: RootState) => state.auth.isInitializing;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin';
