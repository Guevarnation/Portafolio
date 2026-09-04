"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import "./menu.css";

interface MenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const EMAIL = "guevaraeu1@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Contact&body=Hi%20Eugenio,`;
const GITHUB_URL = "https://github.com/Guevarnation";
const LINKEDIN_URL = "https://www.linkedin.com/in/eugenio-guevara-a8417b20b/";

// In-page sections paired with their "Menu" translation keys.
const MENU_LINKS = [
  { id: "home", key: "home" },
  { id: "description", key: "about" },
  { id: "work", key: "work" },
  { id: "contact", key: "contact" },
] as const;

const Menu: React.FC<MenuProps> = ({ isMenuOpen, toggleMenu }) => {
  const t = useTranslations("Menu");
  const container = useRef<HTMLDivElement>(null);

  const tl = useRef<GSAPTimeline | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".menu-link-item-holder", { y: 75 });

      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })
        .to(".menu-link-item-holder", {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: -0.75,
        });
    },
    { scope: container }
  );

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
      tl.current?.play();
    } else {
      document.body.classList.remove("no-scroll");
      tl.current?.reverse();
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen]);

  // Real `href="#id"` anchors keep keyboard / middle-click semantics; a plain
  // left-click is intercepted so the overlay can animate closed first.
  // contextSafe: the close timeline is created after useGSAP ran, so this
  // keeps it inside the hook's context (reverted with the component).
  const handleLinkClick = contextSafe(
    (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    setTimeout(() => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView();
      }
    }, 0);

    gsap
      .timeline()
      .to(".menu-link-item-holder", {
        y: 75,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.in",
      })
      .to(
        ".menu-overlay",
        {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          ease: "power4.inOut",
          onComplete: toggleMenu,
        },
        "-=0.5"
      );
    }
  );

  return (
    <div className="menu-container" ref={container}>
      <div className="menu-overlay" id="site-menu">
        <div className="menu-overlay-bar">
          <div className="menu-logo">
            <Link href="/" className="menu-guevara">
              Guevara
            </Link>
          </div>
          <button type="button" className="menu-close" onClick={toggleMenu}>
            <span>{t("close")}</span>
          </button>
        </div>
        <div className="menu-close-icon" aria-hidden="true">
          <p>&#x1715;</p>
        </div>
        <div className="menu-copy">
          <nav className="menu-links" aria-label={t("mainNav")}>
            <div className="menu-link-item">
              {MENU_LINKS.map(({ id, key }) => (
                <div key={id} className="menu-link-item-holder">
                  <a
                    href={`#${id}`}
                    className="menu-link"
                    onClick={(e) => handleLinkClick(e, id)}
                  >
                    {t(key)}
                  </a>
                </div>
              ))}
            </div>
          </nav>
          <div className="menu-info">
            <div className="menu-info-col">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Github &#8599;
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn &#8599;
              </a>
            </div>
            <div className="menu-info-col">
              <a href={MAILTO}>{EMAIL}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
