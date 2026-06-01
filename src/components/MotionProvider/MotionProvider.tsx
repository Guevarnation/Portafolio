"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads only the DOM animation feature set (~15kb) lazily and enables `strict`
 * mode, which forces the lightweight `m` component everywhere (a stray
 * `motion.*` throws). This keeps the full ~34kb `motion` bundle out of the
 * initial load — the project uses no drag/layout/pan features.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
