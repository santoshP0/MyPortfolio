# 🏎️ Memory 02: Custom Arcade Car Physics

> **Focus:** The custom stable controller for driving on rough terrain.

## 🎯 The Problem
Standard RigidBody vehicle physics (forces/torques) often lead to "flipping" or "spinning out" when hitting procedural dunes at high speed. It feels too light and unpredictable for a portfolio experience.

## 🛠️ The "Bulletproof" Solution
We implemented a 100% manually controlled physics handler inside `Car.jsx` `useFrame`:

### 1. Zero Rotation Lock
- **`setEnabledRotations(false, true, false)`**: Rapier is told only the Y-axis (Yaw) can move.
- **Force Correction**: Every frame, we manually set `rb.setRotation({ x: 0, y: yaw, z: 0 })`. This prevents the car from ever rolling over or pitching up permanently due to physics collisions.

### 2. Manual Yaw & Steering
- We don't apply torque. We maintain a `yaw` ref.
- Pressing A/D increments this ref. The car is then rotated to match this yaw exactly.
- This provides "surgical" steering that feels like a toy car.

### 3. Velocity Mapping
- We calculate a forward vector `_fwd` from the `yaw`.
- Linear velocity is set directly: `rb.setLinvel({ x: _fwd.x * spd, y: gravity, z: _fwd.z * spd })`.
- This ensures the car always moves exactly where it's pointing.

### 4. Terrain Snapping
- To prevent the car from falling through the floor or "flying" off dunes, we hard-set the Y position:
- `rb.setTranslation({ x: pos.x, y: terrainHeight + OFFSET, z: pos.z })`.
- This creates the "locked-to-ground" feel common in arcade racers.

### 5. Visual Pitch (Faking Gravity)
- Even though the physics body is perfectly upright, we sample the terrain 1.2m in front of the car.
- We calculate the angle between the center and the front point and apply it as a **visual-only pitch** to the car mesh.
- This makes the car's nose point up/down hills while the physics stay stable.
