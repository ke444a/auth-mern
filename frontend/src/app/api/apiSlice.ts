import { BaseQueryApi, fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers: Headers, { getState }: Pick<BaseQueryApi, "getState">) => {
        const accessToken = (getState() as RootState).auth.accessToken;
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
    }
});

interface IRefreshType {
    accessToken: string;
}

const baseQueryReauth = async (args: any, api: any, extraOptions?: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            api.dispatch(setCredentials({ accessToken: (refreshResult.data as IRefreshType).accessToken, user }));

            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    } 

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryReauth,
    endpoints: builder => ({})
});
