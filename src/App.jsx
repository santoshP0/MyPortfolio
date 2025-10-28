import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Resume from "./components/Resume/ResumeNew";
import Footer from "./components/Footer";
import SectionNav from "./components/SectionNav";
import "./style.css";
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

  useEffect(() => {
    document.body.style.overflow = load ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [load]);

  return (
    <>
      <Preloader load={load} />
      <div className={`App ${load ? "App--locked" : "App--ready"}`}>
        <main className="anime-layout">
          <Home />
          <About />
          <Projects />
          <Resume />
        </main>
        <SectionNav />
        <Footer />
      </div>
    </>
  );
}

export default App;
