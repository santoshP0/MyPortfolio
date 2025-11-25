import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import AnimatedBackground from "./components/Anime/AnimatedBackground";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Resume from "./components/Resume/ResumeNew";
import Footer from "./components/Footer";
import SectionNav from "./components/SectionNav";
import FPSMeter from "./components/common/FPSMeter";
import "./styles/index.css";
import "./styles/anime-theme.css";
import "./styles/responsive-anime.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Ensure URL is the site root in all environments.
  // If someone visits a non-root path (e.g., /anything), normalize to '/'
  // to avoid confusing-looking URLs while still serving the SPA.
  useEffect(() => {
    try {
      if (window.location && window.location.pathname !== "/") {
        const url = new URL(window.location.href);
        url.pathname = "/";
        // Replace without reloading
        window.history.replaceState(null, "", url.toString());
      }
    } catch (_) {
      // no-op if URL parsing fails
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = load ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [load]);

  return (
    <>
      <Preloader load={load} />
      <AnimatedBackground />
      <div className={`App ${load ? "App--locked" : "App--ready"}`}>
        <main className="anime-layout">
          <Home />
          <About />
          <Projects />
          <Resume />
        </main>
        <SectionNav />
        <Footer />
        <FPSMeter />
      </div>
    </>
  );
}

export default App;
