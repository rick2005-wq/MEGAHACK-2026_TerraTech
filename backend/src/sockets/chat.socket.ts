import { Server, Socket } from "socket.io";
export function registerChatSocket(io: Server, socket: Socket) {
  socket.on("join_room", (roomId: string) => socket.join(roomId));
  socket.on("send_message", (data: { roomId: string; message: string; senderId: string }) => {
    io.to(data.roomId).emit("receive_message", data);
  });
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
}
