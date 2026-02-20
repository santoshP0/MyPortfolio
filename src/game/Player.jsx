import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const SPEED = 5;
const JUMP_FORCE = 6;

export function Player() {
  const ref = useRef();
  const [subscribe, get] = useKeyboardControls();
  const grounded = useRef(true);

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = get();
    const velocity = ref.current.linvel();

    // movement
    const frontVector = new THREE.Vector3(0, 0, backward - forward);
    const sideVector = new THREE.Vector3(left - right, 0, 0);
    const direction = new THREE.Vector3();
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);

    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // jumping
    const world = ref.current.parent;
    const origin = ref.current.translation();
    const ray = new THREE.Raycaster(new THREE.Vector3(origin.x, origin.y, origin.z), new THREE.Vector3(0, -1, 0));
    const intersection = ray.intersectObject(world);

    if (intersection && intersection.distance < 1.1) {
        grounded.current = true;
    }

    if (jump && grounded.current) {
      ref.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
      grounded.current = false;
    }
  });

  return (
    <RigidBody ref={ref} type="dynamic" colliders={false} mass={1} enabledRotations={[false, false, false]} position={[0, 1, 0]}>
      <CapsuleCollider args={[0.5, 0.5]} />
    </RigidBody>
  );
}
