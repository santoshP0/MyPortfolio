import React, { memo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const Desert = memo((props) => {
  const [basecolor] = useTexture([
    "/textures/sand_basecolor.png",
  ]);

  // Repeat the textures
  basecolor.wrapS = basecolor.wrapT = THREE.RepeatWrapping;
  basecolor.repeat.set(10, 10);

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid" {...props}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            map={basecolor}
          />
        </mesh>
      </RigidBody>
      <Sky sunPosition={[100, 20, 100]} />
    </>
  );
});

export default Desert;
