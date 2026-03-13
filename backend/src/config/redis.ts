import { createClient } from "redis";
export const redisClient = createClient({ url: process.env.REDIS_URL });
export async function connectRedis() {
  await redisClient.connect();
  console.log("✅ Redis connected");
}
