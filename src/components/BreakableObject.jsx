import React, { useRef, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useObjectStore } from "../store/useObjectStore";
import { usePortfolioPanelStore } from "../store/usePortfolioPanelStore"; // Import usePortfolioPanelStore
import { PositionalAudio } from "@react-three/drei"; // Import PositionalAudio

function BreakableObject({ id, position, args, health: initialHealth = 10, portfolioItemId, ...props }) {
  const rigidBodyRef = useRef();
  const updateObjectHealth = useObjectStore((state) => state.updateObjectHealth);
  const removeObject = useObjectStore((state) => state.removeObject);
  const setactivePortfolioItemId = usePortfolioPanelStore((state) => state.setactivePortfolioItemId);

  const [currentHealth, setCurrentHealth] = useState(initialHealth);
  const explosionAudioRef = useRef(); // Ref for explosion audio

  useFrame(() => {
    // Optional: Add any animation or behavior for the object
  });

  const handleCollisionEnter = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.userData && other.rigidBodyObject.userData.type === "bullet") {
      setCurrentHealth((prevHealth) => {
        const newHealth = prevHealth - 1;
        updateObjectHealth(id, newHealth);
        console.log(`Object ${id} hit! Health: ${newHealth}`);
        if (newHealth <= 0) {
          removeObject(id);
          console.log(`Object ${id} destroyed!`);
          explosionAudioRef.current.play(); // Play explosion sound
          if (portfolioItemId) {
            setactivePortfolioItemId(portfolioItemId); // Set active portfolio item
          }
        }
        return newHealth;
      });
    }
  };

  const materialColor = currentHealth > initialHealth / 2 ? "green" : currentHealth > 0 ? "orange" : "black";

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      type="fixed"
      onCollisionEnter={handleCollisionEnter}
      userData={{ id, type: "breakable", portfolioItemId }}
      position={position}
      {...props}
    >
      <mesh castShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <PositionalAudio ref={explosionAudioRef} url="/audio/explosion.mp3" /> {/* Explosion sound */}
    </RigidBody>
  );
}

export default BreakableObject;
