import React from "react";
import { useFrame } from "@react-three/fiber";
import { useBulletStore } from "../store/useBulletStore";

function Scene({ carRef, controlsRef }) {
  const bullets = useBulletStore((state) => state.bullets);
  const removeBullet = useBulletStore((state) => state.removeBullet);

  useFrame(() => {
    if (carRef.current && controlsRef.current) {
      const rigidBody = carRef.current;
      // Ensure rigidBody and its translation method are available
      if (rigidBody && typeof rigidBody.translation === "function") {
        try {
          const carPosition = rigidBody.translation();
          controlsRef.current.target.lerp(carPosition, 0.1);
          controlsRef.current.update();
        } catch (error) {
          // In case of any other error within translation()
          console.error("Error getting car translation:", error);
        }
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

  return null; // This component does not render anything itself
}

export default Scene;
