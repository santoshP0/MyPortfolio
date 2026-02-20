import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { CuboidCollider } from '@react-three/rapier';

function Ground() {
  return (
    <RigidBody type="fixed">
      <CuboidCollider args={[100, 0.5, 100]} position={[0, -0.5, 0]} />
    </RigidBody>
  );
}

export default Ground;
