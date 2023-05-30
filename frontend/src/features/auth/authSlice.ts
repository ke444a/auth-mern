import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface IState {
    user: User | null;
    accessToken: string;
}

const initialState: IState = {
    user: null,
    accessToken: ""
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IUserStore>) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = "";
        }
    }
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.accessToken;
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
