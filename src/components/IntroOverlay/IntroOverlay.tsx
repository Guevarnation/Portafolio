"use client";

import { AnimatePresence } from "framer-motion";
import Preloader from "../Preloader/Preloader";
import { useIntro } from "./IntroContext";

/**
 * Decorative intro curtain. Page content renders server-side underneath, so
 * it never blocks first paint / LCP. Timing lives in IntroContext; on repeat
 * visits (or reduced motion) the inline script in app/[locale]/layout.tsx
 * hides `[data-intro-overlay]` before first paint and the provider reports
 * `skipped`, so nothing animates.
 */
export default function IntroOverlay() {
  const { phase, skipped } = useIntro();
  if (skipped) return null;
  return (
    <AnimatePresence>
      {phase !== "done" && <Preloader />}
    </AnimatePresence>
  );
}
