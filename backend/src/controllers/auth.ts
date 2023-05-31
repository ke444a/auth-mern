import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { IUser } from "../models/User";

const generateJWT = (userId: string, TOKEN_SECRET: string, expiryTime: string) => {
    return jwt.sign(
        { id: userId },
        TOKEN_SECRET,
        { expiresIn: expiryTime }
    );
};

export const register = async (req: Request, res: Response) => {
    const userToRegister: IUser = req.body;
    if (!userToRegister.username || !userToRegister.password) {
        return res.status(400).json({ message: "Username and password are required"});
    }

    const existingUser = await User.findOne({ username: userToRegister.username });
    if (existingUser) {
        return res.status(400).json({ message: "User with given username already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(userToRegister.password, 10);
        const newUser = new User<IUser>({
            ...userToRegister,
            password: hashedPassword
        });
        const refreshToken = generateJWT(newUser._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(newUser._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");
        newUser.refreshToken = refreshToken;
        await newUser.save();

        const { password, ...newUserWithoutPassword } = newUser.toObject();
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24*60*60*1000 });
        res.status(201).json({
            user: newUserWithoutPassword,
            accessToken
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "Invalid username" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
    }

    try {
        const refreshToken = generateJWT(user._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(user._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");

        user.refreshToken = refreshToken;
        const loginUser = await user.save();
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24*60*60*1000 });
        res.status(200).json({ user: loginUser, accessToken });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(200).json({ message: "Logged out"});
        }

        const refreshToken = cookies.jwt;
        const logoutUser = await User.findOne({ refreshToken });
        if (!logoutUser) {
            res.clearCookie("204", { httpOnly: true, sameSite: "none", secure: true });
            return res.status(200).json({ message: "Logged out"});
        }

        logoutUser.refreshToken = "";
        await logoutUser.save();
        res.clearCookie("204", { httpOnly: true, sameSite: "none", secure: true });
        return res.status(200).json({ message: "Logged out"});
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "No refresh token" });
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
        return res.status(401).json({ message: "No user with given refresh token" });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "",
        (err: Error | null, decoded: any) => {
            if (err) {
                return res.status(403).json({ message: err.message });
            }

            const accessToken = generateJWT(decoded.id, process.env.ACCESS_TOKEN_SECRET || "", "5s");
            res.status(201).json({ accessToken });
        }
    );
};
