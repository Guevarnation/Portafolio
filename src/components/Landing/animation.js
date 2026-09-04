// The hero is revealed as the intro curtain lifts. `enter` is triggered by
// IntroContext (not a hardcoded delay), so it stays in sync with the
// preloader and starts instantly when the intro is skipped.
export const slideUp = {
  initial: { y: 300 },
  enter: (skipped) => ({
    y: 0,
    transition: skipped
      ? { duration: 0 }
      : { duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.25 },
  }),
};
