import {
    login, register, logout, refreshToken, sendResetPasswordEmail, resetPassword
} from "../controllers/auth";
import { Router } from "express";
import multer from "multer";
const upload = multer();

const router = Router();
router.post("/login", upload.none(), login);
router.post("/register", upload.none(), register);
router.get("/logout", upload.none(), logout);
router.get("/refresh", refreshToken);
router.post("/forgot-password", sendResetPasswordEmail);
router.post("/reset-password", resetPassword);

export default router;