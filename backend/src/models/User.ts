import { Schema, model} from "mongoose";

export interface IUser {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "admin" | "user";
    refreshToken: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    refreshToken: String
});

export default model<IUser>("User", userSchema);
