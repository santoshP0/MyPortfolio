import { useState, useRef, useCallback, useEffect } from "react";

const CHAT_ENDPOINT = "/.netlify/functions/chat";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hey! I'm Santosh. Ask me anything about my work, skills, or projects — or drop your details and I'll get back to you!",
};

const CLOSE_ANIM_MS = 260;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const close = useCallback(() => {
    // Play the exit animation, then unmount
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_ANIM_MS);
  }, []);

  const toggle = useCallback(() => {
    if (open) close();
    else setOpen(true);
  }, [open, close]);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    // Refocus whenever the window opens or a reply finishes,
    // so the visitor can keep typing without tapping the input again
    if (open && !loading && inputRef.current) inputRef.current.focus();
  }, [open, loading]);

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
        onClick={toggle}
        aria-label={open ? "Close chat" : "Chat with Santosh's AI"}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className={`neo-chat-window${closing ? " neo-chat-closing" : ""}`}>
          <div className="neo-chat-header">
            <span className="neo-chat-header-dot" />
            <span>Chat with Santosh</span>
            <button className="neo-chat-close" onClick={close} aria-label="Close chat">
              ✕
            </button>
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
