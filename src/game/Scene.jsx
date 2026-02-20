import React from "react";
import { Physics } from "@react-three/rapier";
import { PointerLockControls } from "@react-three/drei";
import Ground from "./Ground";
import { Player } from "./Player";

const Scene = () => {
  return (
    <>
      <Physics debug>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Player />
        <Ground />
        {/* Walls */}
        <RigidBody type="fixed">
          <Box position={[0, 10, -10]} args={[20, 20, 0.5]}>
            <meshStandardMaterial color="white" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box position={[0, 10, 10]} args={[20, 20, 0.5]}>
            <meshStandardMaterial color="white" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box position={[-10, 10, 0]} args={[0.5, 20, 20]}>
            <meshStandardMaterial color="white" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box position={[10, 10, 0]} args={[0.5, 20, 20]}>
            <meshStandardMaterial color="white" />
          </Box>
        </RigidBody>
      </Physics>
      <PointerLockControls />
    </>
  );
};

export default Scene;
