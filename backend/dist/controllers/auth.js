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
exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const generateJWT = (userId, TOKEN_SECRET, expiryTime) => {
    return jsonwebtoken_1.default.sign({ id: userId }, TOKEN_SECRET, { expiresIn: expiryTime });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userToRegister = req.body;
    if (!userToRegister.username || !userToRegister.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const existingUser = yield User_1.default.findOne({ username: userToRegister.username });
    if (existingUser) {
        return res.status(400).json({ message: "User with given username already exists" });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(userToRegister.password, 10);
        const newUser = new User_1.default(Object.assign(Object.assign({}, userToRegister), { password: hashedPassword }));
        const refreshToken = generateJWT(newUser._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(newUser._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");
        newUser.refreshToken = refreshToken;
        yield newUser.save();
        const _a = newUser.toObject(), { password } = _a, newUserWithoutPassword = __rest(_a, ["password"]);
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({
            user: newUserWithoutPassword,
            accessToken
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "Invalid username" });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
    }
    try {
        const refreshToken = generateJWT(user._id.toString(), process.env.REFRESH_TOKEN_SECRET || "", "1d");
        const accessToken = generateJWT(user._id.toString(), process.env.ACCESS_TOKEN_SECRET || "", "5s");
        user.refreshToken = refreshToken;
        const loginUser = yield user.save();
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: loginUser, accessToken });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
            return res.status(200).json({ message: "Logged out" });
        }
        const refreshToken = cookies.jwt;
        const logoutUser = yield User_1.default.findOne({ refreshToken });
        if (!logoutUser) {
            res.clearCookie("204", { httpOnly: true, sameSite: "none", secure: true });
            return res.status(200).json({ message: "Logged out" });
        }
        logoutUser.refreshToken = "";
        yield logoutUser.save();
        res.clearCookie("204", { httpOnly: true, sameSite: "none", secure: true });
        return res.status(200).json({ message: "Logged out" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
});
exports.logout = logout;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.refreshToken = refreshToken;
