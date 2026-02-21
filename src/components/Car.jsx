import React, { useRef, forwardRef, useImperativeHandle, memo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useBulletStore } from "../store/useBulletStore";
import { useAudioStore } from "../store/useAudioStore";

useGLTF.preload("/models/car/car.glb");

const CarModel = () => {
  const { scene } = useGLTF("/models/car/car.glb");
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI, 0]} />;
};

// ─── Physics constants ────────────────────────────────────────────────────────
const ACCELERATION = 2.2;
const BRAKE_FORCE = 3.5;
const MAX_SPEED = 18;
const TURN_SPEED = 2.5;
const BULLET_SPEED = 60;
const SHOOT_COOLDOWN = 250;
const BOUNDARY = 44;  // units from center before repulsion

const Car = memo(forwardRef(({ carStateRef, ...props }, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_s, get] = useKeyboardControls();
  const addBullet = useBulletStore((s) => s.addBullet);

  const lastShotTime = useRef(0);
  const engineRef = useRef();
  const shootRef = useRef();

  // Manual volume tracking — avoids unreliable getVolume() calls
  const engVol = useRef(0.15);
  const engRate = useRef(0.5);

  // Reused vectors — zero GC overhead
  const _quat = useRef(new THREE.Quaternion()).current;
  const _fwd = useRef(new THREE.Vector3()).current;
  const _lat = useRef(new THREE.Vector3()).current;
  const _velXZ = useRef(new THREE.Vector3()).current;
  const _camOffset = useRef(new THREE.Vector3()).current;
  const _camTarget = useRef(new THREE.Vector3()).current;
  const _lookTgt = useRef(new THREE.Vector3()).current;
  const camPos = useRef(new THREE.Vector3(0, 8, 18));
  const camLook = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((state) => {
    const { forward, backward, left, right, shoot } = get();
    if (!rigidBodyRef.current) return;

    const vel = rigidBodyRef.current.linvel();
    const rot = rigidBodyRef.current.rotation();
    _quat.set(rot.x, rot.y, rot.z, rot.w);
    _fwd.set(0, 0, -1).applyQuaternion(_quat);
    _lat.set(1, 0, 0).applyQuaternion(_quat);

    _velXZ.set(vel.x, 0, vel.z);
    const speed = _velXZ.length();
    const signedSpeed = _velXZ.dot(_fwd);
    const isMovingFwd = signedSpeed > 0.5;

    let nx = _velXZ.x, nz = _velXZ.z;

    // ── Lateral grip / drift ───────────────────────────────────────
    // Drift triggers: braking + steering + speed (rear slides out like a real drift)
    const isBraking = backward && isMovingFwd;
    const isTurning = left || right;
    const isDrifting = isBraking && isTurning && speed > 5;

    // gripFactor: fraction of lateral velocity REMOVED each frame
    //   0.88 = grippy normal  |  0.15 = full sideways slide (drift)
    const gripFactor = isDrifting ? 0.15
      : (isTurning && speed > 9) ? 0.68
        : 0.88;

    const latSpd = nx * _lat.x + nz * _lat.z;
    nx -= _lat.x * latSpd * gripFactor;
    nz -= _lat.z * latSpd * gripFactor;

    // ── Acceleration ──────────────────────────────────────────────
    if (forward) {
      // Clutch-release kick: extra torque when nearly stopped, tapers at speed
      const kick = 1 + Math.max(0, 1 - speed / 5) * 0.7;
      nx += _fwd.x * ACCELERATION * kick;
      nz += _fwd.z * ACCELERATION * kick;
    } else if (backward) {
      if (isMovingFwd) {
        nx += _fwd.x * -BRAKE_FORCE;
        nz += _fwd.z * -BRAKE_FORCE;
      } else {
        nx += _fwd.x * -ACCELERATION * 0.5;
        nz += _fwd.z * -ACCELERATION * 0.5;
      }
    } else {
      nx *= 0.94; nz *= 0.94;
    }

    const spd2 = Math.sqrt(nx * nx + nz * nz);
    if (spd2 > MAX_SPEED) { const s = MAX_SPEED / spd2; nx *= s; nz *= s; }
    rigidBodyRef.current.setLinvel({ x: nx, y: vel.y, z: nz }, true);

    // ── Steering (speed-dependent radius) ─────────────────────────
    const speedBlend = Math.min(speed / MAX_SPEED, 1);
    const effectiveTurn = TURN_SPEED * (1.0 - speedBlend * 0.55);
    if (speed > 0.3) {
      const ay = left ? effectiveTurn : right ? -effectiveTurn : 0;
      rigidBodyRef.current.setAngvel({ x: 0, y: ay, z: 0 }, true);
    } else {
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // ── Boundary repulsion (fog-wall feel, no invisible block) ────
    const pos = rigidBodyRef.current.translation();
    const ax = Math.abs(pos.x), az = Math.abs(pos.z);
    if (ax > BOUNDARY || az > BOUNDARY) {
      const over = Math.max(ax - BOUNDARY, 0) + Math.max(az - BOUNDARY, 0);
      const str = 30 + over * 6;
      rigidBodyRef.current.applyImpulse({
        x: ax > BOUNDARY ? -Math.sign(pos.x) * str : 0,
        y: 0,
        z: az > BOUNDARY ? -Math.sign(pos.z) * str : 0,
      }, true);
    }

    // ── Shoot ─────────────────────────────────────────────────────
    const now = Date.now();
    if (shoot && now - lastShotTime.current > SHOOT_COOLDOWN) {
      lastShotTime.current = now;
      addBullet(
        [pos.x + _fwd.x * 2.5, pos.y + 0.8, pos.z + _fwd.z * 2.5],
        [_fwd.x * BULLET_SPEED, 0, _fwd.z * BULLET_SPEED]
      );
      if (shootRef.current) {
        const { shootVolume } = useAudioStore.getState();
        if (shootRef.current.isPlaying) shootRef.current.stop();
        shootRef.current.setVolume(Math.max(0.001, shootVolume));
        shootRef.current.play();
      }
    }

    // ── Engine audio (always on, pitch + volume track speed) ──────
    if (engineRef.current?.context) {
      const { engineVolume } = useAudioStore.getState();
      const t = Math.min(speed / MAX_SPEED, 1);
      const revBoost = (forward || backward) ? 0.08 : 0;
      const driftRev = isDrifting ? 0.15 : 0;

      const targetRate = 0.5 + t * 0.95 + revBoost + driftRev;
      const targetVol = (0.15 + t * 0.85) * Math.max(0.001, engineVolume);

      engRate.current += (targetRate - engRate.current) * 0.12;
      engVol.current += (targetVol - engVol.current) * 0.12;

      engineRef.current.setPlaybackRate(engRate.current);
      engineRef.current.setVolume(engVol.current);
    }

    // ── carState for SandTrail (plain JS write, safe) ─────────────
    if (carStateRef?.current) {
      carStateRef.current.position.set(pos.x, pos.y, pos.z);
      carStateRef.current.quaternion.copy(_quat);
      carStateRef.current.speed = speed;
    }

    // ── Camera: drift pulls camera wider for drama ─────────────────
    const camDist = isDrifting ? 16 : 13;
    _camOffset.set(0, 5.5, camDist).applyQuaternion(_quat);
    _camTarget.set(pos.x + _camOffset.x, pos.y + _camOffset.y, pos.z + _camOffset.z);
    camPos.current.lerp(_camTarget, isDrifting ? 0.05 : 0.07);
    state.camera.position.copy(camPos.current);
    _lookTgt.set(pos.x - _fwd.x * 4, pos.y + 1.5, pos.z - _fwd.z * 4);
    camLook.current.lerp(_lookTgt, 0.07);
    state.camera.lookAt(camLook.current);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      position={[0, 2, 8]}
      linearDamping={0.3}
      angularDamping={0.8}
      restitution={0}
      friction={0.7}
      {...props}
    >
      <Suspense fallback={null}><CarModel /></Suspense>
      <PositionalAudio ref={engineRef} url="/audio/engine_loop.mp3" loop autoplay distance={12} />
      <PositionalAudio ref={shootRef} url="/audio/shoot.mp3" loop={false} distance={12} />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
