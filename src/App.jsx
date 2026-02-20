import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./game/Scene";
import Footer from "./components/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Canvas style={{ flex: 1, height: '100vh' }}>
        <Scene />
      </Canvas>
      <Footer />
    </div>
  );
}

export default App;
