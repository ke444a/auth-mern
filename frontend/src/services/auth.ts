import { customAxios } from "./api/customAxios";

export const loginUser = (loginData: FormData) => {
    return customAxios.post("/login", loginData).then((response) => response.data);
};

export const registerUser = (registerData: FormData) => {
    return customAxios.post("/register", registerData).then((response) => response.data);
};

export const logoutUser = () => {
    return customAxios.get("/logout").then((response) => response.data);
};
