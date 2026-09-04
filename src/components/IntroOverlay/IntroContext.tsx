"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/** Keep in sync with the inline script in app/[locale]/layout.tsx. */
export const INTRO_SESSION_KEY = "intro-seen";
/** Time the greeting words cycle before the curtain starts to exit. */
export const INTRO_DURATION_MS = 1200;
/** Preloader exit (see Preloader/anim.ts: 0.1 s delay + 0.6 s slide). */
export const INTRO_EXIT_MS = 700;

export type IntroPhase =
  | "pending" // first render, before the effect decides
  | "playing" // curtain visible, words cycling
  | "done"; // curtain exiting or gone

interface IntroState {
  phase: IntroPhase;
  /** True when the intro was skipped (repeat visit / reduced motion). */
  skipped: boolean;
}

const IntroCtx = createContext<IntroState>({ phase: "pending", skipped: false });

/**
 * Single owner of the intro timeline. The overlay and anything that should
 * enter in sync with the curtain (the hero) read from this instead of
 * guessing with hardcoded delays. The first render is identical on server
 * and client; the decision happens in an effect.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IntroState>({
    phase: "pending",
    skipped: false,
  });

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {
      // Storage can throw (private mode); treat as unseen.
    }
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ phase: "done", skipped: true });
      return;
    }

    setState({ phase: "playing", skipped: false });
    const timer = setTimeout(() => {
      // Mark as seen only once the intro actually finished; writing it up
      // front made StrictMode's double effect run skip the intro in dev.
      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        // Ignore; the intro simply plays again next time.
      }
      setState({ phase: "done", skipped: false });
    }, INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return <IntroCtx.Provider value={state}>{children}</IntroCtx.Provider>;
}

export function useIntro() {
  return useContext(IntroCtx);
}
