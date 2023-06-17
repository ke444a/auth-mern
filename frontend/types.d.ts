interface IUser {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    refreshToken: string;
}

interface IForm {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

interface IUserStore {
    user: User | null;
    accessToken: string;
}