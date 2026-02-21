import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics as RapierPhysics } from "@react-three/rapier";
import Car from "./components/Car";
import Desert from "./components/Desert";
import Bullet from "./components/Bullet";
import BreakableObject from "./components/BreakableObject"; // Import BreakableObject
import { useBulletStore } from "./store/useBulletStore";
import { useObjectStore } from "./store/useObjectStore"; // Import useObjectStore
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

  const objects = useObjectStore((state) => state.objects);
  const addObject = useObjectStore((state) => state.addObject);

  // Initialize some breakable objects
  useEffect(() => {
    addObject([-5, 0, -10], [1, 1, 1], 3); // Example object 1
    addObject([5, 0, -15], [1.5, 1.5, 1.5], 5); // Example object 2
  }, [addObject]);

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
            {objects.map((object) => (
              <BreakableObject
                key={object.id}
                id={object.id}
                position={object.position}
                args={object.args}
                health={object.health}
              />
            ))}
          </RapierPhysics>
          <OrbitControls ref={controlsRef} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
