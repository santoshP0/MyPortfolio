const COLOR_BASE = Object.freeze({
  ink: "#050505",
  paper: "#f5f5f5",
  accent: "#ff005d",
  paperSoft: "rgba(245, 245, 245, 0.82)",
  paperFaint: "rgba(245, 245, 245, 0.12)",
  accentSoft: "rgba(255, 0, 93, 0.6)",
});

export const COLOR_TOKENS = Object.freeze({
  ...COLOR_BASE,
  success: "#21c486",
  warning: "#ffb400",
  danger: "#ff5050",
});

export const TYPOGRAPHY = Object.freeze({
  heading: "'Orbitron', sans-serif",
  body: "'Rajdhani', sans-serif",
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
