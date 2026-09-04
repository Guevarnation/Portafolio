"use client";

import { useRef, useState } from "react";
import styles from "./style.module.scss";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "../../common/RoundedButton/RoundedButton";
import Magnetic from "../../common/Magnetic/Magnetic";
import { useTranslations } from "next-intl";
import "./menu.css";
import Menu from "./Menu";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Section ids on the page paired with their "Index" translation keys.
const NAV_LINKS = [
  { id: "description", labelKey: "About" },
  { id: "work", labelKey: "Work" },
  { id: "contact", labelKey: "Contact" },
];

// Keep the real `href="#id"` (keyboard, middle-click, copy-link all work);
// left-clicks get a smooth scroll instead of the default jump.
const scrollToSection = (event, id) => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth" });
};

export default function Header({}) {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  const t = useTranslations("Index");
  const tMenu = useTranslations("Menu");

  // Close the menu when the route changes. Adjusting state during render is
  // the React-recommended replacement for a setState-in-effect on a prop
  // change (react-hooks/set-state-in-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isActive) setIsActive(false);
  }

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  useGSAP(() => {
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
        <nav className={styles.nav} aria-label={tMenu("mainNav")}>
          {NAV_LINKS.map(({ id, labelKey }) => (
            <Magnetic key={id}>
              <div className={styles.el}>
                <a href={`#${id}`} onClick={(e) => scrollToSection(e, id)}>
                  {t(labelKey)}
                </a>
                <div className={styles.indicator}></div>
              </div>
            </Magnetic>
          ))}
        </nav>
      </div>
      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded
          as="button"
          type="button"
          onClick={toggleMenu}
          className={`${styles.button}`}
          aria-label={isActive ? tMenu("close") : tMenu("open")}
          aria-expanded={isActive}
        >
          <span
            className={`${styles.burger} ${
              isActive ? styles.burgerActive : ""
            }`}
          ></span>
        </Rounded>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <Menu isMenuOpen={isActive} toggleMenu={toggleMenu} />}
      </AnimatePresence>
    </>
  );
}
