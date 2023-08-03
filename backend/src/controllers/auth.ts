import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import nodemailer from "nodemailer";

const generateJWT = (userId: string, TOKEN_SECRET: string, expiryTime: string) => {
    return jwt.sign(
        { id: userId },
        TOKEN_SECRET,
        { expiresIn: expiryTime }
    );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userToRegister: IUser = req.body;
        if (!userToRegister.email || !userToRegister.password) {
            return res.status(400).json({ message: "Email and password are required"});
        }
    
        const existingUser = await User.findOne({ email: userToRegister.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with given email already exists" });
        }
    
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
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 24*60*60*1000 });
        res.status(201).json({
            user: newUserWithoutPassword,
            accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email" });
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }
    
        const refreshToken = generateJWT(user._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(user._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");
    
        user.refreshToken = refreshToken;
        const loginUser = await user.save();
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 24*60*60*1000 });
        res.status(200).json({ user: loginUser, accessToken });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(200).json({ message: "Logged out"});
        }
    
        const refreshToken = cookies.jwt;
        const logoutUser = await User.findOne({ refreshToken });
        if (!logoutUser) {
            res.clearCookie("204", { httpOnly: true, sameSite: "strict", secure: true });
            return res.status(200).json({ message: "Logged out"});
        }
    
        logoutUser.refreshToken = "";
        await logoutUser.save();
        res.clearCookie("204", { httpOnly: true, sameSite: "strict", secure: true });
        return res.status(200).json({ message: "Logged out"});
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
        next(error);
    }
};

export const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with given email is not found" });
        }
    
        const resetToken = generateJWT(user.id, process.env.RESET_TOKEN_SECRET || "", "15m");
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PASSWORD
            }
        });
        const mailData = {
            from: "alene.kozey@ethereal.email",
            to: email,
            subject: "Password Reset",
            html: `
                <p>Hello,</p>
                <p>You have requested to reset your password. Please click the link below to reset it within next 15 minutes: </p>
                <a href="http://localhost:5173/reset-password?token=${resetToken}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                res.status(500).json({ message: "Error sending email" });
            } else {
                res.status(200).json({ message: nodemailer.getTestMessageUrl(info) });
            }
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "New password is required" });
        }
        const resetToken = req.query.token;
    
    
        jwt.verify(
            resetToken as string, 
            process.env.RESET_TOKEN_SECRET || "",
            async (err: Error | null, decoded: any) => {
                if (err) {
                    return res.status(403).json({ message: err.message });
                }
    
                const user = await User.findById(decoded.id);
                if (!user) {
                    return res.status(400).json({ message: "User is not found" });
                }
                const cookies = req.cookies;
                if (cookies?.jwt) {
                    res.clearCookie("204", { httpOnly: true, sameSite: "strict", secure: true });
                }
                user.refreshToken = ""; 
    
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({ message: "Password changed successfully" });
            }
        );
    } catch (error) {
        next(error);
    }
};
