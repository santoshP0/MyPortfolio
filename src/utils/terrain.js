/**
 * Deterministic terrain height function.
 * Used by Desert.jsx for mesh displacement and by App.jsx for object placement.
 * 
 * Returns the y-height of the desert surface at world position (x, z).
 * Max height ≈ 4.3, min ≈ -4.3 — gentle rolling Thar desert dunes.
 */
export function terrainHeight(x, z) {
    return (
        Math.sin(x * 0.06 + 0.3) * Math.cos(z * 0.05 + 0.1) * 1.8 +
        Math.sin(x * 0.14 + 0.7) * Math.sin(z * 0.11 + 0.4) * 0.9 +
        Math.cos(x * 0.03 + 1.1) * Math.cos(z * 0.04 + 0.9) * 2.2 +
        Math.sin((x + z) * 0.038 + 0.5) * 0.7
    );
}
