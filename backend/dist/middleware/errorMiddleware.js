"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, req, res, next) => {
    if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
    }
    else {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.errorMiddleware = errorMiddleware;
