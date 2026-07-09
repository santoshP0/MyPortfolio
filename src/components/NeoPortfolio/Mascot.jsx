import { useEffect, useRef, useState, useCallback } from "react";

const CHAT_ENDPOINT = "/.netlify/functions/chat";

/* Greeting based on visitor's local time + day */
function timeGreeting() {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay();

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const byHour =
    h < 5 ? ["Whoa, night owl! 🦉 What brings you here at this hour?", "Up late? Same energy as my deploy nights. What's up?"]
    : h < 12 ? ["Good morning! ☀️ Coffee in hand? Ask me anything.", "Morning! Fresh day, fresh code. What can I tell you?"]
    : h < 17 ? ["Good afternoon! 👋 Looking for a dev? You found one.", "Hey there! Afternoon browsing pays off — ask me anything."]
    : h < 21 ? ["Good evening! 🌆 Perfect time to talk projects.", "Evening! Winding down or just getting started? Ask away."]
    : ["Late night scroll? 🌙 I'm still awake too. What's up?", "Night shift, huh? Ask me anything about my work."];

  const byDay =
    day === 1 ? ["Happy Monday! New week, new builds. What can I help with?"]
    : day === 5 ? ["It's Friday! 🎉 Great day to plan a new project. Ask me anything."]
    : day === 0 || day === 6 ? ["Weekend visit? Respect. 🙌 Ask me anything about my work."]
    : [];

  return pick([...byHour, ...byDay]);
}

/* Fallback one-liners — used until the Groq batch arrives (or if it fails) */
const BLURBS = [
  "Psst... ask me about Santosh's apps 📱",
  "He shipped 2 apps to both app stores. Just saying.",
  "58 dev tools in one toolbox. I counted.",
  "React Native is kind of our thing.",
  "beep boop... jk, I speak human too.",
  "Built an e-commerce site in one month. True story.",
  "I follow your cursor. Not creepy at all. 👀",
  "5+ years of shipping code. Zero missed deploys*. (*mostly)",
  "Click me, I know things.",
  "Two npm packages published. NFC + CarPlay. 🚗",
  "Fueled by ∞ cups of coffee.",
  "Need a mobile dev? You're 1 click away.",
];

/* Paper-craft robot mascot — now the chat itself */
export default function Mascot() {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [waving, setWaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [blurb, setBlurb] = useState(null);
  const [sleeping, setSleeping] = useState(false);
  const blurbsRef = useRef(BLURBS);
  const sleepTimer = useRef(null);

  /* Doze off after 40s of no interaction; any activity wakes him */
  useEffect(() => {
    const rearm = () => {
      setSleeping(false);
      clearTimeout(sleepTimer.current);
      sleepTimer.current = setTimeout(() => setSleeping(true), 40000);
    };
    rearm();
    const evts = ["mousemove", "scroll", "touchstart", "keydown"];
    evts.forEach((e) => window.addEventListener(e, rearm, { passive: true }));
    return () => {
      clearTimeout(sleepTimer.current);
      evts.forEach((e) => window.removeEventListener(e, rearm));
    };
  }, []);

  /* Fetch one fresh batch per visit; cache for the session */
  useEffect(() => {
    const cached = sessionStorage.getItem("sk-blurbs");
    if (cached) {
      try {
        const arr = JSON.parse(cached);
        if (arr.length) { blurbsRef.current = arr; return; }
      } catch (_) {}
    }
    fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "blurbs" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.blurbs) && d.blurbs.length) {
          blurbsRef.current = d.blurbs;
          sessionStorage.setItem("sk-blurbs", JSON.stringify(d.blurbs));
        }
      })
      .catch(() => {});
  }, []);

  /* Idle chatter while chat is closed (and he's awake) */
  useEffect(() => {
    if (open || sleeping) { setBlurb(null); return; }
    let hideTimer;
    const showOne = () => {
      const list = blurbsRef.current;
      setBlurb(list[Math.floor(Math.random() * list.length)]);
      hideTimer = setTimeout(() => setBlurb(null), 5000);
    };
    const first = setTimeout(showOne, 4000);
    const loop = setInterval(showOne, 22000);
    return () => { clearTimeout(first); clearInterval(loop); clearTimeout(hideTimer); };
  }, [open, sleeping]);

  /* Eyes follow cursor on desktop */
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const onMove = (e) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const max = 3.5;
      const d = Math.max(Math.hypot(dx, dy), 1);
      el.style.setProperty("--look-x", `${(dx / d) * max}px`);
      el.style.setProperty("--look-y", `${(dy / d) * max}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (open && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  useEffect(() => {
    if (open && !loading && inputRef.current) inputRef.current.focus();
  }, [open, loading]);

  const toggle = useCallback(() => {
    if (open) {
      setClosing(true);
      setTimeout(() => { setOpen(false); setClosing(false); }, 240);
      return;
    }
    setWaving(true);
    setTimeout(() => setWaving(false), 1200);
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: timeGreeting() }]);
    }
    setOpen(true);
  }, [open, messages.length]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await resp.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Hmm, something glitched. Try again!" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Couldn't connect. Try again in a bit!" }]);
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
      {open && (
        <div className={`neo-bot-dialog${closing ? " neo-bot-dialog-closing" : ""}`}>
          <button className="neo-chat-close neo-bot-dialog-close" onClick={toggle} aria-label="Close chat">✕</button>
          <div className="neo-bot-dialog-messages">
            {messages.map((m, i) => (
              <div key={i} className={`neo-chat-bubble neo-chat-${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="neo-chat-bubble neo-chat-assistant neo-chat-typing"><span /><span /><span /></div>
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
              placeholder="Say something to SK-bot..."
              maxLength={500}
            />
            <button className="neo-chat-send" onClick={send} disabled={loading || !input.trim()}>→</button>
          </div>
        </div>
      )}

      {!open && blurb && (
        <div className="neo-bot-blurb" onClick={toggle}>{blurb}</div>
      )}

      <div
        ref={rootRef}
        className={[
          "neo-mascot",
          waving && "neo-mascot-waving",
          open && "neo-mascot-chatting",
          loading && "neo-mascot-thinking",
          sleeping && !open && "neo-mascot-sleeping",
        ].filter(Boolean).join(" ")}
        onClick={toggle}
        title="Chat with SK-bot"
        role="button"
        aria-label="Chat with Santosh"
      >
        <span className="neo-mascot-zzz" aria-hidden="true">z<i>z</i><b>z</b></span>
        <div className="neo-mascot-antenna"><span /></div>
        <div className="neo-mascot-head">
          <div className="neo-mascot-brows"><span /><span /></div>
          <div className="neo-mascot-eyes">
            <span className="neo-mascot-eye"><span className="neo-mascot-pupil" /></span>
            <span className="neo-mascot-eye"><span className="neo-mascot-pupil" /></span>
          </div>
          <div className="neo-mascot-cheeks"><span /><span /></div>
          <div className="neo-mascot-mouth" />
        </div>
        <div className="neo-mascot-body">
          <span className="neo-mascot-arm neo-mascot-arm-l" />
          <span className="neo-mascot-arm neo-mascot-arm-r" />
        </div>
        <div className="neo-mascot-feet"><span /><span /></div>
      </div>
    </>
  );
}
