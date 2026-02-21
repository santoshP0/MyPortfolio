import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Html } from "@react-three/drei";
import { Physics as RapierPhysics } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import Car from "./components/Car";
import Desert from "./components/Desert";
import Bullet from "./components/Bullet";
import BreakableObjects from "./components/BreakableObjects";
import SandTrail from "./components/SandTrail";
import RevealedPanels from "./components/RevealedPanels";
import PauseSystem from "./components/PauseSystem";
import IntroOverlay from "./components/IntroOverlay";
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

// Objects spawn 3 units above terrain, gravity settles them
const spawnY = (x, z) => terrainHeight(x, z) + 3;

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
  const carStateRef = useRef({
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    speed: 0,
  });

  const bullets = useBulletStore((s) => s.bullets);
  const objects = useObjectStore((s) => s.objects);
  const addObject = useObjectStore((s) => s.addObject);

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

          {/* Atmospheric fog */}
          <fog attach="fog" args={["#f0c060", 70, 220]} />

          <RapierPhysics gravity={[0, -20, 0]}>
            <Suspense fallback={
              <Html center>
                <div style={{ color: "white", fontSize: 22, fontFamily: "sans-serif" }}>
                  Loading Desert…
                </div>
              </Html>
            }>
              <Desert />
              <Car ref={carRef} carStateRef={carStateRef} />
              {bullets.map((b) => (
                <Bullet key={b.id} id={b.id} position={b.position} velocity={b.velocity} />
              ))}
              <BreakableObjects />
              <RevealedPanels />
            </Suspense>
          </RapierPhysics>

          <SandTrail carStateRef={carStateRef} />
          <Scene carRef={carRef} />

          {/* ── Post-processing: subtle bloom + vignette ── */}
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
            <Vignette
              offset={0.25}
              darkness={0.55}
              blendFunction={BlendFunction.NORMAL}
            />
            <ChromaticAberration
              offset={new THREE.Vector2(0.0006, 0.0006)}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Canvas>
      </KeyboardControls>

      {/* ── Crosshair overlay ── */}
      <div className="crosshair-overlay">
        <div className="crosshair-dot" />
      </div>

      {/* ── 2D HUD ── */}
      <PauseSystem />
      <IntroOverlay />
      <ControlsHUD />
    </div>
  );
}

export default App;
