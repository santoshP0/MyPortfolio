import React, { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useObjectStore } from "../store/useObjectStore";
import { portfolioData } from "../data/portfolioData";

function buildContentMap() {
    const map = { [portfolioData.contact.id]: portfolioData.contact };
    for (const arr of [portfolioData.projects, portfolioData.skills, portfolioData.experience])
        for (const item of arr) map[item.id] = item;
    return map;
}
const CONTENT_MAP = buildContentMap();
const ICONS = { project: "🗿", skill: "📦", experience: "🪧", contact: "📡" };

/**
 * A single permanent in-world panel that replaces a destroyed object.
 * Rotates slowly, glows, and shows portfolio info via Html.
 */
const RevealedPanel = memo(({ obj }) => {
    const content = CONTENT_MAP[obj.portfolioItemId];
    const cubeRef = useRef();
    const ringRef = useRef();

    useFrame((_, delta) => {
        if (cubeRef.current) cubeRef.current.rotation.y += delta * 0.7;
        if (ringRef.current) ringRef.current.rotation.z += delta * 1.2;
    });

    if (!content) return null;

    // Lift panel 2 units above where the object was
    const py = (obj.position?.[1] ?? 0) + 2;

    return (
        <group position={[obj.position[0], py, obj.position[2]]}>
            {/* Glowing golden cube */}
            <mesh ref={cubeRef} castShadow>
                <boxGeometry args={[0.75, 0.75, 0.75]} />
                <meshStandardMaterial
                    color="#ff8800"
                    emissive="#ff5500"
                    emissiveIntensity={1.2}
                    metalness={0.6}
                    roughness={0.3}
                />
            </mesh>

            {/* Spinning halo ring */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.6, 0.04, 8, 40]} />
                <meshBasicMaterial color="#ffdd00" transparent opacity={0.7} />
            </mesh>

            {/* Vertical beam of light */}
            <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[0.04, 0.02, 3, 6]} />
                <meshBasicMaterial color="#ff8800" transparent opacity={0.3} />
            </mesh>

            {/* HTML info card — always faces camera (default Html behaviour) */}
            <Html
                center
                distanceFactor={6}
                position={[0, 1.6, 0]}
                style={{ pointerEvents: "none", userSelect: "none" }}
            >
                <div style={{
                    width: 210, padding: "11px 13px",
                    background: "rgba(12,5,0,0.93)",
                    border: "1px solid rgba(255,140,30,0.45)",
                    borderRadius: 8,
                    fontFamily: "'Segoe UI', sans-serif",
                    boxShadow: "0 0 18px rgba(255,140,0,0.25)",
                }}>
                    <div style={{ fontSize: 8, color: "#ff9900", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4 }}>
                        {ICONS[content.category] ?? "✨"} {content.category}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.25 }}>
                        {content.title}
                    </div>
                    <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255,140,30,0.4), transparent)", marginBottom: 6 }} />
                    <div style={{ fontSize: 9.5, color: "#bbb", lineHeight: 1.6, marginBottom: 7 }}>
                        {content.description?.slice(0, 100)}{content.description?.length > 100 ? "…" : ""}
                    </div>
                    {content.tags?.slice(0, 4).map((t) => (
                        <span key={t} style={{
                            display: "inline-block", marginRight: 3, marginBottom: 3,
                            background: "rgba(255,140,0,0.12)", border: "1px solid rgba(255,140,0,0.3)",
                            borderRadius: 20, padding: "1px 6px", fontSize: 8, color: "#ffcc88",
                        }}>{t}</span>
                    ))}
                    {content.company && (
                        <div style={{ fontSize: 8.5, color: "#666", marginTop: 5 }}>🏢 {content.company}</div>
                    )}
                    {content.links?.slice(0, 2).map((l, i) => (
                        <div key={i} style={{ fontSize: 8, color: "#ff9944", marginTop: 3 }}>
                            → {l.label}
                        </div>
                    ))}
                </div>
            </Html>
        </group>
    );
});

RevealedPanel.displayName = "RevealedPanel";

/** Renders permanent info panels for all destroyed objects */
function RevealedPanels() {
    const objects = useObjectStore((s) => s.objects);
    const revealed = useMemo(() => objects.filter((o) => o.revealed), [objects]);
    return <>{revealed.map((obj) => <RevealedPanel key={obj.id} obj={obj} />)}</>;
}

export default RevealedPanels;
