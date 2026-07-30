import React, { useState, useCallback } from "react";
import { FaGithub, FaLinkedin, FaMediumM, FaNpm, FaGooglePlay, FaApple, FaGlobe } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { useRevealChildren } from "./useReveal";
import {
  NAV, HERO, STATS, PROJECTS, EXPERIENCE,
  SKILLS_INTRO, SKILL_CARDS, TOOLKIT,
  BLOG_ARTICLES, CONTACT, FOOTER, MARQUEE_PHRASES,
} from "../../constants/copy/neo-portfolio";
import { sendAlertzyTransmission } from "../../utils/alertzy";
import resumePdf from "../../Assets/Santosh.pdf";
import Mascot from "./Mascot";
import BlogDeck from "./BlogDeck";
import CursorGrid from "./CursorGrid";
import "../../styles/neo-brutalist.css";

/* ── Scroll progress bar ─────────────────────────────────── */
function ScrollProgress() {
  const barRef = React.useRef(null);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="neo-progress"><div ref={barRef} className="neo-progress-bar" /></div>;
}

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Medium: FaMediumM,
  npm: FaNpm,
};

/* ── Corner Markers ─────────────────────────────────────── */
function Corners() {
  return (
    <>
      <span className="neo-corner neo-corner--tl" />
      <span className="neo-corner neo-corner--tr" />
      <span className="neo-corner neo-corner--bl" />
      <span className="neo-corner neo-corner--br" />
    </>
  );
}

/* ── Nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="neo-nav">
      <div className="neo-nav-brand">
        <span className="neo-nav-name">{NAV.name}</span>
        <span className="neo-nav-role">{NAV.role}</span>
      </div>
      <nav className="neo-nav-links">
        {NAV.links.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </nav>
    </header>
  );
}

/* ── Divider ─────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="neo-divider">
      <div className="neo-divider-line" />
      <span className="neo-divider-label">ISSUE No. 01 — {new Date().getFullYear()}</span>
      <div className="neo-divider-line" />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="neo-hero">
      <div className="neo-hero-grid">
        {/* Photo */}
        <div className="neo-photo-wrapper" style={{ transform: "rotate(-1.4deg)" }}>
          <div className="neo-photo-card">
            <div className="neo-photo-placeholder">SK</div>
            <div className="neo-photo-meta">
              <span style={{ color: "#6b6b63" }}>santosh.dev</span>
              <span className="neo-status">
                <span className="neo-status-dot" />
                Open
              </span>
            </div>
          </div>
          <div className="neo-stamp">
            <span>Est.<br />2019</span>
          </div>
        </div>

        {/* Intro */}
        <div>
          <div className="neo-availability">
            <span className="neo-availability-dot" />
            <span>{HERO.availabilityBadge}</span>
          </div>

          <h1 className="neo-hero-title">
            {HERO.greeting}<br />
            {HERO.firstName} <span style={{ fontStyle: "italic" }}>{HERO.lastName}</span>
          </h1>

          <p className="neo-hero-bio">{HERO.bio}</p>

          <div className="neo-hero-tags">
            {HERO.tags.map((t) => (
              <span key={t.text} className="neo-tag" style={{ background: t.color }}>
                {t.icon && <>{t.icon} </>}{t.text}
              </span>
            ))}
          </div>

          <div className="neo-hero-ctas">
            <a href="#work" className="neo-btn-primary">View my work →</a>
            <a href="#contact" className="neo-btn-secondary">Get in touch</a>
            <div className="neo-social-links">
              {HERO.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="neo-social-chip" title={s.label} aria-label={s.label}>
                    {Icon ? <Icon /> : s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats ────────────────────────────────────────────────── */
function StatStrip() {
  return (
    <section className="neo-stats neo-reveal">
      {STATS.map((s, i) => (
        <div key={i} className="neo-stat">
          <div className="neo-stat-value">{s.value}</div>
          <div className="neo-stat-label">{s.label}</div>
        </div>
      ))}
    </section>
  );
}

/* ── Projects ─────────────────────────────────────────────── */
function projectLinks(p) {
  const links = [];
  if (p.androidLink) links.push({ Icon: FaGooglePlay, label: "Play Store", href: p.androidLink });
  if (p.iosLink) links.push({ Icon: FaApple, label: "App Store", href: p.iosLink });
  if (p.link && p.link.includes("npmjs.com")) links.push({ Icon: FaNpm, label: "View on npm", href: p.link });
  else if (p.link) links.push({ Icon: FaGlobe, label: "Visit site", href: p.link });
  return links;
}

function ProjectCard({ p }) {
  const links = projectLinks(p);
  return (
    <div
      className="neo-project-card neo-reveal"
      style={{ background: p.color, transform: `rotate(${p.rotate}deg)` }}
    >
      <Corners />
      <div className="neo-card-header">
        <span className="neo-card-num">{p.num}</span>
        <span className="neo-card-year">{p.year}</span>
      </div>
      {p.image && <img className="neo-card-image" src={p.image} alt={p.title} loading="lazy" />}
      <h3 className="neo-card-title">{p.title}</h3>
      <p className="neo-card-desc">{p.desc}</p>
      <div className="neo-card-tags">
        {p.tags.map((t) => <span key={t} className="neo-card-tag">{t}</span>)}
      </div>
      <div className="neo-card-role-row">
        <span className="neo-card-role">{p.role}</span>
      </div>
      <div className="neo-card-links">
        {links.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="neo-card-link-btn"
            aria-label={`${p.title} — ${label}`}
          >
            <Icon /> <span>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function WorkSection() {
  return (
    <section id="work" style={{ paddingTop: 96 }}>
      <div className="neo-section-header neo-reveal">
        <h2 className="neo-section-title">Selected Work</h2>
        <span className="neo-section-count">{String(PROJECTS.length).padStart(2, "0")} collectible cards</span>
      </div>
      <div className="neo-section-divider neo-reveal" />
      <div className="neo-projects-grid neo-stagger">
        {PROJECTS.map((p) => <ProjectCard key={p.num} p={p} />)}
      </div>
    </section>
  );
}

/* ── Experience (scroll-fill timeline) ────────────────────── */
function ExperienceSection() {
  const railRef = React.useRef(null);
  const fillRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      const el = railRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Fill tracks the viewport middle passing through the rail
      const passed = window.innerHeight * 0.5 - r.top;
      const pct = Math.max(0, Math.min(1, passed / r.height));
      if (fillRef.current) fillRef.current.style.height = `${pct * 100}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="experience" style={{ paddingTop: 110 }}>
      <div className="neo-section-header neo-reveal">
        <h2 className="neo-section-title">Experience</h2>
        <span className="neo-section-count">A working history</span>
      </div>
      <div className="neo-section-divider neo-reveal" />

      <div className="neo-timeline" ref={railRef}>
        <div className="neo-timeline-track"><div className="neo-timeline-fill" ref={fillRef} /></div>
        {EXPERIENCE.map((e) => (
          <div key={e.num} className="neo-timeline-row neo-reveal">
            <span className="neo-timeline-dot" style={{ background: e.color }} />
            <div className="neo-experience-card">
              <div>
                <span className="neo-exp-period" style={{ background: e.color }}>{e.period}</span>
                <div className="neo-exp-location">{e.location}</div>
              </div>
              <div>
                <h3 className="neo-exp-role">{e.role}</h3>
                <div className="neo-exp-company">{e.company}</div>
                <p className="neo-exp-desc">{e.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }} className="neo-reveal">
        <a href={resumePdf} target="_blank" rel="noreferrer" className="neo-btn-accent">
          ↓ Download résumé (PDF)
        </a>
      </div>
    </section>
  );
}

/* ── Skills / Studio ──────────────────────────────────────── */
function SkillsSection() {
  return (
    <section id="skills" style={{ paddingTop: 110 }}>
      <div className="neo-studio-grid">
        <div className="neo-reveal-left">
          <span className="neo-studio-subtitle">{SKILLS_INTRO.subtitle}</span>
          <h2 className="neo-studio-title">
            {SKILLS_INTRO.title} <span style={{ fontStyle: "italic" }}>{SKILLS_INTRO.titleItalic}</span> {SKILLS_INTRO.titleEnd}
          </h2>
          <p className="neo-studio-desc">{SKILLS_INTRO.description}</p>
          <div className="neo-current-badge">{SKILLS_INTRO.currentFocus}</div>
        </div>
        <div className="neo-skills-grid neo-stagger">
          {SKILL_CARDS.map((s) => (
            <div key={s.num} className="neo-skill-card neo-reveal" style={{ background: s.color }}>
              <div className="neo-skill-num">{s.num}</div>
              <div className="neo-skill-title">{s.title}</div>
              <div className="neo-skill-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Marquee ──────────────────────────────────────────────── */
function MarqueeStrip() {
  const items = [...MARQUEE_PHRASES, ...MARQUEE_PHRASES, ...MARQUEE_PHRASES];
  return (
    <section className="neo-marquee neo-reveal-scale">
      <div className="neo-marquee-inner">
        {items.map((phrase, i) => (
          <React.Fragment key={i}>
            <span className="neo-marquee-phrase">{phrase}</span>
            <span className="neo-marquee-dot" />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ── Toolkit ──────────────────────────────────────────────── */
function ToolkitSection() {
  return (
    <section style={{ paddingTop: 110 }}>
      <div className="neo-section-header neo-reveal">
        <h2 className="neo-section-title">The Toolkit</h2>
        <span className="neo-section-count">What's in the drawer</span>
      </div>
      <div className="neo-section-divider neo-reveal" />
      <div className="neo-toolkit-grid neo-stagger">
        {TOOLKIT.map((g) => (
          <div
            key={g.num}
            className="neo-toolkit-card neo-reveal"
            style={{ background: g.color, transform: `rotate(${g.rotate}deg)` }}
          >
            <Corners />
            <div className="neo-card-header">
              <span className="neo-card-num">{g.num}</span>
              <span className="neo-card-year">{g.count}</span>
            </div>
            <h3 className="neo-toolkit-title">{g.title}</h3>
            <div className="neo-toolkit-items">
              {g.items.map((it) => <span key={it} className="neo-toolkit-item">{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Blog ─────────────────────────────────────────────────── */
function BlogSection() {
  return (
    <section id="blog" style={{ paddingTop: 110 }}>
      <div className="neo-section-header neo-reveal">
        <h2 className="neo-section-title">Blogs</h2>
        <span className="neo-section-count">{String(BLOG_ARTICLES.length).padStart(2, "0")} articles</span>
      </div>
      <div className="neo-section-divider neo-reveal" />
      <div className="neo-reveal"><BlogDeck /></div>
    </section>
  );
}

/* ── Contact ──────────────────────────────────────────────── */
function ContactSection() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: CONTACT.subjectOptions[0], message: "" });

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const result = await sendAlertzyTransmission({
        title: `Portfolio: ${formData.name}`,
        message: `From: ${formData.name} <${formData.email}>\nSubject: ${formData.subject}\n\n${formData.message}`,
      });
      if (result.ok) {
        setSent(true);
      } else {
        alert("Something went wrong. Please try emailing directly.");
      }
    } catch {
      alert("Something went wrong. Please try emailing directly.");
    } finally {
      setSending(false);
    }
  }, [formData]);

  return (
    <section id="contact" style={{ paddingTop: 110 }}>
      <div className="neo-contact neo-reveal">
        <div className="neo-contact-tab">{CONTACT.tabLabel}</div>
        <div className="neo-contact-grid">
          <div>
            <h2 className="neo-contact-title">{CONTACT.heading}</h2>
            <p className="neo-contact-desc">{CONTACT.description}</p>
            <div className="neo-contact-links">
              <a href={`mailto:${CONTACT.email}`} className="neo-contact-link">
                <span className="neo-contact-link-icon"><MdEmail /></span>
                {CONTACT.email}
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="neo-contact-link">
                <span className="neo-contact-link-icon"><FaLinkedin /></span>
                LinkedIn Profile
              </a>
              <span className="neo-contact-link" style={{ cursor: "default" }}>
                <span className="neo-contact-link-icon"><MdLocationOn /></span>
                Telangana, India
              </span>
            </div>
          </div>

          <form className="neo-form" onSubmit={handleSubmit}>
            {sent ? (
              <div className="neo-form-success">
                <div className="neo-form-success-title">{CONTACT.successTitle}</div>
                <p className="neo-form-success-desc">{CONTACT.successDesc}</p>
              </div>
            ) : (
              <div className="neo-form-fields">
                <label>
                  <span className="neo-form-label">{CONTACT.formLabels.name}</span>
                  <input type="text" name="name" required placeholder="Your name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                  <span className="neo-form-label">{CONTACT.formLabels.email}</span>
                  <input type="email" name="email" required placeholder="you@email.com" value={formData.email} onChange={handleChange} />
                </label>
                <label>
                  <span className="neo-form-label">{CONTACT.formLabels.subject}</span>
                  <select name="subject" value={formData.subject} onChange={handleChange}>
                    {CONTACT.subjectOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label>
                  <span className="neo-form-label">{CONTACT.formLabels.message}</span>
                  <textarea name="message" required rows={3} placeholder="Tell me about the project..." value={formData.message} onChange={handleChange} />
                </label>
                <button type="submit" className="neo-btn-primary" disabled={sending} style={{ width: "100%" }}>
                  {sending ? "Sending..." : CONTACT.submitText}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <footer className="neo-footer neo-reveal">
        <span>{FOOTER.copy}</span>
        <div className="neo-footer-links">
          {FOOTER.links.map((l) => {
            const Icon = SOCIAL_ICONS[l.label];
            return (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                {Icon && <Icon style={{ verticalAlign: "-2px", marginRight: 5 }} />}
                {l.label}
              </a>
            );
          })}
        </div>
      </footer>
    </section>
  );
}

/* ── Main Portfolio ───────────────────────────────────────── */
export default function NeoPortfolio() {
  const containerRef = useRevealChildren();

  return (
    <>
      <CursorGrid
        className="neo-cursor-grid"
        cellSize={64}
        color="#1a1a1a"
        radius={150}
        falloff="smooth"
        maxOpacity={0.32}
        lineWidth={1.2}
        holdTime={400}
        fadeDuration={800}
        clickPulse
        pulseSpeed={600}
      />
      <div className="neo-container" ref={containerRef}>
      <ScrollProgress />
      <Mascot />
      <Nav />
      <Divider />
      <Hero />
      <StatStrip />
      <WorkSection />
      <ExperienceSection />
      <SkillsSection />
      <MarqueeStrip />
      <ToolkitSection />
      <BlogSection />
      <ContactSection />
      </div>
    </>
  );
}
