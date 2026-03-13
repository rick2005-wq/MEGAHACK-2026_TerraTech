import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add upload routes
// Example:
// router.get("/", authMiddleware, uploadController.getAll);

export default router;
