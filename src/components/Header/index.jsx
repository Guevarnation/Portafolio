"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "../../common/RoundedButton/RoundedButton";
import Magnetic from "../../common/Magnetic/Magnetic";
import { useTranslations } from "next-intl";
import "./menu.css";
import Menu from "./Menu";
// import LocalSwitcher from "./localeSwitcher/local-switcher";

export default function Header({}) {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  const t = useTranslations("Index");

  useEffect(() => {
    if (isActive) {
      setIsActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          gsap.to(button.current, {
            scale: 0,
            duration: 0.25,
            ease: "power1.out",
            onComplete: () => {
              setIsActive(false);
            },
          });
        },
      },
    });
  }, []);

  return (
    <>
      <div ref={header} className={styles.header} id="home">
        <div className={styles.logo}>
          <p className={styles.copyright}>©</p>
          <div className={styles.name}>
            <p className={styles.codeBy}>{t("CodeBy")}</p>
            <p className={styles.eugenio}>Eugenio</p>
            <p className={styles.guevara}>Guevara</p>
          </div>
        </div>
        <div className={styles.nav}>
          {/* <LocalSwitcher /> */}
          <Magnetic>
            <div className={styles.el}>
              <a
                href="#description"
                onClick={(e) => {
                  e.preventDefault();
                  const descriptionElement =
                    document.getElementById("description");
                  if (descriptionElement) {
                    descriptionElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t("About")}
              </a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  const descriptionElement = document.getElementById("work");
                  if (descriptionElement) {
                    descriptionElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t("Work")}
              </a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const descriptionElement = document.getElementById("contact");
                  if (descriptionElement) {
                    descriptionElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t("Contact")}
              </a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
        </div>
      </div>
      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded
          onClick={() => {
            setIsActive(!isActive);
          }}
          className={`${styles.button}`}
        >
          <div
            className={`${styles.burger} ${
              isActive ? styles.burgerActive : ""
            }`}
          ></div>
        </Rounded>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <Menu isMenuOpen={isActive} toggleMenu={toggleMenu} />}
      </AnimatePresence>
    </>
  );
}
