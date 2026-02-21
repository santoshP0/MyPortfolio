import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const JUMP_FORCE = 5;
const MOVEMENT_SPEED = 5;
// const ROTATION_SPEED = 3; // Not used

export function Player({ onShoot }) {
  const body = useRef();
  const [subscribe, get] = useKeyboardControls();
  const rapier = useRapier();
  const { camera, scene } = useThree(); // Get camera and scene from useThree

  // Raycaster for shooting
  const raycaster = new THREE.Raycaster();

  useEffect(() => {
    const handleShoot = (event) => {
      // Check if the primary mouse button was clicked
      if (event.button === 0) {
        // Set raycaster from camera
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

        const hits = rapier.world.castRay(
          new rapier.Ray(raycaster.ray.origin, raycaster.ray.direction),
          100 // Max distance for raycast
        );

        if (hits && hits.collider) {
          // console.log("Hit:", hits.collider.userData);
          onShoot(hits); // Pass the entire hit object
        }
      }
    };

    window.addEventListener("click", handleShoot);

    return () => {
      window.removeEventListener("click", handleShoot);
    };
  }, [camera, rapier.world, onShoot]);


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

    // Update camera position to follow the player body
    camera.position.copy(body.current.translation());
    
  });

  return (
    <RigidBody ref={body} type="dynamic" colliders={false} mass={1} position={[0, 1, 0]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
