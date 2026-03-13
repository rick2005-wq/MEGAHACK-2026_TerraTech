import { Router } from "express";
import * as produceController from "../controllers/produce.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add produce routes
// Example:
// router.get("/", authMiddleware, produceController.getAll);

export default router;
