import React, { useRef, forwardRef, useImperativeHandle, memo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useBulletStore } from "../store/useBulletStore";

// Preload the car model
useGLTF.preload("/models/car/car.glb");

const CarModel = () => {
  const { scene } = useGLTF("/models/car/car.glb");
  return (
    <primitive
      object={scene}
      scale={[0.5, 0.5, 0.5]}
      // Many GLTF car models face +Z by default; rotate to face -Z (forward in Three.js)
      rotation={[0, Math.PI, 0]}
    />
  );
};

const Car = memo(forwardRef((props, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_, get] = useKeyboardControls();
  const addBullet = useBulletStore((state) => state.addBullet);

  // Physics constants
  const ACCELERATION = 1.8;   // velocity added per frame
  const BRAKE_FORCE = 1.5;    // velocity removed per frame when braking
  const MAX_SPEED = 14;       // m/s max linear speed
  const TURN_SPEED = 2.2;     // angular velocity when turning
  const BULLET_SPEED = 60;    // bullet initial velocity
  const GRAVITY_COMP = 9.8;   // keep car grounded

  const lastShotTime = useRef(0);
  const SHOOT_COOLDOWN = 250; // ms

  const engineAudioRef = useRef();
  const shootAudioRef = useRef();

  useFrame((state, delta) => {
    const { forward, backward, left, right, shoot } = get();

    if (!rigidBodyRef.current) return;

    const vel = rigidBodyRef.current.linvel();
    const rot = rigidBodyRef.current.rotation();
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);

    // Car's forward direction in world space (-Z local → world)
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);

    // ── Speed management ──────────────────────────────────────────
    let speed = new THREE.Vector3(vel.x, 0, vel.z).length();

    // Project current velocity onto car's forward to get signed speed
    const velXZ = new THREE.Vector3(vel.x, 0, vel.z);
    const signedSpeed = velXZ.dot(fwd); // positive = moving forward

    let newVelXZ = velXZ.clone();

    if (forward) {
      newVelXZ.add(fwd.clone().multiplyScalar(ACCELERATION));
    } else if (backward) {
      // Braking if moving forward, reversing if stopped
      if (signedSpeed > 0.1) {
        newVelXZ.add(fwd.clone().multiplyScalar(-BRAKE_FORCE)); // brake
      } else {
        newVelXZ.add(fwd.clone().multiplyScalar(-ACCELERATION * 0.6)); // reverse
      }
    } else {
      // Natural drag on XZ plane only
      newVelXZ.multiplyScalar(0.92);
    }

    // Clamp to max speed
    if (newVelXZ.length() > MAX_SPEED) {
      newVelXZ.normalize().multiplyScalar(MAX_SPEED);
    }

    // Keep Y velocity (gravity falls through), only override XZ
    rigidBodyRef.current.setLinvel(
      { x: newVelXZ.x, y: vel.y, z: newVelXZ.z },
      true
    );

    // ── Turning (only when moving) ────────────────────────────────
    const isMoving = speed > 0.3;
    if (isMoving) {
      if (left) {
        rigidBodyRef.current.setAngvel({ x: 0, y: TURN_SPEED, z: 0 }, true);
      } else if (right) {
        rigidBodyRef.current.setAngvel({ x: 0, y: -TURN_SPEED, z: 0 }, true);
      } else {
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    } else {
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // ── Shooting ─────────────────────────────────────────────────
    const now = Date.now();
    if (shoot && now - lastShotTime.current > SHOOT_COOLDOWN) {
      lastShotTime.current = now;
      const pos = rigidBodyRef.current.translation();

      const bulletPos = new THREE.Vector3(
        pos.x + fwd.x * 2.5,
        pos.y + 0.8,
        pos.z + fwd.z * 2.5
      );
      const bulletVel = fwd.clone().multiplyScalar(BULLET_SPEED);
      addBullet(bulletPos.toArray(), bulletVel.toArray());

      if (shootAudioRef.current) shootAudioRef.current.play();
    }

    // ── Engine audio ──────────────────────────────────────────────
    if (engineAudioRef.current) {
      engineAudioRef.current.setVolume(0.2 + Math.min(speed / MAX_SPEED, 1) * 0.8);
    }

    // ── Third-person camera follow ────────────────────────────────
    // Position camera behind and above, looking slightly in front of the car
    const carPos = rigidBodyRef.current.translation();
    const camOffset = new THREE.Vector3(0, 5.5, 13).applyQuaternion(quat);
    const camTarget = new THREE.Vector3(
      carPos.x + camOffset.x,
      carPos.y + camOffset.y,
      carPos.z + camOffset.z
    );

    // Smooth follow (lerp speed 0.07 = smooth, 0.15 = snappy)
    state.camera.position.lerp(camTarget, 0.09);

    // Look at a point slightly ahead of the car, not the car itself
    const lookAt = new THREE.Vector3(
      carPos.x - fwd.x * 3,
      carPos.y + 1.2,
      carPos.z - fwd.z * 3
    );
    state.camera.lookAt(lookAt);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      position={[0, 2, 8]}
      linearDamping={0.4}
      angularDamping={0.9}
      restitution={0}
      friction={0.7}
      // Lock rotation on X and Z so the car stays upright
      lockRotations={false}
      {...props}
    >
      <Suspense fallback={null}>
        <CarModel />
      </Suspense>
      <PositionalAudio ref={engineAudioRef} url="/audio/engine_loop.mp3" loop autoplay distance={10} />
      <PositionalAudio ref={shootAudioRef} url="/audio/shoot.mp3" distance={10} />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
