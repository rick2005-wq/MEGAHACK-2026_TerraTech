import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add admin routes
// Example:
// router.get("/", authMiddleware, adminController.getAll);

export default router;
