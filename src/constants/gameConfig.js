/**
 * gameConfig.js — Central tuning file for all game constants.
 * Adjust these values to tweak game feel without touching component code.
 */

// ─────────────────────────────────────────────────────────────
// CAR PHYSICS
// ─────────────────────────────────────────────────────────────
export const CAR_ACCELERATION = 2.5;  // How fast the car speeds up
export const CAR_BRAKE_FORCE = 4.0;  // Braking strength
export const CAR_MAX_SPEED = 20;   // Max speed (m/s)
export const CAR_TURN_SPEED = 3.0;  // Turning rate

// ─────────────────────────────────────────────────────────────
// CAMERA — NORMAL DRIVING
// ─────────────────────────────────────────────────────────────
export const CAM_DEFAULT_DISTANCE = 14;   // Base follow distance behind car
export const CAM_DEFAULT_FOV = 70;   // Normal field of view
export const CAM_DEFAULT_PITCH = 0.4;  // Default camera pitch (radians)

// ─────────────────────────────────────────────────────────────
// CAMERA — INSPECTION MODE (when pressing E on a monument)
// ─────────────────────────────────────────────────────────────
export const INSPECT_DISTANCE = 12;  // Units in front of stone face  ← tune this for zoom
export const INSPECT_FOV = 25;  // Field of view during inspect  ← tune this for framing
export const INSPECT_CAM_Y_OFFSET = -0.5; // Vertical nudge of camera (negative = slightly lower)

// ─────────────────────────────────────────────────────────────
// DISCOVERY ZONES
// ─────────────────────────────────────────────────────────────
export const DISCOVERY_RADIUS = 3.2;  // Radius of the trigger ring (units)
export const DISCOVERY_PARK_TIME = 2.0;  // Seconds to park before monument rises
export const DISCOVERY_STOP_SPEED = 2.0; // Car speed considered "stopped" (m/s)
