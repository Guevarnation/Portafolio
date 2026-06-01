"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "../Preloader/Preloader";

/**
 * Decorative intro overlay. The page content now renders server-side
 * underneath this, so the preloader no longer blocks first paint / LCP — it
 * just plays on top and removes itself once its word animation completes.
 */
export default function IntroOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
      window.scrollTo(0, 0);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">{isLoading && <Preloader />}</AnimatePresence>
  );
}
