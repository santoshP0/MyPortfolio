import React, { useMemo, memo } from "react";
import * as THREE from "three";
import { terrainHeight } from "../utils/terrain";

const CLUTTER_COUNT = 60; // Increased
const MAP_SIZE = 180;

/* ─── Procedural Stone Component ────────────────────────────── */
const RuinedStone = memo(({ position, rotation, scale, type }) => {
    const geo = useMemo(() => {
        let base;
        if (type === "pillar") {
            base = new THREE.CylinderGeometry(0.6, 0.9, 5, 8);
        } else if (type === "block") {
            base = new THREE.BoxGeometry(3, 1.5, 3.5);
        } else if (type === "wall") {
            base = new THREE.BoxGeometry(5, 4, 1.2);
        } else if (type === "arch") {
            base = new THREE.TorusGeometry(3.5, 0.8, 8, 12, Math.PI); // Half torus
        } else {
            base = new THREE.IcosahedronGeometry(2, 0);
        }

        const pos = base.attributes.position.array;
        for (let i = 0; i < pos.length; i++) {
            pos[i] += (Math.random() - 0.5) * 0.6; // heavy organic chipping
        }
        base.computeVertexNormals();
        return base;
    }, [type]);

    return (
        <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
            <primitive object={geo} attach="geometry" />
            <meshStandardMaterial
                color="#6e5e4e"
                roughness={1}
                metalness={0.1}
                bumpScale={0.15}
            />
        </mesh>
    );
});

const EnvironmentClutter = () => {
    const stones = useMemo(() => {
        const list = [];
        const seed = 54321;
        const rng = (i) => {
            const x = Math.sin(seed + i) * 10000;
            return x - Math.floor(x);
        };

        for (let i = 0; i < CLUTTER_COUNT; i++) {
            const x = (rng(i * 4) - 0.5) * MAP_SIZE;
            const z = (rng(i * 4 + 1) - 0.5) * MAP_SIZE;

            if (Math.sqrt(x * x + z * z) < 20) continue;

            const y = terrainHeight(x, z) - 0.2;

            let type;
            const r = rng(i * 4 + 2);
            if (r < 0.15) type = "wall";
            else if (r < 0.25) type = "arch";
            else if (r < 0.50) type = "pillar";
            else if (r < 0.70) type = "block";
            else type = "rock";

            list.push({
                id: i,
                position: [x, y, z],
                rotation: [
                    type === "arch" ? Math.PI : rng(i) * 0.2,
                    rng(i + 1) * Math.PI,
                    rng(i + 2) * 0.1
                ],
                scale: type === "arch" ? 0.7 : 0.6 + rng(i + 4) * 0.6,
                type
            });
        }
        return list;
    }, []);

    return (
        <group>
            {stones.map((s) => (
                <RuinedStone key={s.id} {...s} />
            ))}
        </group>
    );
};

export default memo(EnvironmentClutter);
