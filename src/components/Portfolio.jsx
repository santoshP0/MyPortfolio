import React, { useEffect, useRef, useState } from "react";
import "../styles/portfolio.css";
import {
  SiJavascript, SiTypescript, SiReact, SiNodedotjs, SiPython,
  SiMongodb, SiFirebase, SiAmazon, SiKotlin, SiSwift,
  SiGit, SiAndroid, SiApple,
  SiVscodium, SiPostman, SiAndroidstudio, SiXcode,
  SiFigma, SiGithub, SiJira
} from "react-icons/si";
import { FaReacteurope } from "react-icons/fa";
import {
  MdHome, MdWork, MdApps, MdBuild, MdArticle, MdMail
} from "react-icons/md";

import mrImg from "../Assets/Projects/MR.webp";
import oncallImg from "../Assets/Projects/oncallMobile.webp";
import denoImg from "../Assets/Projects/Deno.webp";
import widgetImg from "../Assets/Projects/androidWidget.jpg";
import notiImg from "../Assets/Projects/modernNoti.webp";
import rnImg from "../Assets/Projects/ReactNative.png";
import twilioImg from "../Assets/Projects/twilio.png";

const NAV = [
  { id: "home", label: "Home", icon: <MdHome /> },
  { id: "experience", label: "Experience", icon: <MdWork /> },
  { id: "projects", label: "Projects", icon: <MdApps /> },
  { id: "skills", label: "Skills", icon: <MdBuild /> },
  { id: "blogs", label: "Blogs", icon: <MdArticle /> },
  { id: "contact", label: "Contact", icon: <MdMail /> },
];

const EXPERIENCE = [
  {
    role: "Senior Software Developer",
    company: "Hexagon's Capability Center India (HCCI)",
    time: "2022 – Present",
  },
  {
    role: "Software Developer",
    company: "Botzop",
    time: "2019 – 2021",
  },
  {
    role: "B.Tech · Computer Science Engineering",
    company: "Mahaveer Institute of Science and Technology",
    time: "2015 – 2019",
  },
];

const PROJECTS = [
  {
    title: "Intergraph Mobile Responder",
    desc: "Extends I/CAD capabilities to always-connected responders with native performance, secure messaging, GPS, and camera integrations.",
    img: mrImg,
    android: "https://play.google.com/store/apps/details?id=com.hexagon.mobileresponder&hl=en",
    ios: "https://apps.apple.com/us/app/intergraph-mobile-responder-rn/id6474117198",
  },
  {
    title: "OnCall Mobile",
    desc: "Empowers field units with dispatch intelligence, real-time updates, and frictionless coordination directly on handheld devices.",
    img: oncallImg,
    android: "https://play.google.com/store/apps/details?id=com.hexagon.oncallmobile&hl=en",
    ios: "https://apps.apple.com/us/app/hxgn-oncall-mobile/id1502277906",
  },
];

const SKILLS = [
  { name: "React Native", icon: <FaReacteurope /> },
  { name: "React.js", icon: <SiReact /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "Node.js", icon: <SiNodedotjs /> },
  { name: "Python", icon: <SiPython /> },
  { name: "Kotlin", icon: <SiKotlin /> },
  { name: "Swift", icon: <SiSwift /> },
  { name: "AWS", icon: <SiAmazon /> },
  { name: "Firebase", icon: <SiFirebase /> },
  { name: "MongoDB", icon: <SiMongodb /> },
  { name: "Android", icon: <SiAndroid /> },
  { name: "iOS", icon: <SiApple /> },
  { name: "Git", icon: <SiGit /> },
];

const BLOGS = [
  {
    title: "Deno vs Node.js",
    desc: "Performance, security, and DX trade-offs across REST, WebSocket, and GraphQL builds.",
    img: denoImg,
    link: "https://medium.com/@santosh.pk/building-a-rest-api-websocket-and-graphql-server-in-deno-25616c95c5a6",
  },
  {
    title: "Custom Android Widgets",
    desc: "Reimagining React Native widgets to keep users locked into core flows from the home screen.",
    img: widgetImg,
    link: "https://medium.com/@santosh.pk/implementation-of-react-native-widget-for-android-14fe648a9b06",
  },
  {
    title: "Modern Notifications",
    desc: "Taming Notifee for cinematic push notifications with rich media, deep links, and custom actions.",
    img: notiImg,
    link: "https://medium.com/@santosh.pk/implementing-modern-push-notifications-in-react-native-android-notifee-72de60ee2712",
  },
  {
    title: "React Native Best Practices",
    desc: "Key systems that keep React Native apps fast, stable, and ready for scale.",
    img: rnImg,
    link: "http://blog.zenof.ai/8-best-practices-for-your-react-native-app/",
  },
  {
    title: "Video Calling with Twilio",
    desc: "Building production-ready Twilio video experiences with call controls and polished UX.",
    img: twilioImg,
    link: "http://blog.zenof.ai/create-a-react-native-video-calling-app-using-twilio/",
  },
  {
    title: "Object Detection in RN",
    desc: "Deploying TensorFlow-powered recognition in React Native for real-time scene awareness.",
    img: rnImg,
    link: "http://blog.zenof.ai/building-react-native-object-detection-app-using-tensorflow-with-react-hooks/",
  },
];

const TOOLS = [
  { name: "VS Code", icon: <SiVscodium /> },
  { name: "Android Studio", icon: <SiAndroidstudio /> },
  { name: "Xcode", icon: <SiXcode /> },
  { name: "Postman", icon: <SiPostman /> },
  { name: "Figma", icon: <SiFigma /> },
  { name: "GitHub", icon: <SiGithub /> },
  { name: "Jira", icon: <SiJira /> },
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
            <div className="pf-sidebar-brand-name">Santosh</div>
            <div className="pf-sidebar-brand-role">Mobile Dev</div>
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
                  <span className="pf-hero-badge">Mobile App Developer</span>
                  <h1 className="pf-hero-name">Santosh</h1>
                  <p className="pf-hero-tagline">
                    Building high-performance mobile applications with React Native,
                    TypeScript &amp; modern tech stack. 5+ years of experience
                    delivering production-ready apps.
                  </p>
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
              <div className="pf-stat-card">
                <span className="pf-stat-value">5+</span>
                <span className="pf-stat-label">Years Exp.</span>
              </div>
              <div className="pf-stat-card">
                <span className="pf-stat-value">4+</span>
                <span className="pf-stat-label">Apps Released</span>
              </div>
              <div className="pf-stat-card">
                <span className="pf-stat-value">100%</span>
                <span className="pf-stat-label">Delivery</span>
              </div>
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
                className={`pf-timeline-item ${i % 2 === 0 ? "pf-timeline-item--left" : "pf-timeline-item--right"}`}
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
              <div key={i} className="pf-card">
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
          <h2 className="pf-title">Skills</h2>
          <div className="pf-skills-grid">
            {SKILLS.map((s, i) => (
              <div key={i} className="pf-skill-tile">
                <span className="pf-skill-icon">{s.icon}</span>
                <span className="pf-skill-name">{s.name}</span>
              </div>
            ))}
          </div>

          <h2 className="pf-title pf-tools-title">Tools</h2>
          <div className="pf-skills-grid">
            {TOOLS.map((t, i) => (
              <div key={i} className="pf-skill-tile">
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
              <div key={i} className="pf-card">
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
              <div className="pf-contact-card-mini">
                <span className="pf-contact-label">Email</span>
                <a href="mailto:santoshpk.mdev@gmail.com" className="pf-contact-value">
                  santoshpk.mdev@gmail.com
                </a>
              </div>
              <div className="pf-contact-card-mini">
                <span className="pf-contact-label">Location</span>
                <span className="pf-contact-value">Telangana, India</span>
              </div>
              <div className="pf-contact-card-mini">
                <span className="pf-contact-label">LinkedIn</span>
                <a
                  href="https://www.linkedin.com/in/santosh-kumar-649928265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-contact-value"
                >
                  santosh-kumar
                </a>
              </div>
            </div>
            <div className="pf-card pf-contact-card">
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
