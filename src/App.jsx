import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./game/Scene";
import Footer from "./components/Footer";
import FPSMeter from "./components/common/FPSMeter";
import "./styles/index.css";
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
      <div className={`App ${load ? "App--locked" : "App--ready"}`}>
        <Canvas style={{ flex: 1, height: '100vh' }}>
          <Scene />
        </Canvas>
        <Footer />
        <FPSMeter />
      </div>
    </>
  );
}

export default App;
