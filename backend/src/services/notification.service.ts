import { redisClient } from "../config/redis";
export async function createNotification(userId: string, message: string) {
  const notification = { userId, message, createdAt: new Date().toISOString(), read: false };
  await redisClient.lPush(`notifications:${userId}`, JSON.stringify(notification));
  return notification;
}
