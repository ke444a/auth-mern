"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.post("/login", upload.none(), auth_1.login);
router.post("/register", upload.none(), auth_1.register);
router.get("/logout", upload.none(), auth_1.logout);
router.get("/refresh", auth_1.refreshToken);
exports.default = router;
