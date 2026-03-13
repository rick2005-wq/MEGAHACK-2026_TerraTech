import http from "http";
import app from "./app";
import { initSocket } from "./sockets";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

async function start() {
  await connectDB();
  await connectRedis();
  server.listen(PORT, () => console.log(`🌾 GrainOS server running on port ${PORT}`));
}

start();
