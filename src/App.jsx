import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, KeyboardControls, PositionalAudio } from "@react-three/drei";
import { Physics as RapierPhysics } from "@react-three/rapier";
import Car from "./components/Car";
import Desert from "./components/Desert";
import Bullet from "./components/Bullet";
import InstancedBreakableObjects from "./components/InstancedBreakableObjects"; // Import InstancedBreakableObjects
import PortfolioPanel from "./components/PortfolioPanel";
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

function App() {
  const carRef = useRef();
  const controlsRef = useRef();
  const bullets = useBulletStore((state) => state.bullets);
  const removeBullet = useBulletStore((state) => state.removeBullet);

  const objects = useObjectStore((state) => state.objects);
  const addObject = useObjectStore((state) => state.addObject);

  const activePortfolioItemId = usePortfolioPanelStore((state) => state.activePortfolioItemId);
  const clearactivePortfolioItemId = usePortfolioPanelStore((state) => state.clearactivePortfolioItemId);

  // Initialize some breakable objects with portfolio data - moved to InstancedBreakableObjects
  useEffect(() => {
    // This useEffect will now be responsible for initial setup or
    // any logic that creates the initial set of objects for the instanced component.
    // For demonstration, I will keep the addObject calls here, but ideally they
    // would be handled within InstancedBreakableObjects or a separate setup function.
    addObject([-5, 0, -10], [1, 1, 1], 3, nanoid(), "project1");
    addObject([5, 0, -15], [1.5, 1.5, 1.5], 5, nanoid(), "skill1");
    addObject([-10, 0, -5], [1, 2, 1], 4, nanoid(), "experience1");
    addObject([10, 0, -5], [0.8, 0.8, 0.8], 2, nanoid(), "contact");
  }, [addObject]);


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

    bullets.forEach((bullet) => {
      if (Date.now() - bullet.timestamp > 3000) {
        removeBullet(bullet.id);
      }
    });
  });

  const getPortfolioItemContent = (id) => {
    if (!id) return null;
    const allItems = {
      ...portfolioData.contact,
      ...portfolioData.projects.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
      ...portfolioData.skills.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
      ...portfolioData.experience.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
    };
    return allItems[id];
  };

  const activeContent = getPortfolioItemContent(activePortfolioItemId);

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
              <Bullet
                key={bullet.id}
                id={bullet.id}
                position={bullet.position}
                velocity={bullet.velocity}
              />
            ))}
            {/* Render InstancedBreakableObjects instead of individual BreakableObject components */}
            <InstancedBreakableObjects />
            {/* Ambient desert wind audio */}
            <PositionalAudio url="/audio/desert_wind_loop.mp3" loop autoplay />
          </RapierPhysics>
          <OrbitControls ref={controlsRef} />
        </Canvas>
      </KeyboardControls>
      <PortfolioPanel content={activeContent} onClose={clearactivePortfolioItemId} />
    </div>
  );
}

export default App;
