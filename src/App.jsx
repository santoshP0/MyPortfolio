import React, { useRef, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Html } from "@react-three/drei";
import { Physics as RapierPhysics } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import Car from "./components/Car";
import Desert from "./components/Desert";
import SandTrail from "./components/SandTrail";
import DiscoveryZone from "./components/DiscoveryZone";
import PauseSystem from "./components/PauseSystem";
import IntroOverlay from "./components/IntroOverlay";
import ControlsHUD from "./components/ControlsHUD";
import Scene from "./components/Scene";

import { terrainHeight } from "./utils/terrain";
import "./index.css";

export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
};

// Discovery zone positions [x, z, portfolioId]
const ZONE_DATA = [
  [-10, -20, "project1"],
  [12, -25, "skill1"],
  [-18, -6, "experience1"],
  [18, -6, "contact"],
  [0, -35, "project2"],
  [3, -12, "skill2"],
  [-10, -35, "experience2"],
];

function App() {
  const carRef = useRef();
  const carStateRef = useRef({
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    speed: 0,
  });

  // Zone positions on the terrain surface
  const zones = useMemo(() =>
    ZONE_DATA.map(([x, z, id]) => ({
      id,
      position: [x, terrainHeight(x, z) + 0.1, z],
    }))
    , []);

  const controlMap = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
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
          {/* Lighting (Fill) */}
          <ambientLight intensity={0.4} color="#ffcc88" />

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

              {/* Discovery zones — park nearby to reveal portfolio */}
              {zones.map((z) => (
                <DiscoveryZone
                  key={z.id}
                  id={z.id}
                  position={z.position}
                  carStateRef={carStateRef}
                />
              ))}
            </Suspense>
          </RapierPhysics>

          <SandTrail carStateRef={carStateRef} />
          <Scene carRef={carRef} />

          {/* Post-processing */}
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
          </EffectComposer>
        </Canvas>
      </KeyboardControls>

      {/* 2D HUD */}
      <PauseSystem />
      <IntroOverlay />
      <ControlsHUD />
    </div>
  );
}

export default App;
