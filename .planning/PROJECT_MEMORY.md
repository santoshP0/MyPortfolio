# 🗺️ Project Memory — Ancient Ruins Portfolio Game

> **Last Updated:** 2026-02-22
> **Dev Server:** `npm run dev` → `http://localhost:3000`
> **Framework:** React + React Three Fiber (R3F) + Rapier physics + Zustand
> **Build Tool:** Vite

---

## 🎯 Project Concept

A 3D interactive portfolio disguised as a mini open-world **driving game** set in a Thar desert. The user drives a car through the desert. When they park inside discovery rings, ancient stone monoliths rise from the ground revealing portfolio content (projects, skills, experience, contact).

**Original concept (pivoted away from):** Shooting bullets to destroy objects and reveal content.
**Current concept:** Drive car → park in ring → monument rises → read inscription.

---

## 🗂️ Key Files

| File | Purpose |
|---|---|
| `src/App.jsx` | Root: Canvas, lighting, physics, keyboard controls, zone layout |
| `src/components/Car.jsx` | Car model, physics (Rapier), camera follow, controls, audio |
| `src/components/Desert.jsx` | Terrain mesh, sand texture, Sky, sun directional light |
| `src/components/DiscoveryZone.jsx` | Discovery rings, monument rising, inscription HTML, physics |
| `src/components/EnvironmentClutter.jsx` | Scatter rocks, pillars, arches throughout desert |
| `src/components/PauseSystem.jsx` | Pause menu overlay (ESC key) |
| `src/components/IntroOverlay.jsx` | Start screen ("Click to Begin") |
| `src/components/ControlsHUD.jsx` | Key hints bottom-right corner |
| `src/store/useDiscoveryStore.js` | Zustand store: revealed sites, active zone, paused, interacting |
| `src/store/useAudioStore.js` | Zustand: engine/ambient volume |
| `src/data/portfolioData.js` | All portfolio content: projects, skills, experience, contact |
| `src/utils/terrain.js` | `terrainHeight(x, z)` — procedural sand dunes height function |

---

## 🏗️ Architecture

### Physics (Rapier)
- `<RigidBody type="kinematicPosition">` for monuments **while rising**
- `<RigidBody type="fixed">` for monuments **after rising** — solid wall, car cannot pass
- `sensor={isRising}` — monument is ghost while animating up, becomes solid when done
- `<CuboidCollider args={[2.1, 4.25, 1.1]}>` — explicit collider aligned to stone geometry
- Car uses `CuboidCollider args={[0.7, 0.45, 1.4]}` for its hitbox

### Camera
- Custom orbit camera in `Car.jsx` `useFrame` — no `OrbitControls`
- Mouse drag to orbit around car
- Auto-recenters behind car when driving fast (>2 m/s) and mouse idle >1.2s
- Smooth zoom: `state.camera.fov` lerped. Zoom-in to monument on interact (FOV 30, dist 3m)
- **Paused:** mouse movement and scroll are ignored; camera stays frozen

### Discovery System Flow
1. Car enters 3.2-unit radius ring around zone position
2. `progress` timer fills over 2.0 seconds while car is stationary
3. When `progress >= 1`, `reveal(id)` is called → monument rises
4. Monument is sensor/ghost during `isRising`, solid after
5. Car press `E` near revealed monument → `interacting = true` → camera zooms in, inscription shown
6. Press `E` again → exit interaction

### Pause System
- `ESC` key toggles `paused` in `useDiscoveryStore`
- `Car.jsx` reads `paused` — freezes mouse orbit, blocks scroll zoom, stops driving input, exits pointer lock
- `DiscoveryZone.jsx` reads `paused` — hides all world-space HTML labels

---

## 🎨 Visual Design

### Inscription Panel (on monument face)
- `<Html scale={0.35} distanceFactor={4} occlude={true} transform>`
- Width: 950px, padding: 60px
- Background: dark gradient `#0d0d0d → #1a1510`
- Border: `1px solid rgba(212, 163, 115, 0.2)` (very subtle)
- Shadow: `inset 0 0 120px rgba(0,0,0,1)` — deep "carved" look
- Title: 100px, bold. Description: 48px. Category: 24px.

### Discovery Site Labels (pre-reveal)
- Content-specific: `${content.category.toUpperCase()} SITE` → **"PROJECT SITE"**, **"SKILL SITE"**, etc.
- Decoding: `DECODING... XX%` in gold (`#ffcc00`)
- Font: 42px, letterSpacing 8px, gold border, dark background

### Interaction Prompts
- `PRESS E TO INSPECT ARTIFACT` — scaled 0.3, gold border
- `INSPECTING... PRESS E TO EXIT` — gold background, black text

### Environment
- Sun light: `Desert.jsx` directional at `[40, 40, 20]`, intensity 2.8
- Shadow frustum: 60-unit box, mapSize 2048×2048
- Sky: `<Sky sunPosition={[120, 4, -40]}` — golden hour feel
- Car shadows: mesh traversal `castShadow = true` on all car meshes

---

## 📦 Portfolio Data Structure (`src/data/portfolioData.js`)

```js
portfolioData = {
  projects: [{ id, title, description, category: "project", tags, links }],
  skills:   [{ id, title, description, category: "skill",   tags }],
  experience: [{ id, title, description, category: "experience", tags }],
  contact:  { id, title, description, category: "contact",  links }
}
```

Zone IDs mapped in `App.jsx`:
```js
const ZONE_DATA = [
  [-10, -20, "project1"],   [12, -25, "skill1"],
  [-18, -6, "experience1"], [18, -6, "contact"],
  [0, -35, "project2"],     [3, -12, "skill2"],
  [-10, -35, "experience2"],
];
```

---

## ✅ Completed Features

- [x] Terrain with procedural dunes & sand texture
- [x] Car model (GLTF) with arcade physics & full shadow casting
- [x] Smooth third-person orbit camera with mouse drag
- [x] Discovery ring → park to decode → monument risling
- [x] Solid post-rise collision (RigidBody type switch: kinematic → fixed)
- [x] Inscription HTML on stone face with "carved" inset aesthetic
- [x] Content-specific site labels (PROJECT SITE / SKILL SITE / etc.)
- [x] Ultra-visible 42px decoding labels with gold border
- [x] Hard occlusion on all world-space HTML (hides behind geometry)
- [x] Pause system with full camera lock (ESC)
- [x] Engine audio with speed-based volume/pitch modulation
- [x] Ambient desert audio
- [x] Intro overlay ("Click to Begin"), Controls HUD
- [x] Sand trail particle effect behind car wheels
- [x] Environment clutter (ruins, pillars, arches, rocks)

---

## 🐛 Known Issues / Active

- [ ] Car shadow visibility may vary depending on sun angle — directional light in `Desert.jsx` at `[40, 40, 20]`
- [ ] `distanceFactor` on Html labels means they scale with distance — may appear too large up close or too small far away — tune as needed

---

## ⚡ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
