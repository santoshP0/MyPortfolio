import React, { memo, useMemo } from "react";
import { useTexture, Sky } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { terrainHeight } from "../utils/terrain";

const TERRAIN_SIZE = 200;
const VISUAL_SEGS = 60;

/**
 * Split approach:
 * - Physics: Flat CuboidCollider at y=0 (100% stable, no fall-through ever)
 * - Visuals: Heightmap mesh (beautiful rolling sand dunes, no physics)
 *
 * Objects are spawned at terrainHeight(x,z) + lift in App.jsx so they
 * appear grounded on the visual terrain.
 */
const Desert = memo(() => {
  const [basecolor] = useTexture(["/textures/sand_basecolor.png"]);
  basecolor.wrapS = basecolor.wrapT = THREE.RepeatWrapping;
  basecolor.repeat.set(30, 30);

  // High-res visual mesh — no physics attached
  const visualGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, VISUAL_SEGS, VISUAL_SEGS);
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
      {/* ── Stable flat physics floor ── */}
      {/* CuboidCollider is the most reliable ground collider in Rapier.
          Half-extents [100, 0.5, 100] = 200×1×200 solid box.
          Top face at y = 0, which is approx the average terrain height. */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <CuboidCollider args={[100, 0.5, 100]} />
      </RigidBody>

      {/* ── Visual rolling terrain (purely decorative) ── */}
      <mesh receiveShadow geometry={visualGeo}>
        <meshStandardMaterial map={basecolor} color="#c49a50" roughness={1} metalness={0} />
      </mesh>

      {/* ── Sunset sky ── */}
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
