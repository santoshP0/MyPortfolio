import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const JUMP_FORCE = 5;
const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 3;

export function Player() {
  const body = useRef();
  const [subscribe, get] = useKeyboardControls();
  const rapier = useRapier();

  useFrame((state, delta) => {
    if (!body.current) return;

    const { forward, backward, left, right, jump } = get();
    
    // Jump
    const rapierWorld = rapier.world;
    const ray = rapierWorld.castRay(new rapier.Ray(body.current.translation(), { x: 0, y: -1, z: 0 }));
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.25;

    if (jump && grounded) {
        body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }
    
    // Movement
    const velocity = body.current.linvel();
    const direction = new THREE.Vector3();
    
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVEMENT_SPEED)
      .applyEuler(state.camera.rotation);
      
    body.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z
    }, true);

  });

  return (
    <RigidBody ref={body} type="dynamic" colliders={false} mass={1} position={[0, 1, 0]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
