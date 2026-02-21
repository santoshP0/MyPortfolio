import React, { useRef, forwardRef, useImperativeHandle, memo, Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useBulletStore } from "../store/useBulletStore";
import { useAudioStore } from "../store/useAudioStore";
import { useObjectStore } from "../store/useObjectStore";

useGLTF.preload("/models/car/car.glb");

const CarModel = () => {
  const { scene } = useGLTF("/models/car/car.glb");
  // shift model down so wheels sit at collider bottom on terrain
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI, 0]} position={[0, -0.9, 0]} />;
};

const ACCELERATION = 2.2;
const BRAKE_FORCE = 3.5;
const MAX_SPEED = 18;
const TURN_SPEED = 2.5;
const BULLET_SPEED = 60;
const SHOOT_COOLDOWN = 250;
const BOUNDARY = 44;

const Car = memo(forwardRef(({ carStateRef, ...props }, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_s, get] = useKeyboardControls();
  const addBullet = useBulletStore((s) => s.addBullet);
  const lastShotTime = useRef(0);
  const engineRef = useRef();
  const shootRef = useRef();
  const engVol = useRef(0.15);
  const engRate = useRef(0.5);

  // Orbit state for unlocked-cursor camera
  const orbit = useRef({ theta: 0, phi: 0.35 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Lock only X and Z rotation (car stays upright on slopes)
  // Done imperatively — avoids possible prop-name issues across Rapier versions
  useEffect(() => {
    const tryLock = () => {
      if (rigidBodyRef.current?.setEnabledRotations) {
        rigidBodyRef.current.setEnabledRotations(false, true, false, true);
      }
    };
    // Wait one frame for physics body to initialize
    const id = requestAnimationFrame(tryLock);
    return () => cancelAnimationFrame(id);
  }, []);

  // Mouse orbit for unlocked-cursor mode
  useEffect(() => {
    const onDown = (e) => {
      if (e.button === 0 && !document.pointerLockElement) {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onUp = () => { isDragging.current = false; };
    const onMove = (e) => {
      if (!isDragging.current || document.pointerLockElement) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      orbit.current.theta -= dx * 0.005;
      orbit.current.phi = Math.max(-0.1, Math.min(1.1, orbit.current.phi - dy * 0.005));
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Reused vectors
  const _quat = useRef(new THREE.Quaternion()).current;
  const _fwd = useRef(new THREE.Vector3()).current;
  const _lat = useRef(new THREE.Vector3()).current;
  const _velXZ = useRef(new THREE.Vector3()).current;
  const _camOffset = useRef(new THREE.Vector3()).current;
  const _camTarget = useRef(new THREE.Vector3()).current;
  const _lookTgt = useRef(new THREE.Vector3()).current;
  const camPos = useRef(new THREE.Vector3(0, 10, 20));
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

    // Lateral grip
    const isBraking = backward && isMovingFwd;
    const isTurning = left || right;
    const isDrifting = isBraking && isTurning && speed > 5;
    const grip = isDrifting ? 0.15 : (isTurning && speed > 9) ? 0.68 : 0.88;
    const latSpd = nx * _lat.x + nz * _lat.z;
    nx -= _lat.x * latSpd * grip;
    nz -= _lat.z * latSpd * grip;

    // Acceleration
    if (forward) {
      const kick = 1 + Math.max(0, 1 - speed / 5) * 0.7;
      nx += _fwd.x * ACCELERATION * kick;
      nz += _fwd.z * ACCELERATION * kick;
    } else if (backward) {
      const f = isMovingFwd ? -BRAKE_FORCE : -ACCELERATION * 0.5;
      nx += _fwd.x * f; nz += _fwd.z * f;
    } else {
      nx *= 0.94; nz *= 0.94;
    }
    const spd2 = Math.sqrt(nx * nx + nz * nz);
    if (spd2 > MAX_SPEED) { const s = MAX_SPEED / spd2; nx *= s; nz *= s; }
    rigidBodyRef.current.setLinvel({ x: nx, y: vel.y, z: nz }, true);

    // Steering — inverts when reversing so left always = visual left
    const speedBlend = Math.min(speed / MAX_SPEED, 1);
    const effectiveTurn = TURN_SPEED * (1.0 - speedBlend * 0.55);
    const isReversing = signedSpeed < -0.4;
    const turnSign = isReversing ? -1 : 1;
    if (speed > 0.3) {
      const ay = left ? effectiveTurn * turnSign : right ? -effectiveTurn * turnSign : 0;
      rigidBodyRef.current.setAngvel({ x: 0, y: ay, z: 0 }, true);
    } else {
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Boundary repulsion
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

    // Shoot — auto-aim toward nearest target
    const now = Date.now();
    if (shoot && now - lastShotTime.current > SHOOT_COOLDOWN) {
      lastShotTime.current = now;

      // Find nearest alive target
      const objects = useObjectStore.getState().objects;
      let aimDir = { x: _fwd.x, y: 0, z: _fwd.z };

      let bestDist = 30; // max auto-aim range
      let bestTarget = null;
      for (const obj of objects) {
        if (obj.health <= 0 || !obj.position) continue;
        const dx = obj.position[0] - pos.x;
        const dz = obj.position[2] - pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < bestDist) {
          bestDist = dist;
          bestTarget = obj;
        }
      }

      if (bestTarget) {
        // Blend 65% toward target, 35% forward direction
        const toTarget = {
          x: bestTarget.position[0] - pos.x,
          z: bestTarget.position[2] - pos.z,
        };
        const len = Math.sqrt(toTarget.x * toTarget.x + toTarget.z * toTarget.z) || 1;
        toTarget.x /= len;
        toTarget.z /= len;
        aimDir.x = _fwd.x * 0.35 + toTarget.x * 0.65;
        aimDir.z = _fwd.z * 0.35 + toTarget.z * 0.65;
        // Normalize
        const aimLen = Math.sqrt(aimDir.x * aimDir.x + aimDir.z * aimDir.z) || 1;
        aimDir.x /= aimLen;
        aimDir.z /= aimLen;
      }

      addBullet(
        [pos.x + aimDir.x * 2.5, pos.y + 0.8, pos.z + aimDir.z * 2.5],
        [aimDir.x * BULLET_SPEED, 0, aimDir.z * BULLET_SPEED]
      );
      if (shootRef.current) {
        const { shootVolume } = useAudioStore.getState();
        if (shootRef.current.isPlaying) shootRef.current.stop();
        shootRef.current.setVolume(Math.max(0.001, shootVolume));
        shootRef.current.play();
      }
    }

    // Engine audio
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

    // carState for SandTrail
    if (carStateRef?.current) {
      carStateRef.current.position.set(pos.x, pos.y, pos.z);
      carStateRef.current.quaternion.copy(_quat);
      carStateRef.current.speed = speed;
    }

    // ── Camera ───────────────────────────────────────────────────
    if (document.pointerLockElement) {
      // Locked: normal follow camera
      const camDist = isDrifting ? 16 : 13;
      _camOffset.set(0, 5.5, camDist).applyQuaternion(_quat);
      _camTarget.set(pos.x + _camOffset.x, pos.y + _camOffset.y, pos.z + _camOffset.z);
      camPos.current.lerp(_camTarget, isDrifting ? 0.05 : 0.07);
      state.camera.position.copy(camPos.current);
      _lookTgt.set(pos.x - _fwd.x * 4, pos.y + 1.5, pos.z - _fwd.z * 4);
      camLook.current.lerp(_lookTgt, 0.07);
      state.camera.lookAt(camLook.current);
      // Sync orbit angles so camera snaps back nicely when re-locking
      const dx = camPos.current.x - pos.x;
      const dz = camPos.current.z - pos.z;
      orbit.current.theta = Math.atan2(dx, dz);
      orbit.current.phi = 0.35;
    } else {
      // Unlocked: orbit camera around car using mouse drag
      // WASD still moves the car since keyboard events work without pointer lock
      const dist = 14;
      const { theta, phi } = orbit.current;
      const cx = pos.x + Math.sin(theta) * Math.cos(phi) * dist;
      const cy = pos.y + Math.sin(phi) * dist + 2;
      const cz = pos.z + Math.cos(theta) * Math.cos(phi) * dist;
      state.camera.position.lerp({ x: cx, y: cy, z: cz }, 0.1);
      state.camera.lookAt(pos.x, pos.y + 1.5, pos.z);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={[0, 8, 8]}
      linearDamping={0.3}
      angularDamping={0.9}
      restitution={0}
      friction={0.8}
      {...props}
    >
      {/* Manual collider at wheel level so car sits on terrain, not above it */}
      <CuboidCollider args={[0.8, 0.4, 1.5]} position={[0, -0.1, 0]} />
      <Suspense fallback={null}><CarModel /></Suspense>
      <PositionalAudio ref={engineRef} url="/audio/engine_loop.mp3" loop autoplay distance={12} />
      <PositionalAudio ref={shootRef} url="/audio/shoot.mp3" loop={false} distance={12} />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
