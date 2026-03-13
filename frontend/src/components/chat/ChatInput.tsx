"use client";
import { useState } from "react";
interface ChatInputProps { onSend: (msg: string) => void; }
export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  return (
    <div className="flex gap-2 p-4 border-t border-white/30">
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 outline-none" />
      <button onClick={() => { onSend(value); setValue(""); }} className="bg-grain-500 text-white px-4 py-2 rounded-xl">Send</button>
    </div>
  );
}