import { Router } from "express";
import * as translateController from "../controllers/translate.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add translate routes
// Example:
// router.get("/", authMiddleware, translateController.getAll);

export default router;
