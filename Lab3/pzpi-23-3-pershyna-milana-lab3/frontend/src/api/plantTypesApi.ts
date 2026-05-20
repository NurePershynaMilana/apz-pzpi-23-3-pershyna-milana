import { baseApi } from './baseApi';
import type { ApiResponse, PlantType, CreatePlantTypePayload } from '@/types';

export const plantTypesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlantTypes: builder.query<ApiResponse<PlantType[]>, void>({
            query: () => '/plant-types',
            providesTags: ['PlantType'],
        }),
        createPlantType: builder.mutation<ApiResponse<PlantType>, CreatePlantTypePayload>({
            query: (body) => ({ url: '/plant-types', method: 'POST', body }),
            invalidatesTags: ['PlantType'],
        }),
        updatePlantType: builder.mutation<
            ApiResponse<PlantType>,
            { id: number; body: Partial<CreatePlantTypePayload> }
        >({
            query: ({ id, body }) => ({ url: `/plant-types/${id}`, method: 'PUT', body }),
            invalidatesTags: ['PlantType'],
        }),
        deletePlantType: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({ url: `/plant-types/${id}`, method: 'DELETE' }),
            invalidatesTags: ['PlantType'],
        }),
    }),
});

export const {
    useGetPlantTypesQuery,
    useCreatePlantTypeMutation,
    useUpdatePlantTypeMutation,
    useDeletePlantTypeMutation,
} = plantTypesApi;
