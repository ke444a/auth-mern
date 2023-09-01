"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendResetPasswordEmail = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateJWT = (userId, TOKEN_SECRET, expiryTime) => {
    return jsonwebtoken_1.default.sign({ id: userId }, TOKEN_SECRET, { expiresIn: expiryTime });
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToRegister = req.body;
        if (!userToRegister.email || !userToRegister.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = yield User_1.default.findOne({ email: userToRegister.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with given email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(userToRegister.password, 10);
        const newUser = new User_1.default(Object.assign(Object.assign({}, userToRegister), { password: hashedPassword }));
        const refreshToken = generateJWT(newUser._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(newUser._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");
        newUser.refreshToken = refreshToken;
        yield newUser.save();
        const _a = newUser.toObject(), { password } = _a, newUserWithoutPassword = __rest(_a, ["password"]);
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({
            user: newUserWithoutPassword,
            accessToken
        });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email" });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const refreshToken = generateJWT(user._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(user._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");
        user.refreshToken = refreshToken;
        const loginUser = yield user.save();
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: loginUser, accessToken });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
            return res.status(200).json({ message: "Logged out" });
        }
        const refreshToken = cookies.jwt;
        const logoutUser = yield User_1.default.findOne({ refreshToken });
        if (!logoutUser) {
            res.clearCookie("204", { httpOnly: true, sameSite: "strict", secure: true });
            return res.status(200).json({ message: "Logged out" });
        }
        logoutUser.refreshToken = "";
        yield logoutUser.save();
        res.clearCookie("204", { httpOnly: true, sameSite: "strict", secure: true });
        return res.status(200).json({ message: "Logged out" });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
            return res.status(401).json({ message: "No refresh token" });
        }
        const refreshToken = cookies.jwt;
        const foundUser = yield User_1.default.findOne({ refreshToken });
        if (!foundUser) {
            return res.status(401).json({ message: "No user with given refresh token" });
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "", (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: err.message });
            }
            const accessToken = generateJWT(decoded.id, process.env.ACCESS_TOKEN_SECRET || "", "5s");
            res.status(201).json({ accessToken });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
const sendResetPasswordEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with given email is not found" });
        }
        const resetToken = generateJWT(user.id, process.env.RESET_TOKEN_SECRET || "", "15m");
        const transporter = nodemailer_1.default.createTransport({
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
            }
            else {
                res.status(200).json({ message: nodemailer_1.default.getTestMessageUrl(info) });
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "New password is required" });
        }
        const resetToken = req.query.token;
        jsonwebtoken_1.default.verify(resetToken, process.env.RESET_TOKEN_SECRET || "", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ message: err.message });
            }
            const user = yield User_1.default.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ message: "User is not found" });
            }
            const cookies = req.cookies;
            if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
                res.clearCookie("204", { httpOnly: true, sameSite: "strict", secure: true });
            }
            user.refreshToken = "";
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            user.password = hashedPassword;
            yield user.save();
            res.status(200).json({ message: "Password changed successfully" });
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
