import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, usePlane } from "@react-three/cannon";
import Car from "./components/Car";
import "./index.css";

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

  useFrame(() => {
    if (carRef.current && controlsRef.current) {
      const carPosition = carRef.current.position;
      controlsRef.current.target.lerp(carPosition, 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          <Plane position={[0, -0.5, 0]} />
          <Car ref={carRef} />
        </Physics>
        <OrbitControls ref={controlsRef} />
      </Canvas>
    </div>
  );
}

export default App;
