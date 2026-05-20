import { baseApi } from './baseApi';
import type { ApiResponse, User } from '@/types';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ApiResponse<AuthResponse>, LoginPayload>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: builder.mutation<ApiResponse<AuthResponse>, RegisterPayload>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        logoutApi: builder.mutation<ApiResponse<void>, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
        }),
        getMe: builder.query<ApiResponse<User>, void>({
            query: () => '/auth/me',
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutApiMutation, useGetMeQuery } =
    authApi;
