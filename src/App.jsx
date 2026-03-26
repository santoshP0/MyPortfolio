import React, { useState, useEffect } from "react";
import Portfolio from "./components/Portfolio";
import "./App.css";

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`preloader ${loaded ? "preloader--hidden" : ""}`}>
        <div className="preloader-ripple">
          <div className="preloader-circle"></div>
          <div className="preloader-circle"></div>
          <div className="preloader-circle"></div>
        </div>
        <span className="preloader-text">Loading...</span>
      </div>
      <div className={`App ${loaded ? "App--ready" : ""}`}>
        <Portfolio />
      </div>
    </>
  );
}

export default App;
