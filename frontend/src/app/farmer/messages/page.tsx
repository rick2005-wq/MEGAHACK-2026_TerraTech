"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEMO_FARMER_ID = "00000000-0000-0000-0000-000000000001";

// Hardcoded contacts for demo (industry buyers)
const CONTACTS = [
  { id: "00000000-0000-0000-0000-000000000002", emoji: "🏭", name: "PepsiCo India",         online: true  },
  { id: "00000000-0000-0000-0000-000000000003", emoji: "🌿", name: "Britannia Industries",   online: true  },
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(CONTACTS[0].id);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const active = CONTACTS.find(c => c.id === activeId)!;

  // ── Load messages for active contact ──
  useEffect(() => {
    setMessages([]);
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${DEMO_FARMER_ID},receiver_id.eq.${activeId}),and(sender_id.eq.${activeId},receiver_id.eq.${DEMO_FARMER_ID})`
        )
        .order("created_at", { ascending: true });

      if (error) { console.error(error); return; }
      setMessages(data || []);
    };

    fetchMessages();

    // ── Supabase Realtime subscription ──
    const channel = supabase
      .channel(`chat-${activeId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, (payload) => {
        const msg = payload.new as any;
        const isRelevant =
          (msg.sender_id === DEMO_FARMER_ID && msg.receiver_id === activeId) ||
          (msg.sender_id === activeId && msg.receiver_id === DEMO_FARMER_ID);
        if (isRelevant) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeId]);

  // ── Scroll to bottom on new message ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // ── Send message ──
  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");

    const { error } = await supabase.from("messages").insert({
      sender_id: DEMO_FARMER_ID,
      receiver_id: activeId,
      text,
      type: "text",
    });

    if (error) { console.error(error); setSending(false); return; }
    setSending(false);
  };

  return (
    <>
      {/* Topbar */}
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,70,20,0.07)", padding: "16px 32px", position: "sticky", top: 0, zIndex: 40 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#1a2e1a" }}>Messages 💬</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>Direct chats with verified industry buyers</p>
      </div>

      <div style={{ padding: "28px 32px", flex: 1 }} className="fade-up">
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, height: "calc(100vh - 180px)" }}>

          {/* Contact list */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 16, border: "1px solid rgba(30,70,20,0.07)", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: "#1a2e1a", marginBottom: 14, padding: "0 4px" }}>Conversations</div>
            {CONTACTS.map(c => (
              <div key={c.id} onClick={() => setActiveId(c.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, marginBottom: 4, cursor: "pointer", background: activeId === c.id ? "#f0f7f0" : "transparent", border: `1px solid ${activeId === c.id ? "rgba(163,196,92,0.3)" : "transparent"}`, transition: "all 0.2s" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#f0f7f0,#d4edda)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.emoji}</div>
                  {c.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a2e1a" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: c.online ? "#22c55e" : "#9ca3af", fontWeight: 500 }}>{c.online ? "Online" : "Offline"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat window */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(30,70,20,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Chat header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 12, background: "#fff" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#f0f7f0,#d4edda)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{active.emoji}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e1a" }}>{active.name}</div>
                <div style={{ fontSize: 11, color: active.online ? "#22c55e" : "#9ca3af", fontWeight: 600 }}>{active.online ? "🟢 Online" : "⚫ Offline"}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button style={{ padding: "7px 14px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>📞 Call</button>
                <button style={{ padding: "7px 14px", borderRadius: 10, border: "none", background: "#f0f7f0", fontSize: 12, fontWeight: 600, color: "#2d6b30", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>📋 View Bid</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 10, background: "#fafaf8" }}>

              {messages.length === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", gap: 8 }}>
                  <div style={{ fontSize: 40 }}>💬</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>No messages yet</div>
                  <div style={{ fontSize: 12 }}>Start the conversation!</div>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMe = msg.sender_id === DEMO_FARMER_ID;
                const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    {!isMe && (
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#f0f7f0,#d4edda)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                        {active.emoji}
                      </div>
                    )}
                    <div style={{ maxWidth: "65%", padding: "11px 15px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? "linear-gradient(135deg,#1e4620,#2d6b30)" : "#fff", color: isMe ? "#fff" : "#1a2e1a", fontSize: 13, lineHeight: 1.55, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                      {msg.text}
                      <div style={{ fontSize: 10, marginTop: 5, opacity: 0.6, textAlign: isMe ? "right" : "left" }}>{time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 10, alignItems: "center", background: "#fff" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a message… (Enter to send)"
                style={{ flex: 1, padding: "12px 16px", border: "1.5px solid #e5e7eb", borderRadius: 14, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafaf8" }}
              />
              <button onClick={send} disabled={sending || !input.trim()}
                style={{ padding: "12px 22px", borderRadius: 12, border: "none", background: sending || !input.trim() ? "#9ca3af" : "linear-gradient(135deg,#1e4620,#2d6b30)", color: "#fff", fontWeight: 700, cursor: sending || !input.trim() ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
                {sending ? "⏳" : "Send →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
