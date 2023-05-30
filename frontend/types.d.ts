interface User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    refreshToken: string;
}

interface IForm {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

interface IUserStore {
    user: User | null;
    accessToken: string;
}