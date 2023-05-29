import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface AuthRequest extends Request {
    user: IUser | null;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is required" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ message: "Authorization token is required" });
    }

    try {
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || "",
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid token" });
                }
                req.user = await User.findById((decoded as JwtPayload)?.id).select("-password");
                next();
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "Unknown error" });
        }
    }
};