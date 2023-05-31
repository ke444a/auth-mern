import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query<IUser[], void>({
            query: () => "/users",
            keepUnusedDataFor: 3
        }),
    })
});

export const { useGetUsersQuery } = usersApiSlice;
