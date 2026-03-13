import { Server, Socket } from "socket.io";
export function registerNotificationSocket(io: Server, socket: Socket) {
  socket.on("subscribe_notifications", (userId: string) => socket.join(`user:${userId}`));
}
export function sendNotification(io: Server, userId: string, notification: object) {
  io.to(`user:${userId}`).emit("notification", notification);
}
