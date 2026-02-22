import React, { memo, useMemo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { terrainHeight } from "../utils/terrain";
import EnvironmentClutter from "./EnvironmentClutter";

const TERRAIN_SIZE = 200;
const SEGMENTS = 30;

const Desert = memo(() => {
  const [basecolor] = useTexture(["/textures/sand_basecolor.png"]);
  basecolor.wrapS = basecolor.wrapT = THREE.RepeatWrapping;
  basecolor.repeat.set(25, 25);

  const terrainGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position.array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] = terrainHeight(pos[i * 3], pos[i * 3 + 2]);
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <>
      {/* Ancient ruins clutter */}
      <EnvironmentClutter />

      <RigidBody type="fixed" colliders="trimesh">
        <mesh receiveShadow geometry={terrainGeo}>
          <meshStandardMaterial
            map={basecolor}
            color="#c49a50"
            roughness={1}
            metalness={0}
          />
        </mesh>
      </RigidBody>

      <Sky
        sunPosition={[120, 4, -40]} // Very low sun for dramatic long shadows (Golden Hour)
        rayleigh={6}
        turbidity={8}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.5}
        azimuth={0.25}
      />

      {/* Primary Sun Light */}
      <directionalLight
        position={[40, 40, 20]} // Higher angle for better car shadow visibility
        intensity={2.8}
        color="#ffaa66"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
      />
    </>
  );
});

export default Desert;
