import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import { sanitizeMiddleware } from "./middlewares/sanitize.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(sanitizeMiddleware);
app.use(rateLimitMiddleware);
app.use("/api", routes);
app.use(errorMiddleware);

export default app;
