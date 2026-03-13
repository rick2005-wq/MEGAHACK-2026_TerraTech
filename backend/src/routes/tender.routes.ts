import { Router } from "express";
import * as tenderController from "../controllers/tender.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add tender routes
// Example:
// router.get("/", authMiddleware, tenderController.getAll);

export default router;
