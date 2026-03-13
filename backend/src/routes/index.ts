import { Router } from "express";
import authRoutes from "./auth.routes";
import farmerRoutes from "./farmer.routes";
import produceRoutes from "./produce.routes";
import industryRoutes from "./industry.routes";
import tenderRoutes from "./tender.routes";
import bidRoutes from "./bid.routes";
import chatRoutes from "./chat.routes";
import adminRoutes from "./admin.routes";
import uploadRoutes from "./upload.routes";
import translateRoutes from "./translate.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/farmer", farmerRoutes);
router.use("/produce", produceRoutes);
router.use("/industry", industryRoutes);
router.use("/tenders", tenderRoutes);
router.use("/bids", bidRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);
router.use("/translate", translateRoutes);

export default router;
