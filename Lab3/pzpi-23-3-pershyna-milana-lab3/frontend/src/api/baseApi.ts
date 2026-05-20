import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { TOKEN_KEY } from '@/utils/constants';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL as string,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token ?? localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        api.dispatch(logout());
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Plant', 'PlantType', 'Sensor', 'SensorData', 'User'],
    endpoints: () => ({}),
});
