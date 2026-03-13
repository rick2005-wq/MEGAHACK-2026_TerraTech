import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
export function useChat(roomId: string) {
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    socketRef.current.emit("join_room", roomId);
    return () => { socketRef.current?.disconnect(); };
  }, [roomId]);
  const sendMessage = (message: string) => socketRef.current?.emit("send_message", { roomId, message });
  return { sendMessage };
}