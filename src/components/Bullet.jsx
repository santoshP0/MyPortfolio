import React, { useRef, useEffect, memo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useBulletStore } from "../store/useBulletStore";
import { useObjectStore } from "../store/useObjectStore";
import { useTargetedObjectStore } from "../store/useTargetedObjectStore";

const Bullet = memo(({ id, position, velocity }) => {
  const rigidBodyRef = useRef();
  const removeBullet = useBulletStore((s) => s.removeBullet);
  const updateHealth = useObjectStore((s) => s.updateObjectHealth);
  const revealObject = useObjectStore((s) => s.revealObject);
  const setTargeted = useTargetedObjectStore((s) => s.setTargetedObject);

  useEffect(() => {
    if (!rigidBodyRef.current || !velocity) return;
    rigidBodyRef.current.setLinvel({ x: velocity[0], y: velocity[1], z: velocity[2] }, true);
    const t = setTimeout(() => removeBullet(id), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleCollisionEnter = ({ other }) => {
    const ud = other.rigidBodyObject?.userData || other.rigidBody?.userData || {};

    if (ud.type === "breakable") {
      const obj = useObjectStore.getState().objects.find((o) => o.id === ud.id);
      if (obj && obj.health > 0) {
        const newHealth = obj.health - 1;
        updateHealth(ud.id, newHealth);
        setTargeted(ud.id, newHealth, obj.initialHealth);

        if (newHealth <= 0) {
          // Mark as revealed — a permanent panel will appear at its position
          // No pointer lock change, no pause triggered
          revealObject(ud.id);
        }
      }
    }

    removeBullet(id);
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="ball"
      type="dynamic"
      gravityScale={0.2}
      restitution={0.1}
      onCollisionEnter={handleCollisionEnter}
      userData={{ type: "bullet" }}
      position={position}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffdd00"
          emissive="#ff8800"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </RigidBody>
  );
});

Bullet.displayName = "Bullet";
export default Bullet;
