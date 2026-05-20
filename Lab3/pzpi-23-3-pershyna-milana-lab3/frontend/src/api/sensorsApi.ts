import { baseApi } from './baseApi';
import type { ApiResponse, Sensor, CreateSensorPayload, UpdateSensorPayload } from '@/types';

export const sensorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSensors: builder.query<ApiResponse<Sensor[]>, void>({
            query: () => '/sensors',
            providesTags: ['Sensor'],
        }),
        getSensor: builder.query<ApiResponse<Sensor>, number>({
            query: (id) => `/sensors/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'Sensor', id }],
        }),
        getPlantSensors: builder.query<ApiResponse<Sensor[]>, number>({
            query: (plantId) => `/sensors/plants/${plantId}/sensors`,
            providesTags: ['Sensor'],
        }),
        createSensor: builder.mutation<ApiResponse<Sensor>, CreateSensorPayload>({
            query: (body) => ({ url: '/sensors', method: 'POST', body }),
            invalidatesTags: ['Sensor'],
        }),
        updateSensor: builder.mutation<
            ApiResponse<Sensor>,
            { id: number; body: UpdateSensorPayload }
        >({
            query: ({ id, body }) => ({ url: `/sensors/${id}`, method: 'PUT', body }),
            invalidatesTags: (_r, _e, { id }) => [{ type: 'Sensor', id }, 'Sensor'],
        }),
        deleteSensor: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({ url: `/sensors/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Sensor'],
        }),
    }),
});

export const {
    useGetSensorsQuery,
    useGetSensorQuery,
    useGetPlantSensorsQuery,
    useCreateSensorMutation,
    useUpdateSensorMutation,
    useDeleteSensorMutation,
} = sensorsApi;
