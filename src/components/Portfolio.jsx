import React, { useEffect, useRef, useState } from "react";
import "../styles/portfolio.css";
import { SiLinkedin } from "react-icons/si";
import { MdHome, MdWork, MdApps, MdBuild, MdArticle, MdMail, MdLocationOn } from "react-icons/md";
import { PROFILE, EXPERIENCE, PROJECTS, SKILLS, TOOLS, BLOGS, CONTACT } from "../data/portfolioData.jsx";

const NAV = [
  { id: "home",       label: "Home",       icon: <MdHome />    },
  { id: "experience", label: "Experience", icon: <MdWork />    },
  { id: "projects",   label: "Projects",   icon: <MdApps />    },
  { id: "skills",     label: "Skills",     icon: <MdBuild />   },
  { id: "blogs",      label: "Blogs",      icon: <MdArticle /> },
  { id: "contact",    label: "Contact",    icon: <MdMail />    },
];

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const sectionRefs = useRef({});

  const refFor = (id) => (el) => { sectionRefs.current[id] = el; };

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + window.innerHeight / 3;
      let current = "home";
      NAV.forEach(({ id }) => {
        const el = sectionRefs.current[id];
        if (el && el.offsetTop <= pos) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const els = document.querySelectorAll(".pf-scroll-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pf-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pf-root">
      {/* ── Sidebar ── */}
      <aside className="pf-sidebar">
        <div className="pf-sidebar-inner">
          <div className="pf-sidebar-brand">
            <div className="pf-sidebar-brand-name">{PROFILE.name}</div>
            <div className="pf-sidebar-brand-role">{PROFILE.role}</div>
          </div>
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              data-label={label}
              className={`pf-nav-pill${active === id ? " pf-nav-pill--active" : ""}`}
              aria-label={label}
            >
              <span className="pf-nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="pf-main">

        {/* Home */}
        <section id="home" ref={refFor("home")} className="pf-section">
          <div className="pf-hero-wrapper">
            <div className="pf-hero-main">
              <div className="pf-card pf-hero-card">
                <div className="pf-hero-inner">
                  <span className="pf-hero-badge">{PROFILE.badge}</span>
                  <h1 className="pf-hero-name">{PROFILE.name}</h1>
                  <p className="pf-hero-tagline">{PROFILE.tagline}</p>
                  <div className="pf-hero-cta">
                    <button className="pf-btn pf-btn-primary" onClick={() => scrollTo("projects")}>
                      View Projects
                    </button>
                    <button className="pf-btn" onClick={() => scrollTo("contact")}>
                      Contact Me
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="pf-hero-stats">
              {PROFILE.stats.map((s, i) => (
                <div key={i} className="pf-stat-card">
                  <span className="pf-stat-value">{s.value}</span>
                  <span className="pf-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" ref={refFor("experience")} className="pf-section">
          <h2 className="pf-title">Experience</h2>
          <div className="pf-timeline">
            <div className="pf-timeline-line" />
            {EXPERIENCE.map((e, i) => (
              <div
                key={i}
                className={`pf-timeline-item ${i % 2 === 0 ? "pf-timeline-item--left" : "pf-timeline-item--right"} pf-scroll-animate`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="pf-timeline-dot" />
                <div className="pf-timeline-card">
                  <p className="pf-timeline-role">{e.role}</p>
                  <p className="pf-timeline-company">{e.company}</p>
                  <p className="pf-timeline-time">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" ref={refFor("projects")} className="pf-section">
          <h2 className="pf-title">Projects</h2>
          <div className="pf-projects">
            {PROJECTS.map((p, i) => (
              <div key={i} className="pf-card pf-scroll-animate" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="pf-project-thumb">
                  <img src={p.img} alt={p.title} loading="lazy" />
                </div>
                <div className="pf-project-content">
                  <p className="pf-project-title">{p.title}</p>
                  <p className="pf-project-desc">{p.desc}</p>
                  <div className="pf-project-actions">
                    {p.android && (
                      <a href={p.android} target="_blank" rel="noopener noreferrer" className="pf-btn">Android</a>
                    )}
                    {p.ios && (
                      <a href={p.ios} target="_blank" rel="noopener noreferrer" className="pf-btn">iOS</a>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="pf-btn">Read More</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Tools */}
        <section id="skills" ref={refFor("skills")} className="pf-section">
          <h2 className="pf-title pf-scroll-animate">Skills</h2>
          <div className="pf-skills-grid">
            {SKILLS.map((s, i) => (
              <div key={i} className="pf-skill-tile pf-scroll-animate" style={{ transitionDelay: `${i * 45}ms` }}>
                <span className="pf-skill-icon">{s.icon}</span>
                <span className="pf-skill-name">{s.name}</span>
              </div>
            ))}
          </div>

          <h2 className="pf-title pf-tools-title pf-scroll-animate">Tools</h2>
          <div className="pf-skills-grid">
            {TOOLS.map((t, i) => (
              <div key={i} className="pf-skill-tile pf-scroll-animate" style={{ transitionDelay: `${i * 45}ms` }}>
                <span className="pf-skill-icon">{t.icon}</span>
                <span className="pf-skill-name">{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section id="blogs" ref={refFor("blogs")} className="pf-section">
          <h2 className="pf-title">Blogs</h2>
          <div className="pf-blogs">
            {BLOGS.map((b, i) => (
              <div key={i} className="pf-card pf-scroll-animate" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="pf-blog-thumb">
                  <img src={b.img} alt={b.title} loading="lazy" />
                </div>
                <p className="pf-blog-title">{b.title}</p>
                <p className="pf-blog-desc">{b.desc}</p>
                <a href={b.link} target="_blank" rel="noopener noreferrer" className="pf-btn">
                  Read
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" ref={refFor("contact")} className="pf-section">
          <h2 className="pf-title">Get In Touch</h2>
          <div className="pf-contact-wrapper">
            <div className="pf-contact-info">
              <div className="pf-contact-card-mini pf-scroll-animate">
                <div className="pf-contact-label-row">
                  <MdMail className="pf-contact-type-icon" />
                  <span className="pf-contact-label">Email</span>
                </div>
                <a href={`mailto:${CONTACT.email}`} className="pf-contact-value">
                  {CONTACT.email}
                </a>
              </div>
              <div className="pf-contact-card-mini pf-scroll-animate" style={{ transitionDelay: "80ms" }}>
                <div className="pf-contact-label-row">
                  <MdLocationOn className="pf-contact-type-icon" />
                  <span className="pf-contact-label">Location</span>
                </div>
                <span className="pf-contact-value">{CONTACT.location}</span>
              </div>
              <div className="pf-contact-card-mini pf-scroll-animate" style={{ transitionDelay: "160ms" }}>
                <div className="pf-contact-label-row">
                  <SiLinkedin className="pf-contact-type-icon" />
                  <span className="pf-contact-label">LinkedIn</span>
                </div>
                <a
                  href={CONTACT.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-contact-value"
                >
                  {CONTACT.linkedin.label}
                </a>
              </div>
            </div>
            <div className="pf-card pf-contact-card pf-scroll-animate" style={{ transitionDelay: "80ms" }}>
              <h3 className="pf-contact-form-title">Send a Message</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="pf-form-row">
                  <input className="pf-input" placeholder="Your Name" type="text" />
                  <input className="pf-input" placeholder="Your Email" type="email" />
                </div>
                <input className="pf-input" placeholder="Subject" type="text" />
                <textarea className="pf-input" placeholder="Your Message" rows={5} />
                <button type="submit" className="pf-submit">
                  <span>Send Message</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
