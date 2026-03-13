import { Router } from "express";
import * as industryController from "../controllers/industry.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add industry routes
// Example:
// router.get("/", authMiddleware, industryController.getAll);

export default router;
