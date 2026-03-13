import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { registerChatSocket } from "./chat.socket";
import { registerNotificationSocket } from "./notification.socket";

export function initSocket(server: Server) {
  const io = new SocketServer(server, { cors: { origin: "*" } });
  io.on("connection", socket => {
    console.log("Socket connected:", socket.id);
    registerChatSocket(io, socket);
    registerNotificationSocket(io, socket);
  });
}
