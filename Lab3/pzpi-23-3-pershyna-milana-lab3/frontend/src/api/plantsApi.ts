import { baseApi } from './baseApi';
import type { ApiResponse, Plant, CreatePlantPayload, UpdatePlantPayload } from '@/types';

export const plantsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyPlants: builder.query<ApiResponse<Plant[]>, void>({
            query: () => '/my-plants',
            providesTags: ['Plant'],
        }),
        getMyPlant: builder.query<ApiResponse<Plant>, number>({
            query: (id) => `/my-plants/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'Plant', id }],
        }),
        createMyPlant: builder.mutation<ApiResponse<Plant>, CreatePlantPayload>({
            query: (body) => ({ url: '/my-plants', method: 'POST', body }),
            invalidatesTags: ['Plant'],
        }),
        updateMyPlant: builder.mutation<
            ApiResponse<Plant>,
            { id: number; body: UpdatePlantPayload }
        >({
            query: ({ id, body }) => ({ url: `/my-plants/${id}`, method: 'PUT', body }),
            invalidatesTags: (_r, _e, { id }) => [{ type: 'Plant', id }, 'Plant'],
        }),
        deleteMyPlant: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({ url: `/my-plants/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Plant'],
        }),
        // Admin endpoints
        getAllPlants: builder.query<ApiResponse<Plant[]>, void>({
            query: () => '/plants',
            providesTags: ['Plant'],
        }),
        getPlantsByUser: builder.query<ApiResponse<Plant[]>, number>({
            query: (userId) => `/plants/users/${userId}/plants`,
            providesTags: ['Plant'],
        }),
        adminCreatePlant: builder.mutation<
            ApiResponse<Plant>,
            CreatePlantPayload & { user_id: number }
        >({
            query: (body) => ({ url: '/plants', method: 'POST', body }),
            invalidatesTags: ['Plant'],
        }),
        adminUpdatePlant: builder.mutation<
            ApiResponse<Plant>,
            { id: number; body: UpdatePlantPayload }
        >({
            query: ({ id, body }) => ({ url: `/plants/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Plant'],
        }),
        adminDeletePlant: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({ url: `/plants/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Plant'],
        }),
    }),
});

export const {
    useGetMyPlantsQuery,
    useGetMyPlantQuery,
    useCreateMyPlantMutation,
    useUpdateMyPlantMutation,
    useDeleteMyPlantMutation,
    useGetAllPlantsQuery,
    useGetPlantsByUserQuery,
    useAdminCreatePlantMutation,
    useAdminUpdatePlantMutation,
    useAdminDeletePlantMutation,
} = plantsApi;
