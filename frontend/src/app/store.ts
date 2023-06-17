import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";
import { errorLogger } from "./api/errorLoggerMiddleware";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware).concat(errorLogger),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
