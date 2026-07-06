import { useState, useRef, useCallback, useEffect } from "react";

const CHAT_ENDPOINT = "/.netlify/functions/chat";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hey! I'm Santosh's AI assistant. Ask me anything about his work, skills, or projects — or leave your details if you'd like him to reach out!",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.filter((m) => m.role !== "system") }),
      });
      const data = await resp.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Something went wrong. Try again!" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Couldn't connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading]);

  const handleKey = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }, [send]);

  return (
    <>
      <button
        className="neo-chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Santosh's AI"}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="neo-chat-window">
          <div className="neo-chat-header">
            <span className="neo-chat-header-dot" />
            <span>Chat with Santosh's AI</span>
          </div>

          <div className="neo-chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`neo-chat-bubble neo-chat-${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="neo-chat-bubble neo-chat-assistant neo-chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="neo-chat-input-row">
            <input
              ref={inputRef}
              className="neo-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              maxLength={500}
              disabled={loading}
            />
            <button className="neo-chat-send" onClick={send} disabled={loading || !input.trim()}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
