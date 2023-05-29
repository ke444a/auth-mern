import { Schema, model} from "mongoose";

export interface IUser {
    username: string;
    password: string;
    role: "admin" | "user";
    refreshToken: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    refreshToken: String
});

export default model<IUser>("User", userSchema);
