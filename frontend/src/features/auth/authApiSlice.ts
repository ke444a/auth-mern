import { apiSlice } from "../../app/api/apiSlice";
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
        }),
        sendResetPasswordEmail: builder.mutation({
            query: email => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: { email }
            })
        }),
        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/?token=${token}`,
                method: "POST",
                body: { password }
            })
        })
    })
});

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useLogoutQuery, 
    useSendResetPasswordEmailMutation, 
    useResetPasswordMutation 
} = authApiSlice;
