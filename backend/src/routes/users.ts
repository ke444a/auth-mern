import {
    getAllUsers
} from "../controllers/users";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { verifyRolesMiddleware } from "../middleware/verifyRolesMiddleware";

const router = Router();
router.get("/", authMiddleware, verifyRolesMiddleware(["admin"]), getAllUsers);

export default router;