import React, { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_PARTICLES = 600;

/**
 * Sand dust trail. Reads from `carStateRef` — a plain-JS ref written each
 * frame by Car.jsx — so it NEVER calls Rapier WASM directly (no null-ptr crash).
 */
const SandTrail = memo(({ carStateRef }) => {
    const pointsRef = useRef();

    // Pre-allocated buffers — never reallocated
    const positions = useMemo(() => new Float32Array(MAX_PARTICLES * 3).fill(9999), []);
    const colors = useMemo(() => {
        const c = new Float32Array(MAX_PARTICLES * 3);
        for (let i = 0; i < MAX_PARTICLES; i++) {
            c[i * 3] = 0.78; c[i * 3 + 1] = 0.63; c[i * 3 + 2] = 0.38;
        }
        return c;
    }, []);

    const lifetimes = useRef(new Float32Array(MAX_PARTICLES).fill(0));
    const velocities = useRef(
        Array.from({ length: MAX_PARTICLES }, () => new THREE.Vector3())
    );
    const nextSlot = useRef(0);
    const lastEmit = useRef(0);

    useFrame((_, delta) => {
        // Safe read — only plain JS, no Rapier calls
        const cs = carStateRef?.current;
        const speed = cs?.speed ?? 0;
        const position = cs?.position;
        const quat = cs?.quaternion;

        // ── Emit when moving ─────────────────────────────────────────
        const isDrifting = cs?.drifting ?? false;
        const now = Date.now();
        let interval = speed > 6 ? 35 : 65; // Slightly slower emission
        if (isDrifting) interval = 15;

        if (speed > 1.2 && position && quat && now - lastEmit.current > interval) {
            lastEmit.current = now;

            const back = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quat);

            // Wheel offsets (approximate based on car dimensions)
            const wheelOffsets = [
                { x: 0.8, z: 1.5 },  // Front Right
                { x: -0.8, z: 1.5 }, // Front Left
                { x: 0.8, z: -1.7 }, // Back Right
                { x: -0.8, z: -1.7 }  // Back Left
            ];

            for (let w = 0; w < 4; w++) {
                const off = wheelOffsets[w];
                const i = nextSlot.current % MAX_PARTICLES;
                nextSlot.current++;
                const idx = i * 3;

                // Position at ground level (subtract GROUND_Y_OFF from car center)
                positions[idx] = position.x + right.x * off.x + back.x * off.z + (Math.random() - 0.5) * 0.3;
                positions[idx + 1] = position.y - 0.78 + 0.01; // Subtract 0.78 (GROUND_Y_OFF) to hit terrain
                positions[idx + 2] = position.z + right.z * off.x + back.z * off.z + (Math.random() - 0.5) * 0.3;

                const driftSpread = isDrifting ? 3.0 : 1.2;
                velocities.current[i].set(
                    (Math.random() - 0.5) * driftSpread + back.x * 0.8,
                    Math.random() * (isDrifting ? 2.0 : 0.8) + 0.2,
                    (Math.random() - 0.5) * driftSpread + back.z * 0.8
                );
                lifetimes.current[i] = isDrifting ? 1.4 : 0.8;
            }
        }

        // ── Advance all live particles ────────────────────────────────
        let anyAlive = false;
        for (let i = 0; i < MAX_PARTICLES; i++) {
            if (lifetimes.current[i] <= 0) continue;
            lifetimes.current[i] -= delta * 1.5;
            const idx = i * 3;

            if (lifetimes.current[i] <= 0) {
                positions[idx + 1] = 9999; // hide
                continue;
            }
            anyAlive = true;

            positions[idx] += velocities.current[i].x * delta;
            positions[idx + 1] += velocities.current[i].y * delta;
            positions[idx + 2] += velocities.current[i].z * delta;

            // Random jitter/gravity for "sand" look
            velocities.current[i].y -= (2 + Math.random() * 4) * delta;
            velocities.current[i].x += (Math.random() - 0.5) * 0.1;
            velocities.current[i].z += (Math.random() - 0.5) * 0.1;
            velocities.current[i].multiplyScalar(0.95);

            const t = lifetimes.current[i];
            colors[idx] = THREE.MathUtils.lerp(0.95, 0.78, t);
            colors[idx + 1] = THREE.MathUtils.lerp(0.88, 0.63, t);
            colors[idx + 2] = THREE.MathUtils.lerp(0.70, 0.38, t);
        }

        if (anyAlive && pointsRef.current) {
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
                size={0.12} // Even smaller for "grain" look
                transparent
                opacity={0.35}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    );
});

SandTrail.displayName = "SandTrail";
export default SandTrail;
