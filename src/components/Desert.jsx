import React, { memo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

const Desert = memo((props) => {
  const [basecolor, normalMap, heightMap] = useTexture([
    "/textures/sand_basecolor.png",
    "/textures/sand_normal.png",
    "/textures/sand_height.png",
  ]);

  // Repeat the textures
  [basecolor, normalMap, heightMap].forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
  });

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid" {...props}>
        <mesh receiveShadow>
          <planeGeometry args={[100, 100, 128, 128]} />
          <meshStandardMaterial
            map={basecolor}
            normalMap={normalMap}
            displacementMap={heightMap}
            displacementScale={2}
            flatShading={false}
          />
        </mesh>
      </RigidBody>
      <Sky sunPosition={[100, 20, 100]} />
    </>
  );
});

export default Desert;
