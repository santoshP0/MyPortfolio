import React, { useState, useCallback } from "react";
import { useRevealChildren } from "./useReveal";
import {
  NAV, HERO, STATS, PROJECTS, EXPERIENCE,
  SKILLS_INTRO, SKILL_CARDS, TOOLKIT,
  BLOG_ARTICLES, CONTACT, FOOTER, MARQUEE_PHRASES,
} from "../../constants/copy/neo-portfolio";
import { sendAlertzyTransmission } from "../../utils/alertzy";
import resumePdf from "../../Assets/Santosh.pdf";
import "../../styles/neo-brutalist.css";

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
              {HERO.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
              ))}
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
function ProjectCard({ p }) {
  const href = p.androidLink || p.iosLink || p.link || "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="neo-project-card neo-reveal"
      style={{ background: p.color, transform: `rotate(${p.rotate}deg)`, textDecoration: "none", color: "inherit" }}
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
      <div className="neo-card-footer">
        <span className="neo-card-role">{p.role}</span>
        <span className="neo-card-arrow">→</span>
      </div>
    </a>
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

/* ── Experience ───────────────────────────────────────────── */
function ExperienceSection() {
  return (
    <section id="experience" style={{ paddingTop: 110 }}>
      <div className="neo-section-header neo-reveal">
        <h2 className="neo-section-title">Experience</h2>
        <span className="neo-section-count">A working history</span>
      </div>
      <div className="neo-section-divider neo-reveal" />
      <div className="neo-experience-list">
        {EXPERIENCE.map((e) => (
          <div key={e.num} className="neo-experience-card neo-reveal">
            <div>
              <span className="neo-exp-period" style={{ background: e.color }}>{e.period}</span>
              <div className="neo-exp-location">{e.location}</div>
            </div>
            <div>
              <h3 className="neo-exp-role">{e.role}</h3>
              <div className="neo-exp-company">{e.company}</div>
              <p className="neo-exp-desc">{e.desc}</p>
            </div>
            <span className="neo-exp-num">{e.num}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }} className="neo-reveal">
        <a
          href={resumePdf}
          target="_blank"
          rel="noreferrer"
          className="neo-btn-accent"
        >
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
        <h2 className="neo-section-title">Field Notes</h2>
        <span className="neo-section-count">{String(BLOG_ARTICLES.length).padStart(2, "0")} articles</span>
      </div>
      <div className="neo-section-divider neo-reveal" />
      <div className="neo-blog-grid neo-stagger">
        {BLOG_ARTICLES.map((a) => (
          <a key={a.title} href={a.link} target="_blank" rel="noreferrer" className="neo-blog-card neo-reveal">
            <img src={a.image} alt={a.title} loading="lazy" />
            <div className="neo-blog-card-body">
              <h3 className="neo-blog-card-title">{a.title}</h3>
              <p className="neo-blog-card-desc">{a.desc}</p>
              <div className="neo-blog-card-tags">
                {a.tags.map((t) => <span key={t} className="neo-blog-card-tag">{t}</span>)}
              </div>
            </div>
          </a>
        ))}
      </div>
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
                <span className="neo-contact-link-dot" />
                {CONTACT.email}
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="neo-contact-link">
                <span className="neo-contact-link-dot" />
                LinkedIn Profile
              </a>
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
          {FOOTER.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </div>
      </footer>
    </section>
  );
}

/* ── Main Portfolio ───────────────────────────────────────── */
export default function NeoPortfolio() {
  const containerRef = useRevealChildren();

  return (
    <div className="neo-container" ref={containerRef}>
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
  );
}
