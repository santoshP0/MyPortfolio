import React from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[1000, 1, 1000]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <CuboidCollider args={[500, 0.5, 500]} position={[0, -0.5, 0]} />
    </RigidBody>
  );
};

export default Ground;
