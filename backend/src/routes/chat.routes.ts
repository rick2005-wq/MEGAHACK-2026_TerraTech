import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add chat routes
// Example:
// router.get("/", authMiddleware, chatController.getAll);

export default router;
