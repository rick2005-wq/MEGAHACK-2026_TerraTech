import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add auth routes
// Example:
// router.get("/", authMiddleware, authController.getAll);

export default router;
