import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { Mesh } from "three";

export function Player() {
  return (
    <RigidBody type="dynamic" colliders={false} mass={1} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.5, 0.5]} />
    </RigidBody>
  );
}
