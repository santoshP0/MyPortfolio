import React, { useRef, useEffect, memo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useBulletStore } from "../store/useBulletStore";
import { useObjectStore } from "../store/useObjectStore";
import { useTargetedObjectStore } from "../store/useTargetedObjectStore";
import { usePortfolioPanelStore } from "../store/usePortfolioPanelStore";

const Bullet = memo(({ id, position, velocity }) => {
  const rigidBodyRef = useRef();
  const removeBullet = useBulletStore((state) => state.removeBullet);
  const updateObjectHealth = useObjectStore((state) => state.updateObjectHealth);
  const setTargetedObject = useTargetedObjectStore((state) => state.setTargetedObject);

  // Apply velocity once mounted
  useEffect(() => {
    if (!rigidBodyRef.current || !velocity) return;
    rigidBodyRef.current.setLinvel(
      { x: velocity[0], y: velocity[1], z: velocity[2] },
      true
    );
    // Auto-remove bullet after 3 seconds to avoid memory leak
    const timer = setTimeout(() => removeBullet(id), 3000);
    return () => clearTimeout(timer);
  }, []); // run once on mount

  const handleCollisionEnter = ({ other }) => {
    // userData can be on the rigidBodyObject (Three.js) or on the Rapier body
    const userData =
      other.rigidBodyObject?.userData ||
      other.rigidBody?.userData ||
      {};

    if (userData.type === "breakable") {
      const targetId = userData.id;
      const portfolioItemId = userData.portfolioItemId;

      if (targetId) {
        const currentObject = useObjectStore.getState().objects.find(
          (obj) => obj.id === targetId
        );
        if (currentObject && currentObject.health > 0) {
          const newHealth = currentObject.health - 1;
          updateObjectHealth(targetId, newHealth);
          setTargetedObject(targetId, newHealth, currentObject.initialHealth);

          if (newHealth <= 0 && portfolioItemId) {
            // Unlock pointer so user can interact with the panel
            if (document.pointerLockElement) document.exitPointerLock();
            usePortfolioPanelStore.getState().setActivePortfolioItemId(portfolioItemId);
          }
        }
      }
    }

    removeBullet(id);
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="ball"
      type="dynamic"
      gravityScale={0.3}
      restitution={0.2}
      onCollisionEnter={handleCollisionEnter}
      userData={{ type: "bullet" }}
      position={position}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffdd00"
          emissive="#ff8800"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </RigidBody>
  );
});

Bullet.displayName = "Bullet";
export default Bullet;
