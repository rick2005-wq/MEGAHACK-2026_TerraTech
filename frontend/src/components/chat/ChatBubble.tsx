interface ChatBubbleProps { message: string; translated?: string; isSelf: boolean; timestamp: string; }
export default function ChatBubble({ message, translated, isSelf, timestamp }: ChatBubbleProps) {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isSelf ? "bg-grain-500 text-white" : "bg-white/40 backdrop-blur-sm"}`}>
        <p>{message}</p>
        {translated && <p className="text-xs italic opacity-70 mt-1">{translated}</p>}
        <p className="text-xs opacity-50 mt-1 text-right">{timestamp}</p>
      </div>
    </div>
  );
}