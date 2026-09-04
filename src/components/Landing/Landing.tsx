"use client";

import Image from "next/image";
import styles from "./style.module.scss";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { slideUp } from "./animation";
import { m, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useIntro } from "../IntroOverlay/IntroContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const xPercent = useRef(0);
  const direction = useRef(-1);

  const t = useTranslations();
  const { phase, skipped } = useIntro();

  useGSAP(
    () => {
      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 0,
          end: window.innerHeight,
          onUpdate: (e) => (direction.current = e.direction * -1),
        },
        x: "-500px",
      });

      const animate = () => {
        if (xPercent.current < -100) {
          xPercent.current = 0;
        } else if (xPercent.current > 0) {
          xPercent.current = -100;
        }
        gsap.set(firstText.current, { xPercent: xPercent.current });
        gsap.set(secondText.current, { xPercent: xPercent.current });
        xPercent.current += 0.1 * direction.current;
      };

      // gsap.ticker drives the marquee; useGSAP runs the returned cleanup on
      // unmount so the loop never leaks or duplicates under Strict Mode.
      gsap.ticker.add(animate);
      return () => gsap.ticker.remove(animate);
    },
    { scope: container }
  );

  return (
    <div className={styles.landingWrap}>
      <m.section
        ref={container}
        aria-labelledby="hero-title"
        data-hero=""
        variants={slideUp as unknown as Variants}
        custom={skipped}
        initial="initial"
        animate={phase === "done" ? "enter" : "initial"}
        className={styles.landing}
      >
      <Image
        src="/images/background2.jpg"
        alt="Eugenio Guevara - Full-stack developer workspace with modern technology setup"
        fill={true}
        preload
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.sliderContainer}>
        <div ref={slider} className={styles.slider}>
          <p ref={firstText}>{t("Index.FreelanceDeveloper")}</p>
          <p ref={secondText}>{t("Index.FreelanceDeveloper")}</p>
        </div>
      </div>
      <div className={styles.description}>
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
            fill="white"
          />
        </svg>
        {/* Single page <h1>: reads "Eugenio Guevara — Developer & Economist"
            for assistive tech and crawlers; visually only the two lines show. */}
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.srOnly}>Eugenio Guevara — </span>
          <span className={styles.line}>{t("Footer.Economist")}</span>{" "}
          <span className={styles.line}>{t("Footer.& Developer")}</span>
        </h1>
      </div>
      </m.section>
    </div>
  );
}
