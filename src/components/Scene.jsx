import React from "react";
import { useFrame } from "@react-three/fiber";
import { useBulletStore } from "../store/useBulletStore";

function Scene({ carRef, controlsRef }) {
  const bullets = useBulletStore((state) => state.bullets);
  const removeBullet = useBulletStore((state) => state.removeBullet);

  useFrame(() => {
    // Bullet lifecycle management
    bullets.forEach((bullet) => {
      if (Date.now() - bullet.timestamp > 3000) {
        // Remove bullet after 3 seconds
        removeBullet(bullet.id);
      }
    });
  });

  return null; // This component does not render anything itself
}

export default Scene;
