import React from "react";
import { useTexture, Sky } from "@react-three/drei";
import { usePlane } from "@react-three/rapier";
import * as THREE from "three";

function Desert(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const texture = useTexture("/textures/sand.jpg"); // Placeholder texture

  // Repeat the texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  return (
    <>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Sky sunPosition={[100, 20, 100]} />
    </>
  );
}

export default Desert;
