import React, { useRef, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useBulletStore } from "../store/useBulletStore";
import { useObjectStore } from "../store/useObjectStore"; // Import useObjectStore

function Bullet(props) {
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
    console.log("Bullet collided with:", other.rigidBodyObject.userData);

    if (other.rigidBodyObject && other.rigidBodyObject.userData && other.rigidBodyObject.userData.type === "breakable") {
      const objectId = other.rigidBodyObject.userData.id;
      const currentObject = useObjectStore.getState().objects.find(obj => obj.id === objectId);

      if (currentObject) {
        const newHealth = currentObject.health - 1;
        updateObjectHealth(objectId, newHealth);
        if (newHealth <= 0) {
          removeObject(objectId);
        }
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
}

export default Bullet;
