import { Router } from "express";
import * as bidController from "../controllers/bid.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// TODO: Add bid routes
// Example:
// router.get("/", authMiddleware, bidController.getAll);

export default router;
