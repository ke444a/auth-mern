import {
    getAllUsers
} from "../controllers/users";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.get("/", authMiddleware, getAllUsers);

export default router;