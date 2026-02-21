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
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI, 0]} />;
};

/**
 * @param {React.Ref} fwdRef        - exposes the Rapier RigidBody ref upward
 * @param {React.Ref} carStateRef   - plain JS ref written each frame for SandTrail
 */
const Car = memo(forwardRef(({ carStateRef, ...props }, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_, get] = useKeyboardControls();
  const addBullet = useBulletStore((s) => s.addBullet);

  const ACCELERATION = 1.8;
  const BRAKE_FORCE = 1.5;
  const MAX_SPEED = 14;
  const TURN_SPEED = 2.2;
  const BULLET_SPEED = 60;
  const SHOOT_COOLDOWN = 250;

  const lastShotTime = useRef(0);
  const engineAudioRef = useRef();
  const shootAudioRef = useRef();

  // Persistent camera vectors — avoid allocating every frame
  const camPos = useRef(new THREE.Vector3(0, 8, 18));
  const camLook = useRef(new THREE.Vector3(0, 1.5, 0));
  const _camTarget = new THREE.Vector3();
  const _lookTarget = new THREE.Vector3();
  const _quat = new THREE.Quaternion();
  const _fwd = new THREE.Vector3();
  const _velXZ = new THREE.Vector3();

  useFrame((state) => {
    const { forward, backward, left, right, shoot } = get();
    if (!rigidBodyRef.current) return;

    const vel = rigidBodyRef.current.linvel();
    const rot = rigidBodyRef.current.rotation();
    _quat.set(rot.x, rot.y, rot.z, rot.w);
    _fwd.set(0, 0, -1).applyQuaternion(_quat);

    // ── Velocity ────────────────────────────────────────────────
    _velXZ.set(vel.x, 0, vel.z);
    const speed = _velXZ.length();
    const signedSpeed = _velXZ.dot(_fwd);

    let nx = _velXZ.x, nz = _velXZ.z;
    if (forward) {
      nx += _fwd.x * ACCELERATION; nz += _fwd.z * ACCELERATION;
    } else if (backward) {
      const f = signedSpeed > 0.1 ? -BRAKE_FORCE : -ACCELERATION * 0.6;
      nx += _fwd.x * f; nz += _fwd.z * f;
    } else {
      nx *= 0.92; nz *= 0.92;
    }
    const spd2 = Math.sqrt(nx * nx + nz * nz);
    if (spd2 > MAX_SPEED) { const s = MAX_SPEED / spd2; nx *= s; nz *= s; }
    rigidBodyRef.current.setLinvel({ x: nx, y: vel.y, z: nz }, true);

    // ── Turning ─────────────────────────────────────────────────
    if (speed > 0.3) {
      if (left) rigidBodyRef.current.setAngvel({ x: 0, y: TURN_SPEED, z: 0 }, true);
      else if (right) rigidBodyRef.current.setAngvel({ x: 0, y: -TURN_SPEED, z: 0 }, true);
      else rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // ── Shoot ───────────────────────────────────────────────────
    const now = Date.now();
    if (shoot && now - lastShotTime.current > SHOOT_COOLDOWN) {
      lastShotTime.current = now;
      const p = rigidBodyRef.current.translation();
      addBullet(
        [p.x + _fwd.x * 2.5, p.y + 0.8, p.z + _fwd.z * 2.5],
        [_fwd.x * BULLET_SPEED, 0, _fwd.z * BULLET_SPEED]
      );
      if (shootAudioRef.current) {
        if (shootAudioRef.current.isPlaying) shootAudioRef.current.stop();
        shootAudioRef.current.play();
      }
    }

    // ── Engine audio ────────────────────────────────────────────
    if (engineAudioRef.current?.context) {
      const t = Math.min(speed / MAX_SPEED, 1);
      engineAudioRef.current.setVolume(speed < 0.15 ? 0 : 0.2 + t * 0.8);
      if (speed >= 0.15) engineAudioRef.current.setPlaybackRate(0.55 + t * 0.85);
    }

    // ── Write carState for SandTrail (plain JS — no Rapier after here) ──
    const carPos = rigidBodyRef.current.translation();
    if (carStateRef?.current) {
      carStateRef.current.position.set(carPos.x, carPos.y, carPos.z);
      carStateRef.current.quaternion.copy(_quat);
      carStateRef.current.speed = speed;
    }

    // ── Camera — dual lerp ──────────────────────────────────────
    const offset = new THREE.Vector3(0, 5.5, 13).applyQuaternion(_quat);
    _camTarget.set(carPos.x + offset.x, carPos.y + offset.y, carPos.z + offset.z);
    camPos.current.lerp(_camTarget, 0.07);
    state.camera.position.copy(camPos.current);

    _lookTarget.set(carPos.x - _fwd.x * 4, carPos.y + 1.5, carPos.z - _fwd.z * 4);
    camLook.current.lerp(_lookTarget, 0.07);
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
      <Suspense fallback={null}><CarModel /></Suspense>
      <PositionalAudio ref={engineAudioRef} url="/audio/engine_loop.mp3" loop autoplay distance={12} />
      <PositionalAudio ref={shootAudioRef} url="/audio/shoot.mp3" loop={false} distance={12} />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
