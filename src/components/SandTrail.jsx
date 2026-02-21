import React, { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_PARTICLES = 300;

/**
 * Sand dust trail emitted from behind the car wheels when moving.
 * Uses a single Points mesh with pre-allocated Float32Arrays for zero GC.
 */
const SandTrail = memo(({ carRef }) => {
    const pointsRef = useRef();

    // Pre-allocate buffers — never reallocated
    const positions = useMemo(() => new Float32Array(MAX_PARTICLES * 3).fill(9999), []);
    const colors = useMemo(() => new Float32Array(MAX_PARTICLES * 3), []);
    const lifetimes = useRef(new Float32Array(MAX_PARTICLES).fill(0));
    const velocities = useRef(
        Array.from({ length: MAX_PARTICLES }, () => new THREE.Vector3())
    );
    const nextSlot = useRef(0);
    const lastEmit = useRef(0);

    // Initialise all particles as invisible
    useMemo(() => {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            colors[i * 3] = 0.78;
            colors[i * 3 + 1] = 0.63;
            colors[i * 3 + 2] = 0.38;
        }
    }, [colors]);

    useFrame((_, delta) => {
        if (!carRef?.current?.linvel) return;

        const vel = carRef.current.linvel();
        const pos = carRef.current.translation();
        const rot = carRef.current.rotation();
        const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

        // ── Emit new particles when moving ────────────────────────────
        const now = Date.now();
        const emitInterval = speed > 6 ? 30 : speed > 2 ? 55 : 0;
        if (speed > 1.2 && emitInterval && now - lastEmit.current > emitInterval) {
            lastEmit.current = now;

            // Emit one puff per rear wheel (offset left/right)
            const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
            const back = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quat);

            const emitCount = speed > 7 ? 3 : 2;
            for (let e = 0; e < emitCount; e++) {
                const side = (e % 2 === 0 ? 1 : -1) * 0.7;
                const i = nextSlot.current % MAX_PARTICLES;
                nextSlot.current++;
                const idx = i * 3;

                positions[idx] = pos.x + back.x * 1.4 + right.x * side + (Math.random() - 0.5) * 0.8;
                positions[idx + 1] = pos.y + 0.08;
                positions[idx + 2] = pos.z + back.z * 1.4 + right.z * side + (Math.random() - 0.5) * 0.8;

                velocities.current[i].set(
                    (Math.random() - 0.5) * 1.8 + back.x * 1.5,
                    Math.random() * 1.5 + 0.4,
                    (Math.random() - 0.5) * 1.8 + back.z * 1.5
                );
                lifetimes.current[i] = 1.0;
            }
        }

        // ── Update live particles ─────────────────────────────────────
        for (let i = 0; i < MAX_PARTICLES; i++) {
            if (lifetimes.current[i] <= 0) continue;

            lifetimes.current[i] -= delta * 1.2;
            const idx = i * 3;

            if (lifetimes.current[i] <= 0) {
                positions[idx + 1] = 9999; // hide
                continue;
            }

            // Move + gravity
            positions[idx] += velocities.current[i].x * delta;
            positions[idx + 1] += velocities.current[i].y * delta;
            positions[idx + 2] += velocities.current[i].z * delta;
            velocities.current[i].y -= 4 * delta;       // gravity
            velocities.current[i].multiplyScalar(0.96); // drag

            // Fade color to sand-white as particle dies
            const t = lifetimes.current[i];
            colors[idx] = THREE.MathUtils.lerp(0.95, 0.78, t);
            colors[idx + 1] = THREE.MathUtils.lerp(0.88, 0.63, t);
            colors[idx + 2] = THREE.MathUtils.lerp(0.70, 0.38, t);
        }

        if (pointsRef.current) {
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.geometry.attributes.color.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef} renderOrder={1}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={positions} count={MAX_PARTICLES} itemSize={3} />
                <bufferAttribute attach="attributes-color" array={colors} count={MAX_PARTICLES} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                vertexColors
                size={0.32}
                transparent
                opacity={0.75}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    );
});

SandTrail.displayName = "SandTrail";
export default SandTrail;
