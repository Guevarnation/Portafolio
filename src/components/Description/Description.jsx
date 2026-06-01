"use client";

import styles from "./style.module.scss";
import { useInView, useReducedMotion, m } from "framer-motion";
import { useRef } from "react";
import { slideUp, opacity } from "./animation";
import Rounded from "../../common/RoundedButton/RoundedButton";
import { useTranslations } from "next-intl";

export default function Description() {
  const t = useTranslations("Description");
  const phrase = t("mainPhrase");
  const descriptionRef = useRef(null);
  const isInView = useInView(descriptionRef, { once: true });
  const prefersReducedMotion = useReducedMotion();
  const animateState = prefersReducedMotion || isInView ? "open" : "closed";

  return (
    <div ref={descriptionRef} id="description" className={styles.description}>
      <div className={styles.body}>
        <p>
          {phrase.split(" ").map((word, index) => {
            return (
              <span key={index} className={styles.mask}>
                <m.span
                  variants={slideUp}
                  custom={index}
                  initial="initial"
                  animate={animateState}
                  key={index}
                >
                  {word}
                </m.span>
              </span>
            );
          })}
        </p>
        <m.p variants={opacity} initial="initial" animate={animateState}>
          {t("secondaryText")}
        </m.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className={styles.button}>
            <p>{t("aboutMeButton")}</p>
          </Rounded>
        </div>
      </div>
    </div>
  );
}
