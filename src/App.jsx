import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics as RapierPhysics } from "@react-three/rapier";
import Car from "./components/Car";
import Desert from "./components/Desert"; // Import the Desert component
import Bullet from "./components/Bullet"; // Import the Bullet component
import { useBulletStore } from "./store/useBulletStore"; // Import the bullet store
import "./index.css";

// Define the controls map
export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  shoot: "shoot",
};

function App() {
  const carRef = useRef();
  const controlsRef = useRef();
  const bullets = useBulletStore((state) => state.bullets);
  const removeBullet = useBulletStore((state) => state.removeBullet);

  // Define the keyboard map for the controls
  const map = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "w"] },
    { name: Controls.backward, keys: ["ArrowDown", "s"] },
    { name: Controls.left, keys: ["ArrowLeft", "a"] },
    { name: Controls.right, keys: ["ArrowRight", "d"] },
    { name: Controls.shoot, keys: ["Space"] },
  ], []);

  useFrame(() => {
    if (carRef.current && controlsRef.current) {
      const rigidBody = carRef.current;
      if (rigidBody) {
        const carPosition = rigidBody.translation();
        controlsRef.current.target.lerp(carPosition, 0.1);
        controlsRef.current.update();
      }
    }

    // Bullet lifecycle management
    bullets.forEach((bullet) => {
      if (Date.now() - bullet.timestamp > 3000) {
        // Remove bullet after 3 seconds
        removeBullet(bullet.id);
      }
    });
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <KeyboardControls map={map}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <RapierPhysics>
            <Desert position={[0, -0.5, 0]} />
            <Car ref={carRef} />
            {bullets.map((bullet) => (
              <Bullet key={bullet.id} position={bullet.position} velocity={bullet.velocity} />
            ))}
          </RapierPhysics>
          <OrbitControls ref={controlsRef} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
