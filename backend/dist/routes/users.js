"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const verifyRolesMiddleware_1 = require("../middleware/verifyRolesMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, (0, verifyRolesMiddleware_1.verifyRolesMiddleware)(["admin"]), users_1.getAllUsers);
exports.default = router;
