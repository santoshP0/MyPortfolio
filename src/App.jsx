import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PositionalAudio, Html } from "@react-three/drei";
import { Physics as RapierPhysics, RigidBody } from "@react-three/rapier";
import Car from "./components/Car";
import Desert from "./components/Desert";
import Bullet from "./components/Bullet";
import BreakableObjects from "./components/BreakableObjects";
import SandTrail from "./components/SandTrail";
import PortfolioPanel from "./components/PortfolioPanel";
import PauseSystem from "./components/PauseSystem";
import IntroOverlay from "./components/IntroOverlay";
import HealthBarHUD from "./components/HealthBarHUD";
import Scene from "./components/Scene";
import { useBulletStore } from "./store/useBulletStore";
import { useObjectStore } from "./store/useObjectStore";
import { usePortfolioPanelStore } from "./store/usePortfolioPanelStore";
import { portfolioData } from "./data/portfolioData";
import { nanoid } from "nanoid";
import "./index.css";

export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  shoot: "shoot",
};

// Invisible boundary walls at the edges of the 100x100 desert
function BoundaryWalls() {
  const wallDefs = [
    // [position, size] — thin invisible cubes
    { pos: [0, 3, -50], size: [100, 6, 1] },   // North
    { pos: [0, 3, 50], size: [100, 6, 1] },   // South
    { pos: [-50, 3, 0], size: [1, 6, 100] },   // West
    { pos: [50, 3, 0], size: [1, 6, 100] },   // East
  ];
  return (
    <>
      {wallDefs.map((w, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={w.pos}>
          <mesh visible={false}>
            <boxGeometry args={w.size} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

import * as THREE from "three";

function App() {
  const carRef = useRef();
  // Plain JS ref written by Car.jsx each frame — read by SandTrail (no Rapier calls)
  const carStateRef = useRef({
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    speed: 0,
  });
  const bullets = useBulletStore((state) => state.bullets);

  const objects = useObjectStore((state) => state.objects);
  const addObject = useObjectStore((state) => state.addObject);

  const activePortfolioItemId = usePortfolioPanelStore((state) => state.activePortfolioItemId);
  const clearactivePortfolioItemId = usePortfolioPanelStore((state) => state.clearactivePortfolioItemId);

  // Spawn breakable portfolio objects with unique IDs
  useEffect(() => {
    if (objects.length > 0) return; // prevent double-spawn on hot reload
    addObject([-8, 0, -18], [1, 1, 1], 4, nanoid(), "project1");
    addObject([8, 0, -22], [1, 1, 1], 4, nanoid(), "skill1");
    addObject([-14, 0, -8], [1, 1, 1], 3, nanoid(), "experience1");
    addObject([14, 0, -8], [1, 1, 1], 3, nanoid(), "contact");
    addObject([0, 0, -30], [1, 1, 1], 5, nanoid(), "project2");
    addObject([0, 0, -12], [1, 1, 1], 3, nanoid(), "skill2");
  }, [addObject]);

  const map = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.shoot, keys: ["Space"] },
  ], []);

  const activeContent = useMemo(() => {
    if (!activePortfolioItemId) return null;
    const allItems = {
      contact: portfolioData.contact,
      ...portfolioData.projects.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
      ...portfolioData.skills.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
      ...portfolioData.experience.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
    };
    return allItems[activePortfolioItemId];
  }, [activePortfolioItemId]);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#1a0a00" }}>
      <KeyboardControls map={map}>
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 8, 18], fov: 70, near: 0.1, far: 500 }}
          dpr={[1, 1.5]}
        >
          {/* Warm sunset ambient */}
          <ambientLight intensity={0.55} color="#ffcc88" />

          {/* Key directional light (sun) */}
          <directionalLight
            position={[30, 25, 10]}
            intensity={2.2}
            color="#ffddaa"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={120}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
          />

          {/* Fill light from opposite side */}
          <directionalLight position={[-20, 10, -20]} intensity={0.4} color="#aaccff" />

          {/* Atmospheric fog */}
          <fog attach="fog" args={["#f0c060", 60, 200]} />

          <RapierPhysics gravity={[0, -18, 0]}>
            <Suspense fallback={<Html center><div style={{ color: "white", fontSize: 24 }}>Loading 3D Scene...</div></Html>}>
              <Desert />
              <BoundaryWalls />
              <Car ref={carRef} carStateRef={carStateRef} />
              {bullets.map((bullet) => (
                <Bullet
                  key={bullet.id}
                  id={bullet.id}
                  position={bullet.position}
                  velocity={bullet.velocity}
                />
              ))}
              <BreakableObjects />
              <PositionalAudio url="/audio/desert_wind_loop.mp3" loop autoplay distance={100} />
            </Suspense>
          </RapierPhysics>

          <SandTrail carStateRef={carStateRef} />
          <Scene carRef={carRef} />
        </Canvas>
      </KeyboardControls>
      <PortfolioPanel content={activeContent} onClose={clearactivePortfolioItemId} />
      <PauseSystem />
      <IntroOverlay />
      <HealthBarHUD />
    </div>
  );
}

export default App;
