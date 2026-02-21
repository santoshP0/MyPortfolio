import React, { useRef, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useBulletStore } from "../store/useBulletStore";

function Bullet(props) {
  const rigidBodyRef = useRef();
  const removeBullet = useBulletStore((state) => state.removeBullet);

  useEffect(() => {
    if (rigidBodyRef.current && props.velocity) {
      rigidBodyRef.current.setLinvel({ x: props.velocity[0], y: props.velocity[1], z: props.velocity[2] }, true);
    }
  }, [props.velocity]);

  const handleCollisionEnter = ({ other }) => {
    console.log("Bullet collided with:", other.rigidBodyObject.name);
    // For now, remove the bullet on any collision
    removeBullet(props.id);
  };

  useFrame(() => {
    // Optional: Add logic for bullet lifetime or specific movement
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders="ball" type="dynamic" onCollisionEnter={handleCollisionEnter} {...props}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>
  );
}

export default Bullet;
