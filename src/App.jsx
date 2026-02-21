import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Html } from "@react-three/drei";
import { Physics as RapierPhysics } from "@react-three/rapier";
import * as THREE from "three";

import Car from "./components/Car";
import Desert from "./components/Desert";
import Bullet from "./components/Bullet";
import BreakableObjects from "./components/BreakableObjects";
import SandTrail from "./components/SandTrail";
import RevealedPanels from "./components/RevealedPanels";
import PauseSystem from "./components/PauseSystem";
import IntroOverlay from "./components/IntroOverlay";
import HealthBarHUD from "./components/HealthBarHUD";
import ControlsHUD from "./components/ControlsHUD";
import Scene from "./components/Scene";

import { useBulletStore } from "./store/useBulletStore";
import { useObjectStore } from "./store/useObjectStore";
import { nanoid } from "nanoid";
import { terrainHeight } from "./utils/terrain";
import "./index.css";

export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  shoot: "shoot",
};

// Objects spawn slightly above terrain, gravity drops them to the surface
const spawnY = (x, z) => terrainHeight(x, z) + 3;

// Object spawn data [x, z, health, portfolioId]
const OBJECT_SPAWNS = [
  [-8, -18, 4, "project1"],
  [8, -22, 4, "skill1"],
  [-14, -8, 3, "experience1"],
  [14, -8, 3, "contact"],
  [0, -30, 5, "project2"],
  [0, -12, 3, "skill2"],
];

function App() {
  const carRef = useRef();

  // Plain JS ref written by Car.jsx each frame — read by SandTrail (safe, no Rapier calls)
  const carStateRef = useRef({
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    speed: 0,
  });

  const bullets = useBulletStore((s) => s.bullets);
  const objects = useObjectStore((s) => s.objects);
  const addObject = useObjectStore((s) => s.addObject);

  // Spawn portfolio objects at the correct terrain height
  useEffect(() => {
    if (objects.length > 0) return;
    OBJECT_SPAWNS.forEach(([x, z, hp, pid]) => {
      addObject([x, spawnY(x, z), z], [1, 1, 1], hp, nanoid(), pid);
    });
  }, [addObject]);

  const controlMap = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.shoot, keys: ["Space"] },
  ], []);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#1a0a00" }}>
      <KeyboardControls map={controlMap}>
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 10, 20], fov: 70, near: 0.1, far: 600 }}
          dpr={[1, 1.5]}
        >
          {/* Lighting */}
          <ambientLight intensity={0.55} color="#ffcc88" />
          <directionalLight
            position={[30, 25, 10]}
            intensity={2.2}
            color="#ffddaa"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={150}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
          />
          <directionalLight position={[-20, 10, -20]} intensity={0.4} color="#aaccff" />

          {/* Atmospheric fog makes boundary invisible */}
          <fog attach="fog" args={["#f0c060", 70, 220]} />

          <RapierPhysics gravity={[0, -20, 0]}>
            <Suspense fallback={
              <Html center>
                <div style={{ color: "white", fontSize: 22, fontFamily: "sans-serif" }}>
                  Loading Desert…
                </div>
              </Html>
            }>
              {/* Terrain with trimesh physics */}
              <Desert />

              {/* Car spawns high — gravity drops it onto terrain */}
              <Car ref={carRef} carStateRef={carStateRef} />

              {/* Bullets */}
              {bullets.map((b) => (
                <Bullet key={b.id} id={b.id} position={b.position} velocity={b.velocity} />
              ))}

              {/* Breakable targets */}
              <BreakableObjects />

              {/* Permanent in-world panels for destroyed targets */}
              <RevealedPanels />
            </Suspense>
          </RapierPhysics>

          {/* Sand trail particles (outside physics, reads carStateRef) */}
          <SandTrail carStateRef={carStateRef} />
          <Scene carRef={carRef} />
        </Canvas>
      </KeyboardControls>

      {/* 2D HUD overlays */}
      <PauseSystem />
      <IntroOverlay />
      <HealthBarHUD />
      <ControlsHUD />
    </div>
  );
}

export default App;
