import React, { useRef, forwardRef, useImperativeHandle, memo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useBulletStore } from "../store/useBulletStore";

useGLTF.preload("/models/car/car.glb");

const CarModel = () => {
  const { scene } = useGLTF("/models/car/car.glb");
  return (
    <primitive
      object={scene}
      scale={[0.5, 0.5, 0.5]}
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
  const ACCELERATION = 1.8;
  const BRAKE_FORCE = 1.5;
  const MAX_SPEED = 14;
  const TURN_SPEED = 2.2;
  const BULLET_SPEED = 60;
  const SHOOT_COOLDOWN = 250;

  const lastShotTime = useRef(0);

  const engineAudioRef = useRef();
  const shootAudioRef = useRef();

  // Smoothed camera targets — avoid re-allocating every frame
  const camPos = useRef(new THREE.Vector3(0, 8, 18));
  const camLook = useRef(new THREE.Vector3(0, 1.5, 0));

  const tmpCamTarget = new THREE.Vector3();
  const tmpLookTarget = new THREE.Vector3();

  useFrame((state, delta) => {
    const { forward, backward, left, right, shoot } = get();
    if (!rigidBodyRef.current) return;

    const vel = rigidBodyRef.current.linvel();
    const rot = rigidBodyRef.current.rotation();
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);

    // ── Speed ────────────────────────────────────────────────────
    const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
    const velXZ = new THREE.Vector3(vel.x, 0, vel.z);
    const signedSpeed = velXZ.dot(fwd);

    let newVelXZ = velXZ.clone();

    if (forward) {
      newVelXZ.addScaledVector(fwd, ACCELERATION);
    } else if (backward) {
      if (signedSpeed > 0.1) {
        newVelXZ.addScaledVector(fwd, -BRAKE_FORCE);
      } else {
        newVelXZ.addScaledVector(fwd, -ACCELERATION * 0.6);
      }
    } else {
      newVelXZ.multiplyScalar(0.92);
    }

    if (newVelXZ.length() > MAX_SPEED) newVelXZ.normalize().multiplyScalar(MAX_SPEED);
    rigidBodyRef.current.setLinvel({ x: newVelXZ.x, y: vel.y, z: newVelXZ.z }, true);

    // ── Turning ──────────────────────────────────────────────────
    if (speed > 0.3) {
      if (left) rigidBodyRef.current.setAngvel({ x: 0, y: TURN_SPEED, z: 0 }, true);
      else if (right) rigidBodyRef.current.setAngvel({ x: 0, y: -TURN_SPEED, z: 0 }, true);
      else rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // ── Shoot ────────────────────────────────────────────────────
    const now = Date.now();
    if (shoot && now - lastShotTime.current > SHOOT_COOLDOWN) {
      lastShotTime.current = now;
      const p = rigidBodyRef.current.translation();
      addBullet(
        [p.x + fwd.x * 2.5, p.y + 0.8, p.z + fwd.z * 2.5],
        [fwd.x * BULLET_SPEED, fwd.y * BULLET_SPEED, fwd.z * BULLET_SPEED]
      );
      // Prevent overlapping audio — stop stale play before starting new
      if (shootAudioRef.current) {
        if (shootAudioRef.current.isPlaying) shootAudioRef.current.stop();
        shootAudioRef.current.play();
      }
    }

    // ── Engine audio — pitch & volume tied to speed ───────────────
    if (engineAudioRef.current?.context) {
      const t = Math.min(speed / MAX_SPEED, 1);
      if (speed < 0.15) {
        // Silent at rest (avoid ugly constant drone)
        engineAudioRef.current.setVolume(0);
      } else {
        // Volume 0.2 → 1.0, playback rate 0.55 (idle) → 1.4 (full speed)
        engineAudioRef.current.setVolume(0.2 + t * 0.8);
        engineAudioRef.current.setPlaybackRate(0.55 + t * 0.85);
      }
    }

    // ── Camera — dual lerp (position + lookAt target) ─────────────
    // This prevents the "jitter" caused by directly setting lookAt each frame.
    const carPos = rigidBodyRef.current.translation();

    // Camera sits above and behind, offset rotated with the car
    const offset = new THREE.Vector3(0, 5.5, 13).applyQuaternion(quat);
    tmpCamTarget.set(carPos.x + offset.x, carPos.y + offset.y, carPos.z + offset.z);
    camPos.current.lerp(tmpCamTarget, 0.07);          // position: slow = smooth
    state.camera.position.copy(camPos.current);

    // Look slightly ahead of the car
    tmpLookTarget.set(
      carPos.x - fwd.x * 4,
      carPos.y + 1.5,
      carPos.z - fwd.z * 4
    );
    camLook.current.lerp(tmpLookTarget, 0.07);        // look target: same rate = no judder
    state.camera.lookAt(camLook.current);
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
      {...props}
    >
      <Suspense fallback={null}>
        <CarModel />
      </Suspense>
      <PositionalAudio
        ref={engineAudioRef}
        url="/audio/engine_loop.mp3"
        loop
        autoplay
        distance={12}
      />
      {/* Shoot: no loop, no autoplay — triggered manually */}
      <PositionalAudio
        ref={shootAudioRef}
        url="/audio/shoot.mp3"
        loop={false}
        distance={12}
      />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
