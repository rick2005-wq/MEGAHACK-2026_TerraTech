import { Router } from "express";
import * as farmerController from "../controllers/farmer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add farmer routes
// Example:
// router.get("/", authMiddleware, farmerController.getAll);

export default router;
