import { useRef } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "../Magnetic/Magnetic";

/**
 * Animated pill button. Renders a `div` by default; pass `as="a"` or
 * `as="button"` to get a real interactive element (keyboard focusable,
 * valid ARIA host) while keeping the same visuals.
 */
export default function RoundedButton({
  children,
  backgroundColor = "#000",
  as: Component = "div",
  className,
  ...attributes
}) {
  const circle = useRef(null);
  const timeline = useRef(null);
  const timeoutId = useRef(null);
  useGSAP(() => {
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(
        circle.current,
        { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" },
        "enter"
      )
      .to(
        circle.current,
        { top: "-150%", width: "125%", duration: 0.25 },
        "exit"
      );
  });

  // Plain event handlers (not contextSafe-wrapped): the React Compiler lint
  // rule forbids passing a ref-reading closure to a function during render,
  // and these only drive the timeline created inside useGSAP above, which is
  // already owned by its context and reverted on unmount.
  const manageMouseEnter = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeline.current?.tweenFromTo("enter", "exit");
  };

  const manageMouseLeave = () => {
    timeoutId.current = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  // A consumer-supplied className replaces the default pill styling (the
  // Header burger and the circular CTAs rely on this), matching the previous
  // spread semantics. Interactive elements get a small UA-style reset.
  const classes = [
    Component !== "div" ? styles.reset : null,
    className ?? styles.roundedButton,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Magnetic>
      <Component
        className={classes}
        style={{ overflow: "hidden" }}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...attributes}
      >
        {children}
        {/* span (phrasing content) so the markup stays valid inside <button>/<a>. */}
        <span
          ref={circle}
          style={{ backgroundColor }}
          className={styles.circle}
          aria-hidden="true"
        />
      </Component>
    </Magnetic>
  );
}
