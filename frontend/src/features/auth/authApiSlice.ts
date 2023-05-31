import { apiSlice } from "../../app/api/apiSlice";
import { store } from "../../app/store";
import { logout } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: "/auth/login",
                method: "POST",
                body: {...credentials}
            })
        }),
        register: builder.mutation({
            query: credentials => ({
                url: "/auth/register",
                method: "POST",
                body: {...credentials}
            })
        }),
        logout: builder.query<void, void>({
            query: () => "/auth/logout",
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })
});

export const { useLoginMutation, useRegisterMutation, useLogoutQuery } = authApiSlice;
