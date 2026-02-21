import React from "react";
import { RigidBody } from "@react-three/rapier";

/**
 * A single breakable object with its own RigidBody.
 * type="dynamic" so the car can push them around like plastic boxes.
 * High mass + damping so they feel heavy but still moveable.
 */
function BreakableObject({ id, position, health, initialHealth, portfolioItemId, type = "stone" }) {
  if (health <= 0) return null;

  const healthRatio = health / initialHealth;

  let color;
  if (healthRatio > 0.65) color = "#6B4226";
  else if (healthRatio > 0.3) color = "#C46A00";
  else color = "#8B0000";

  const geometryArgs = {
    stone: [1.5, 2.2, 1.5],
    crate: [1.2, 1.2, 1.2],
    board: [2.5, 1.5, 0.3],
    tower: [0.8, 3.5, 0.8],
  };
  const args = geometryArgs[type] || geometryArgs.stone;

  return (
    <RigidBody
      type="dynamic"
      colliders="cuboid"
      position={position}
      mass={8}                // heavy enough to feel solid, light enough to push
      linearDamping={3}       // stops sliding quickly after being hit
      angularDamping={3}      // stops spinning quickly
      restitution={0.1}
      friction={0.9}
      userData={{ type: "breakable", id, portfolioItemId }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={color}
          roughness={0.95}
          metalness={0.05}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Crack overlay */}
      {healthRatio < 0.65 && (
        <mesh position={[0, 0, args[2] / 2 + 0.01]}>
          <planeGeometry args={[args[0], args[1]]} />
          <meshStandardMaterial
            color="#1a0a00"
            transparent
            opacity={1 - healthRatio}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Health ring */}
      <mesh position={[0, args[1] / 2 + 0.5, 0]}>
        <torusGeometry args={[0.4, 0.07, 8, 16, Math.PI * 2 * healthRatio]} />
        <meshStandardMaterial
          color={healthRatio > 0.5 ? "#00ff88" : healthRatio > 0.25 ? "#ffaa00" : "#ff2200"}
          emissive={healthRatio > 0.5 ? "#00ff88" : healthRatio > 0.25 ? "#ffaa00" : "#ff2200"}
          emissiveIntensity={0.8}
        />
      </mesh>
    </RigidBody>
  );
}

export default BreakableObject;
