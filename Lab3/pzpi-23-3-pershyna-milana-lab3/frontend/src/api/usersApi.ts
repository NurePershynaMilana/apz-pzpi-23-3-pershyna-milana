import { baseApi } from './baseApi';
import type { ApiResponse, User, CreateUserPayload, UpdateUserPayload } from '@/types';

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<ApiResponse<User[]>, void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
        getUser: builder.query<ApiResponse<User>, number>({
            query: (id) => `/users/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'User', id }],
        }),
        createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
            query: (body) => ({ url: '/users', method: 'POST', body }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<ApiResponse<User>, { id: number; body: UpdateUserPayload }>({
            query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
            invalidatesTags: (_r, _e, { id }) => [{ type: 'User', id }, 'User'],
        }),
        deleteUser: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;
