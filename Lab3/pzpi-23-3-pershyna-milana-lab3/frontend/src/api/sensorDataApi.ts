import { baseApi } from './baseApi';
import type { ApiResponse, SensorData } from '@/types';

interface GetSensorDataParams {
    limit?: number;
    offset?: number;
}

interface GetSensorHistoryParams {
    sensorId: number;
    from?: string;
    to?: string;
    limit?: number;
}

export const sensorDataApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSensorData: builder.query<ApiResponse<SensorData[]>, GetSensorDataParams | void>({
            query: (params) => ({
                url: '/sensor-data',
                params: params ?? {},
            }),
            providesTags: ['SensorData'],
        }),
        getSensorHistory: builder.query<ApiResponse<SensorData[]>, GetSensorHistoryParams>({
            query: ({ sensorId, ...params }) => ({
                url: `/sensors/${sensorId}/data`,
                params,
            }),
            providesTags: ['SensorData'],
        }),
        createSensorData: builder.mutation<
            ApiResponse<SensorData>,
            { sensor_id: number; value: number }
        >({
            query: (body) => ({ url: '/sensor-data', method: 'POST', body }),
            invalidatesTags: ['SensorData'],
        }),
    }),
});

export const { useGetSensorDataQuery, useGetSensorHistoryQuery, useCreateSensorDataMutation } =
    sensorDataApi;
