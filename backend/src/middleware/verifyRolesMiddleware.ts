import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const verifyRolesMiddleware = (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized"});
    }
};