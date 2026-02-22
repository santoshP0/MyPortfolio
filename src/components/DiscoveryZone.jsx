import React, { useRef, useMemo, memo, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sparkles, useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useDiscoveryStore } from "../store/useDiscoveryStore";
import { portfolioData } from "../data/portfolioData";

/* ─── Content Lookup ─────────────────────────────────────────── */
function buildContentMap() {
    const map = { [portfolioData.contact.id]: portfolioData.contact };
    for (const arr of [portfolioData.projects, portfolioData.skills, portfolioData.experience])
        for (const item of arr) map[item.id] = item;
    return map;
}
const CONTENT_MAP = buildContentMap();
const ICONS = { project: "🗿", skill: "📦", experience: "🪧", contact: "📡" };

/* ─── Realistic Organic Rock Component ──────────────────────── */
const RealisticRock = memo(({ scale = 1, color = "#6e5e4e" }) => {
    const geo = useMemo(() => {
        const g = new THREE.IcosahedronGeometry(2, 1);
        const pos = g.attributes.position.array;
        for (let i = 0; i < pos.length; i++) {
            pos[i] += (Math.random() - 0.5) * 0.8;
        }
        g.computeVertexNormals();
        return g;
    }, []);

    return (
        <mesh geometry={geo} castShadow receiveShadow>
            <meshStandardMaterial
                color={color}
                roughness={1}
                metalness={0.1}
            />
        </mesh>
    );
});

/* ─── Carved Stone Monolith ──────────────────────────────────── */
const Monolith = memo(({ scale = [1, 1, 1] }) => {
    const geo = useMemo(() => {
        // Increased from 3.6, 7.5, 1.8 to 4.2, 8.5, 2.2
        const g = new THREE.BoxGeometry(4.2, 8.5, 2.2, 5, 10, 3);
        const pos = g.attributes.position.array;
        for (let i = 0; i < pos.length; i++) {
            const y = pos[i * 3 + 1];
            const jitter = (Math.random() - 0.5) * (y > 1 ? 0.5 : 0.25);
            pos[i] += jitter;
        }
        g.computeVertexNormals();
        return g;
    }, []);

    return (
        <mesh geometry={geo} castShadow receiveShadow scale={scale}>
            <meshStandardMaterial
                color="#5c4a3a"
                roughness={1}
                metalness={0.05}
            />
        </mesh>
    );
});

/* ─── Custom Model Renderer ─────────────────────────────────── */
const CustomDiscoveryModel = memo(({ url }) => {
    const { scene } = useGLTF(url);
    // Auto-center and scale custom models somewhat reasonably
    return <primitive object={scene} scale={2.5} rotation={[0, Math.PI, 0]} position={[0, 0, 0]} />;
});

/* ─── Rising Monument ────────────────────────────────────────── */
const Monument = memo(({ position, content, isInteractable }) => {
    const rbRef = useRef();
    const groupRef = useRef();
    const [isRising, setIsRising] = useState(true);
    const targetY = position[1] + 2.5;

    const interacting = useDiscoveryStore((s) => s.interacting);
    const setInteracting = useDiscoveryStore((s) => s.setInteracting);

    const activeZoneId = useDiscoveryStore((s) => s.activeZoneId);
    const paused = useDiscoveryStore((s) => s.paused);

    useEffect(() => {
        const onKeyDown = (e) => {
            // Only respond if this is the ACTIVE zone
            if (isInteractable && content?.id === activeZoneId && e.key.toLowerCase() === "e") {
                setInteracting(!interacting);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [interacting, isInteractable, activeZoneId, content?.id]);

    useFrame((state, dt) => {
        if (!isRising || !rbRef.current) return;

        const currentPos = rbRef.current.translation();
        const nextY = THREE.MathUtils.lerp(currentPos.y, targetY, dt * 2.0);

        // Sync physics translation ONLY
        rbRef.current.setNextKinematicTranslation({
            x: position[0],
            y: nextY,
            z: position[2]
        });

        if (Math.abs(nextY - targetY) < 0.01) setIsRising(false);
    });

    const icon = ICONS[content?.category] ?? "✨";

    return (
        <group>
            {isRising && <Sparkles count={60} scale={6} size={4} speed={2} opacity={0.6} color="#d4a373" />}

            <RigidBody
                ref={rbRef}
                type={isRising ? "kinematicPosition" : "fixed"}
                position={[position[0], -10, position[2]]}
                colliders={false}
                sensor={isRising}
            >
                <CuboidCollider args={[2.1, 4.25, 1.1]} position={[0, 0.0, -1.5]} />
                <group ref={groupRef} position={[0, 0, -1.5]}>
                    {content?.modelPath ? (
                        <Suspense fallback={<Monolith />}>
                            <CustomDiscoveryModel url={content.modelPath} />
                        </Suspense>
                    ) : (
                        <Monolith />
                    )}

                    {/* Stone base debris */}
                    <group position={[1.4, -2.4, 0.6]} scale={0.4} rotation={[0.5, 1, 0]}>
                        <RealisticRock color="#4a3a2a" />
                    </group>
                    <group position={[-1.3, -2.5, -0.8]} scale={0.4} rotation={[2, 0.5, 1]}>
                        <RealisticRock color="#4a3a2a" />
                    </group>

                    {/* Inscription (HTML occluded-look) */}
                    {!paused && (
                        <Html
                            center
                            distanceFactor={4}
                            position={[0, 2.8, 1.3]}
                            style={{ pointerEvents: interacting ? "auto" : "none" }}
                            transform
                            occlude={true} // Hard occlusion (cannot see through stone)
                            rotation={[0, 0, 0]}
                            scale={0.35} // Slightly reduced from 0.4 for better fit
                        >
                            <div style={{
                                width: "950px", // Reduced from 1600px to fit stone edges
                                padding: "60px",
                                fontFamily: "'Inter', sans-serif",
                                color: "#ffffff",
                                textAlign: "center",
                                background: "linear-gradient(135deg, #0d0d0d 0%, #1a1510 100%)",
                                border: "1px solid rgba(212, 163, 115, 0.2)", // Subtler border
                                // Deeper Inset shadow for "carved" look
                                boxShadow: "inset 0 0 120px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.8)",
                                borderRadius: "4px",
                            }}>
                                <div style={{ fontSize: "24px", color: "#d4a373", letterSpacing: "10px", textTransform: "uppercase", marginBottom: "20px", fontWeight: 800 }}>
                                    {icon} {content?.category ?? "artifact"}
                                </div>
                                <h1 style={{
                                    fontSize: "100px", // Adjusted for tighter width
                                    fontWeight: 900,
                                    margin: "0 0 20px 0",
                                    color: "#fff",
                                    letterSpacing: "-4px",
                                    lineHeight: 1,
                                    textShadow: "0 5px 20px rgba(0,0,0,0.8)"
                                }}>
                                    {content?.title}
                                </h1>
                                <div style={{ width: "150px", height: "6px", background: "#d4a373", margin: "0 auto 40px", boxShadow: "0 0 20px rgba(212, 163, 115, 0.4)" }} />
                                <p style={{
                                    fontSize: "48px", // Adjusted for tighter width
                                    color: "#ddd",
                                    lineHeight: "1.3",
                                    margin: "0 0 60px 0",
                                    fontWeight: 600,
                                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                                }}>
                                    {content?.description}
                                </p>

                                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px", marginBottom: "50px" }}>
                                    {content?.tags?.map((t) => (
                                        <span key={t} style={{
                                            border: "1px solid rgba(212, 163, 115, 0.4)",
                                            padding: "8px 25px",
                                            fontSize: "18px",
                                            color: "#d4a373",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                        }}>{t}</span>
                                    ))}
                                </div>

                                {content?.links?.map((l, i) => (
                                    <a
                                        key={i}
                                        href={l.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: "inline-block",
                                            padding: "15px 45px",
                                            background: "#d4a373",
                                            color: "#1a1510",
                                            textDecoration: "none",
                                            fontSize: "20px",
                                            fontWeight: 900,
                                            margin: "10px",
                                            letterSpacing: "2px",
                                            pointerEvents: interacting ? "auto" : "none",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        VISIT {l.label.toUpperCase()}
                                    </a>
                                ))}
                            </div>
                        </Html>
                    )}

                    {/* Interaction Prompts - Parented to group so it rises WITH the stone */}
                    {!paused && isInteractable && !interacting && !isRising && content?.id === activeZoneId && (
                        <Html center position={[0, -1, 2.0]} occlude={true} scale={0.3}>
                            <div style={{
                                background: "rgba(0,0,0,0.85)",
                                color: "#fff",
                                padding: "12px 30px",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: 900,
                                letterSpacing: "1.5px",
                                border: "3px solid #d4a373",
                                whiteSpace: "nowrap",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.7)"
                            }}>
                                PRESS <span style={{ color: "#d4a373" }}>E</span> TO INSPECT ARTIFACT
                            </div>
                        </Html>
                    )}
                    {/* Exit prompt — only shown on the ACTIVE inspected stone, right above the inscription */}
                    {!paused && interacting && content?.id === activeZoneId && (
                        <Html center position={[0, 5.0, 1.15]} occlude={true} scale={0.3}>
                            <div style={{
                                background: "rgba(211, 163, 115, 0.95)",
                                color: "#000",
                                padding: "12px 30px",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: 900,
                                letterSpacing: "1.5px",
                                whiteSpace: "nowrap",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
                            }}>
                                INSPECTING... PRESS <span style={{ textDecoration: "underline" }}>E</span> TO EXIT
                            </div>
                        </Html>
                    )}
                </group>
            </RigidBody>
        </group>
    );
});

/* ─── Main DiscoveryZone ─────────────────────────────────────── */
function DiscoveryZone({ id, position, carStateRef }) {
    const revealed = useDiscoveryStore((s) => s.revealedIds.has(id));
    const reveal = useDiscoveryStore((s) => s.reveal);
    const gameStarted = useDiscoveryStore((s) => s.gameStarted);
    const activeZoneId = useDiscoveryStore((s) => s.activeZoneId);
    const setActiveZone = useDiscoveryStore((s) => s.setActiveZone);
    const paused = useDiscoveryStore((s) => s.paused);

    const [progress, setProgress] = useState(0);
    const timerRef = useRef(0);
    const [isNear, setIsNear] = useState(false);

    const RADIUS = 3.2; // Strictly touching the ring (approx 3m)
    const PARK_TIME = 2.0;
    const content = CONTENT_MAP[id];

    useFrame((_, dt) => {
        if (!gameStarted || !carStateRef?.current) return;

        const car = carStateRef.current;
        const dx = car.position.x - position[0];
        const dz = car.position.z - position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        const near = dist < RADIUS;
        setIsNear(near);

        // Exclusive nearest logic
        if (near) {
            // If nothing is active, or we are the one, or we are closer (though overlap is rare)
            if (!activeZoneId || activeZoneId === id) {
                setActiveZone(id, position);
            }
        } else if (activeZoneId === id) {
            setActiveZone(null, null);
        }

        if (revealed) return;
        const isStopped = car.speed < 2.0;

        if (near && isStopped) {
            timerRef.current += dt;
            const p = Math.min(timerRef.current / PARK_TIME, 1);
            setProgress(p);
            if (p >= 1) reveal(id);
        } else {
            if (timerRef.current > 0) {
                timerRef.current = Math.max(0, timerRef.current - dt * 2.0);
                setProgress(Math.min(timerRef.current / PARK_TIME, 1));
            }
        }
    });

    if (!gameStarted) return null;
    if (revealed) {
        return <Monument position={position} content={content} isInteractable={isNear} />;
    }

    return (
        <group position={position}>
            {/* Minimal ground ring beacon */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                <torusGeometry args={[2.8, 0.05, 8, 48]} />
                <meshBasicMaterial color={progress > 0 ? "#ffcc00" : "#d4a373"} transparent opacity={0.4} />
            </mesh>
            {progress > 0 && (
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
                    <torusGeometry args={[2.5, 0.1, 8, 32, Math.PI * 2 * progress]} />
                    <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
                </mesh>
            )}

            {/* Pre-reveal labels with aggressive occlusion and distance check */}
            {!paused && (
                <Html
                    center
                    distanceFactor={8} // Makes it smaller/disappears when far
                    position={[0, 1.8, 0]}
                    style={{ pointerEvents: "none" }}
                    occlude={true} // Cannot see through rocks or hills
                >
                    <div style={{
                        color: progress > 0 ? "#ffcc00" : "#ffffff",
                        fontSize: "42px", // Increased for maximum visibility
                        fontWeight: 900,
                        letterSpacing: "8px",
                        textTransform: "uppercase",
                        background: "rgba(0,0,0,0.85)",
                        padding: "20px 50px",
                        borderRadius: "12px",
                        border: "4px solid rgba(212, 163, 115, 0.4)",
                        whiteSpace: "nowrap",
                        opacity: isNear ? 1 : 0.8,
                        textShadow: "0 4px 20px rgba(0,0,0,1)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
                    }}>
                        {progress > 0 ? (
                            <span style={{ color: "#ffcc00" }}>DECODING... {Math.round(progress * 100)}%</span>
                        ) : (
                            <span>{content?.category?.toUpperCase() ?? "ARTIFACT"} SITE</span>
                        )}
                    </div>
                </Html>
            )}
        </group>
    );
}

export default DiscoveryZone;
