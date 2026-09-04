import type { Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const opacity: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.6, delay: 0.1 },
  },
};

// Slide the curtain up with a transform (compositor-only, no layout).
export const slideUp: Variants = {
  initial: {
    y: 0,
  },
  exit: {
    y: "-100vh",
    transition: { duration: 0.6, ease: EASE, delay: 0.1 },
  },
};

// Path is in viewBox units (0-100 wide, 0-130 tall). y=100 is the bottom
// of the viewport; the control point at y=130 bulges the curtain 30vh
// below it and flattens on exit.
export const curve: Variants = {
  initial: {
    d: "M0 0 L100 0 L100 100 Q50 130 0 100 L0 0",
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    d: "M0 0 L100 0 L100 100 Q50 100 0 100 L0 0",
    transition: { duration: 0.5, ease: EASE, delay: 0.15 },
  },
};
