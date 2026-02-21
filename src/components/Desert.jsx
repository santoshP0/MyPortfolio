import React, { memo, useMemo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const Desert = memo(() => {
  const [basecolor] = useTexture(["/textures/sand_basecolor.png"]);
  basecolor.wrapS = basecolor.wrapT = THREE.RepeatWrapping;
  basecolor.repeat.set(20, 20);

  return (
    <>
      {/* Ground plane — flat collider at y=0 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial map={basecolor} color="#c8a060" roughness={1} metalness={0} />
        </mesh>
      </RigidBody>

      <Dunes />

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

// Rotations pre-computed ONCE — using Math.random() inside render causes infinite loops
const DUNE_DATA = [
  { pos: [-28, 0, -35], scale: [14, 4, 8], rot: [0, 0.4, 0] },
  { pos: [30, 0, -28], scale: [10, 3, 7], rot: [0, 1.1, 0] },
  { pos: [-20, 0, 20], scale: [12, 3.5, 9], rot: [0, 2.3, 0] },
  { pos: [35, 0, 15], scale: [9, 2.5, 6], rot: [0, 0.8, 0] },
  { pos: [5, 0, -42], scale: [16, 3, 10], rot: [0, 1.6, 0] },
];

function Dunes() {
  return (
    <>
      {DUNE_DATA.map((d, i) => (
        <mesh
          key={i}
          position={[d.pos[0], d.pos[1] + d.scale[1] * 0.45, d.pos[2]]}
          scale={d.scale}
          rotation={d.rot}
          receiveShadow
          castShadow
        >
          {/* Half-sphere as dune shape */}
          <sphereGeometry args={[1, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#c09050" roughness={1} metalness={0} />
        </mesh>
      ))}
    </>
  );
}

export default Desert;
