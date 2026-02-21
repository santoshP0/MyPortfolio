import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics as RapierPhysics, usePlane } from "@react-three/rapier";
import Car from "./components/Car";
import "./index.css";

// Define the controls map
export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  shoot: "shoot",
};

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#81A88D" />
    </mesh>
  );
}

function App() {
  const carRef = useRef();
  const controlsRef = useRef();

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
      // Get the Rapiers rigid body instance
      const rigidBody = carRef.current.current;
      if (rigidBody) {
        const carPosition = rigidBody.translation(); // Get Rapier's translation
        controlsRef.current.target.lerp(carPosition, 0.1);
        controlsRef.current.update();
      }
    }
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <KeyboardControls map={map}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <RapierPhysics>
            <Plane position={[0, -0.5, 0]} />
            <Car ref={carRef} />
          </RapierPhysics>
          <OrbitControls ref={controlsRef} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
