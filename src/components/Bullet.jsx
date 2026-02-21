import React, { useRef, useEffect, memo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useBulletStore } from "../store/useBulletStore";
import { useObjectStore } from "../store/useObjectStore";
import { useTargetedObjectStore } from "../store/useTargetedObjectStore"; // Import useTargetedObjectStore

const Bullet = memo((props) => {
  const rigidBodyRef = useRef();
  const removeBullet = useBulletStore((state) => state.removeBullet);
  const updateObjectHealth = useObjectStore((state) => state.updateObjectHealth);
  const removeObject = useObjectStore((state) => state.removeObject);
  const setTargetedObject = useTargetedObjectStore((state) => state.setTargetedObject);

  useEffect(() => {
    if (rigidBodyRef.current && props.velocity) {
      rigidBodyRef.current.setLinvel({ x: props.velocity[0], y: props.velocity[1], z: props.velocity[2] }, true);
    }
  }, [props.velocity]);

  const handleCollisionEnter = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.userData && other.rigidBodyObject.userData.type === "breakable") {
      const targetObjectId = other.rigidBodyObject.userData.id;
      const portfolioItemId = other.rigidBodyObject.userData.portfolioItemId;

      if (targetObjectId) {
        const currentObject = useObjectStore.getState().objects.find(obj => obj.id === targetObjectId);
        if (currentObject && currentObject.health > 0) {
          const newHealth = currentObject.health - 1;
          updateObjectHealth(targetObjectId, newHealth);
          setTargetedObject(targetObjectId, newHealth, currentObject.initialHealth);

          if (newHealth <= 0) {
            // Reveal portfolio content
            if (portfolioItemId) {
              usePortfolioPanelStore.getState().setActivePortfolioItemId(portfolioItemId);
            }
          }
        }
      }
    }
    removeBullet(props.id);
  };

  useFrame(() => {
    // Optional: Add logic for bullet lifetime or specific movement
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders="ball" type="dynamic" onCollisionEnter={handleCollisionEnter} userData={{ type: "bullet" }} {...props}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>
  );
});

export default Bullet;
