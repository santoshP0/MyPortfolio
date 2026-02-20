import React from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Scene from "./game/Scene";
import Footer from "./components/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "w", "W"] },
    { name: "backward", keys: ["ArrowDown", "s", "S"] },
    { name: "left", keys: ["ArrowLeft", "a", "A"] },
    { name: "right", keys: ["ArrowRight", "d", "D"] },
    { name: "jump", keys: ["Space"] },
  ];

  return (
    <div className="App">
      <KeyboardControls map={keyboardMap}>
        <Canvas style={{ flex: 1, height: '100vh' }}>
          <Scene />
        </Canvas>
      </KeyboardControls>
      <Footer />
    </div>
  );
}

export default App;
