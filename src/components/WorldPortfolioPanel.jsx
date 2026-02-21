import React, { useRef, useEffect, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioPanelStore } from "../store/usePortfolioPanelStore";
import { portfolioData } from "../data/portfolioData";

// Build a flat lookup from all portfolio sections
function buildContentMap() {
    const map = { [portfolioData.contact.id]: portfolioData.contact };
    for (const arr of [portfolioData.projects, portfolioData.skills, portfolioData.experience]) {
        for (const item of arr) map[item.id] = item;
    }
    return map;
}
const CONTENT_MAP = buildContentMap();

const ICONS = { project: "🗿", skill: "📦", experience: "🪧", contact: "📡" };

/**
 * Animated in-world portfolio panel.
 * Rises from the destroyed object's position.
 * Closed by pressing E — game never pauses.
 */
const RisingPanel = memo(({ position, content, onClose }) => {
    const groupRef = useRef();
    const targetY = position[1] + 5;

    // E key closes without touching pointer lock or pausing
    useEffect(() => {
        const handler = (e) => { if (e.code === "KeyE") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.y = THREE.MathUtils.lerp(
                groupRef.current.position.y, targetY, 0.05
            );
        }
    });

    const icon = ICONS[content.category] ?? "✨";

    return (
        <group ref={groupRef} position={[position[0], position[1], position[2]]}>
            {/* Orange glow border (drawn behind the panel) */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[3.3, 4.1]} />
                <meshBasicMaterial color="#ff8800" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            {/* Dark backing card */}
            <mesh position={[0, 0, -0.06]}>
                <planeGeometry args={[3.1, 3.9]} />
                <meshBasicMaterial color="#0d0500" transparent opacity={0.93} side={THREE.DoubleSide} />
            </mesh>

            {/* HTML content overlay — positioned in front of the backing card */}
            <Html
                center
                distanceFactor={7}
                position={[0, 0, 0.05]}
                style={{ pointerEvents: "none", userSelect: "none" }}
            >
                <div style={{
                    width: 260, padding: "16px 18px",
                    fontFamily: "'Segoe UI', sans-serif",
                    color: "#fff", textAlign: "left",
                }}>
                    {/* Category tag */}
                    <div style={{ fontSize: 9, color: "#ff9900", letterSpacing: 3, textTransform: "uppercase", marginBottom: 5 }}>
                        {icon} {content.category ?? "portfolio"}
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25, marginBottom: 9 }}>
                        {content.title}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255,140,30,0.5), transparent)", marginBottom: 9 }} />

                    {/* Description */}
                    <div style={{ fontSize: 11, color: "#ccc", lineHeight: 1.65, marginBottom: 11 }}>
                        {content.description}
                    </div>

                    {/* Tags */}
                    {content.tags?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                            {content.tags.map((t) => (
                                <span key={t} style={{
                                    background: "rgba(255,140,0,0.15)",
                                    border: "1px solid rgba(255,140,0,0.35)",
                                    borderRadius: 20, padding: "2px 7px",
                                    fontSize: 9, color: "#ffcc88", fontWeight: 600,
                                }}>{t}</span>
                            ))}
                        </div>
                    )}

                    {/* Company */}
                    {content.company && (
                        <div style={{ fontSize: 10, color: "#888", marginBottom: 9 }}>
                            🏢 {content.company}
                        </div>
                    )}

                    {/* Links as text (pointer lock prevents clicking) */}
                    {content.links?.map((l, i) => (
                        <div key={i} style={{ fontSize: 10, color: "#ff9944", marginBottom: 3 }}>
                            → {l.label}: <span style={{ color: "#ffd080" }}>{l.url}</span>
                        </div>
                    ))}

                    {/* Close hint */}
                    <div style={{
                        marginTop: 12, fontSize: 9, color: "#555", textAlign: "center",
                        borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 8,
                    }}>
                        Press <strong style={{ color: "#ffcc88" }}>E</strong> to close &amp; continue driving
                    </div>
                </div>
            </Html>
        </group>
    );
});

function WorldPortfolioPanel() {
    const activeId = usePortfolioPanelStore((s) => s.activePortfolioItemId);
    const panelPosition = usePortfolioPanelStore((s) => s.panelPosition);
    const onClose = usePortfolioPanelStore((s) => s.clearactivePortfolioItemId);

    const content = useMemo(() => (activeId ? CONTENT_MAP[activeId] : null), [activeId]);

    if (!activeId || !panelPosition || !content) return null;

    return <RisingPanel position={panelPosition} content={content} onClose={onClose} />;
}

export default WorldPortfolioPanel;
