import React, { useState } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import { PointerLockControls, Box } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import * as THREE from "three";
import Ground from "./Ground";
import { Player } from "./Player";
import HitMarker from "./HitMarker";

const Scene = () => {
  const { camera } = useThree();
  const { world } = useRapier();
  const [hitMarkers, setHitMarkers] = useState([]);

  const removeHitMarker = (id) => {
    setHitMarkers((prev) => prev.filter((marker) => marker.id !== id));
  };

  const handleShoot = () => {
    const ray = new THREE.Ray(
      camera.position,
      camera.getWorldDirection(new THREE.Vector3())
    );
    const hit = world.castRay(ray, 100, true, undefined, undefined, undefined, undefined);
    if (hit) {
      const point = ray.getPoint(hit.toi);
      const newMarker = { id: Date.now(), position: point };
      setHitMarkers((prev) => [...prev, newMarker]);
    }
  };
  
  return (
    <>
      <Physics debug>
        {hitMarkers.map((marker) => (
            <HitMarker
                key={marker.id}
                position={marker.position}
                onFade={() => removeHitMarker(marker.id)}
            />
        ))}
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
      <PointerLockControls onLock={() => {
          document.addEventListener('click', handleShoot)
      }} onUnlock={() => {
          document.removeEventListener('click', handleShoot)
      }}/>
    </>
  );
};

export default Scene;
