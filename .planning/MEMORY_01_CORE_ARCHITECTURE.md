# 🏗️ Memory 01: Core Architecture & Systems

> **Focus:** Terrain, Discovery Zones, and Base Project Structure.

## 🎯 Concept
A 3D "Driving Portfolio" set in a desert. Instead of scrolling, the user drives to "Discovery Zones" where ancient monuments rise to reveal content.

## 🗺️ Terrain System (`src/utils/terrain.js`)
- **Procedural Dunes**: Uses a custom math function in `terrainHeight(x, z)` to generate dunes.
- **Mesh generation**: `Desert.jsx` creates a `PlaneGeometry` and pulls vertex Y positions from the terrain utility.
- **Efficiency**: The function is deterministic, allowing both the visual mesh and the physics engine to stay in sync without complex heightmaps.

## 🏺 Discovery System (`src/components/DiscoveryZone.jsx`)
- **Proximity Logic**: Uses Euclidean distance between car and zone center (3.2m radius).
- **Progress Timer**: Car must stay near a zone for 2 seconds (0 -> 1 progress) to "decode" and trigger the rise.
- **Monument Animation**:
    - Uses `lerp` for the visual mesh position.
    - Physics transitions from `kinematicPosition` (rising) to `fixed` (solid wall) once complete.
    - `sensor={isRising}` ensures the car doesn't get stuck inside the stone while it's emerging.

## 📜 UI & Inscription Aesthetics
- **Design**: Inset "carved" look using inner shadows and gradients.
- **Tech**: React Three Fiber `<Html />` component.
- **Occlussion**: `occlude={true}` is critical—it ensures the UI panel disappears behind the stone geometry correctly.
