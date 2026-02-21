import React, { memo, useMemo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { terrainHeight } from "../utils/terrain";

const TERRAIN_SIZE = 200;
const SEGMENTS = 30;  // 30×30 = stable for trimesh, looks good visually

/**
 * ONE mesh = visual terrain + physics collider.
 * The mesh is VISIBLE — that's the key. Rapier can only extract
 * geometry from visible meshes (visible={false} breaks trimesh).
 */
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
      {/* Single visible mesh = physics + visuals */}
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

export default Desert;
