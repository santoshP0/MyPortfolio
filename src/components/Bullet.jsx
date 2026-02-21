import React, { useRef, useEffect, memo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useBulletStore } from "../store/useBulletStore";
import { useObjectStore } from "../store/useObjectStore";

const Bullet = memo((props) => {
  const rigidBodyRef = useRef();
  const removeBullet = useBulletStore((state) => state.removeBullet);
  const updateObjectHealth = useObjectStore((state) => state.updateObjectHealth);
  const removeObject = useObjectStore((state) => state.removeObject);

  useEffect(() => {
    if (rigidBodyRef.current && props.velocity) {
      rigidBodyRef.current.setLinvel({ x: props.velocity[0], y: props.velocity[1], z: props.velocity[2] }, true);
    }
  }, [props.velocity]);

  const handleCollisionEnter = ({ other }) => {
    // console.log("Bullet collided with:", other);

    if (other.rigidBody && other.rigidBody.userData && other.rigidBody.userData.type === "breakable") {
      const targetObjectId = other.rigidBody.userData.id;

      if (targetObjectId) {
        const currentObject = useObjectStore.getState().objects.find(obj => obj.id === targetObjectId);
        if (currentObject) {
          const newHealth = currentObject.health - 1;
          updateObjectHealth(targetObjectId, newHealth);
          if (newHealth <= 0) {
            removeObject(targetObjectId);
          }
        }
      } else {
          console.warn("Could not identify breakable object in collision:", other);
      }
    }
    // Always remove the bullet after any collision
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
