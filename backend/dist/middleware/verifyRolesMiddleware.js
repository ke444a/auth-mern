"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRolesMiddleware = void 0;
const verifyRolesMiddleware = (roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.verifyRolesMiddleware = verifyRolesMiddleware;
