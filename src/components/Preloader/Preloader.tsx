"use client";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { slideUp, curve } from "./anim";

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "Hallo",
];

/**
 * Dark curtain with cycling greetings. The overlay is `position: fixed;
 * inset: 0` and the exit curve is drawn in a fixed viewBox stretched with
 * `preserveAspectRatio="none"`, so nothing here depends on window size and
 * the component never re-renders on mount (no layout shifts, no dimension
 * state, identical server/client markup).
 */
export default function Preloader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === words.length - 1) return;
    const timeout = setTimeout(
      () => setIndex((i) => i + 1),
      index === 0 ? 450 : 100
    );
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <m.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
      aria-hidden="true"
      data-intro-overlay=""
    >
      <p>
        <span></span>
        {words[index]}
      </p>
      <svg viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true">
        <m.path
          variants={curve}
          initial="initial"
          exit="exit"
        />
      </svg>
    </m.div>
  );
}
