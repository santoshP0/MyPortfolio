# 🏎️ Memory 03: Ferrari 458 Integration & Visual Polish

> **Focus:** Materials, Asset Specifics, and Final Aesthetic Fixes.

## 📦 Asset Specs
- **Model**: `ferrari.glb` (Three.js standard example).
- **Scale**: Final value **0.75** (upgraded from 0.45 for better presence).
- **Positioning**: Default position offset `[0, -0.75, 0]` to ensure wheels ground correctly.
- **Ground Offset**: `GROUND_Y_OFF = 0.52` for perfect sand surface alignment.
- **Starting Yaw**: Set to `Math.PI` so it faces the monuments immediately.

## ✨ Visual Enhancements
- **Environment Map**: Added `<Environment preset="sunset" />` in `App.jsx`. This is the single biggest factor in the "metallic" look.
- **Materials**: 
    - Forced `metalness: 1.0` and `roughness: 0.05` on all body meshes.
    - Set `envMapIntensity: 3.5` for high-gloss reflections.
    - Applied specific "Ferrari Red" tint.
- **Grounding**: Added `<ContactShadows />` to provide a soft "ambient occlusion" shadow directly under the car.

- **Keyword Filtering**: Logic searches for `rim_`, `tire_`, and `wheel_`.
- **Exclusion List**: Meshes containing `chassis`, `body`, `car`, `paint`, `mirror`, `interior`, `door`, `steering`, `seat`, `dashboard`, `brake`, or `frame` are strictly ignored.
- **Bending Fix**: Initial rotations are cached in `userData.origRot` and added to during spin/steer. This prevents wheels from twisting unnaturally.
- **Spin Math**: `rollDist.current += spd * dt * WHEEL_SPIN`. Spin speed `-12.0`.
- **Steering Animation**: Front wheels are identified by checking their local Z-position. If `pos.z > 0.1` (front of car center), they receive the `rotation.y` steering lerp.

## 🔊 Audio Engineering
- **Engine Loop**: Small, efficient MP3 loop.
- **Dynamic Pitch**: Base `0.85` + Speed-linked `0.25` range. This prevents the "whining" high-pitch noise at max speed.
- **Subtle Volume**: Base low volume (`0.08 - 0.15`) keeping it background-friendly and not distracting from the portfolio content.
