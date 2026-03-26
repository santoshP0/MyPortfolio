const COLOR_BASE = Object.freeze({
  ink: "#141420",
  nmSurface: "#191926",
  nmSurfaceRaised: "#1e1e2e",
  paper: "#e2e2f0",
  accent: "#ff005d",
  paperSoft: "rgba(226, 226, 240, 0.75)",
  paperFaint: "rgba(226, 226, 240, 0.10)",
  accentSoft: "rgba(255, 0, 93, 0.50)",
  accentGlow: "rgba(255, 0, 93, 0.22)",
});

export const COLOR_TOKENS = Object.freeze({
  ...COLOR_BASE,
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
});

export const TYPOGRAPHY = Object.freeze({
  heading: "'Orbitron', sans-serif",
  body: "'Inter', 'Rajdhani', sans-serif",
});

export const MOTION = Object.freeze({
  defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
  fast: 0.2,
  base: 0.3,
  relaxed: 0.5,
});

export const THEME = Object.freeze({
  colors: COLOR_TOKENS,
  typography: TYPOGRAPHY,
  motion: MOTION,
});

export default THEME;
