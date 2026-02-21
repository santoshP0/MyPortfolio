import React, { memo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const Desert = memo(() => {
  const [basecolor] = useTexture(["/textures/sand_basecolor.png"]);

  basecolor.wrapS = basecolor.wrapT = THREE.RepeatWrapping;
  basecolor.repeat.set(20, 20);

  return (
    <>
      {/* Physical ground — a thin box slab at y=0 so Rapier has real volume to collide against */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100, 1, 1]} />
          <meshStandardMaterial
            map={basecolor}
            color="#c8a060"
            roughness={1}
            metalness={0}
          />
        </mesh>
      </RigidBody>

      {/* A few dunes as gentle hills for visual depth */}
      <Dunes />

      {/* Warm Thar-desert sunset skybox */}
      <Sky
        sunPosition={[80, 12, -60]}
        rayleigh={3}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49}
        azimuth={0.25}
      />
    </>
  );
});

// A handful of static sand dunes for visual richness (no physics needed for dunes)
function Dunes() {
  const dunes = [
    { pos: [-28, 0, -35], rx: -0.1, scale: [14, 4, 8] },
    { pos: [30, 0, -28], rx: -0.1, scale: [10, 3, 7] },
    { pos: [-20, 0, 20], rx: -0.1, scale: [12, 3.5, 9] },
    { pos: [35, 0, 15], rx: -0.1, scale: [9, 2.5, 6] },
    { pos: [5, 0, -42], rx: -0.1, scale: [16, 3, 10] },
  ];

  return (
    <>
      {dunes.map((d, i) => (
        <mesh
          key={i}
          position={[d.pos[0], d.pos[1] + d.scale[1] * 0.45, d.pos[2]]}
          rotation={[d.rx, Math.random() * Math.PI, 0]}
          receiveShadow
          castShadow
        >
          <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#c09050" roughness={1} metalness={0} />
          <primitive
            object={new THREE.Mesh()}
            scale={d.scale}
          />
        </mesh>
      ))}
    </>
  );
}

export default Desert;
