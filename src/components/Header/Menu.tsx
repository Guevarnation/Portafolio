"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import "./menu.css";

interface MenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

// const menuLinks = [
//   { path: "/", label: "Home" },
//   { path: "/about", label: "About" },
//   { path: "/work", label: "Work" },
//   { path: "/contact", label: "Contact" },
// ];

const Menu: React.FC<MenuProps> = ({ isMenuOpen, toggleMenu }) => {
  const container = useRef<HTMLDivElement>(null);

  const tl = useRef<GSAPTimeline | null>(null);

  const handleEmailClick = () => {
    window.location.href =
      "mailto:guevaraeu1@gmail.com?subject=Portfolio Contact&body=Hi Eugenio,";
  };

  useGSAP(
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

  const handleLinkClick = (sectionId: string) => {
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
  };

  return (
    <div className="menu-container" ref={container}>
      <div className="menu-overlay">
        <div className="menu-overlay-bar">
          <div className="menu-logo">
            <Link href="/" className="menu-guevara">
              Guevara
            </Link>
          </div>
          <div className="menu-close" onClick={toggleMenu}>
            <p>Cerrar</p>
          </div>
        </div>
        <div className="menu-close-icon">
          <p>&#x1715;</p>
        </div>
        <div className="menu-copy">
          <div className="menu-links">
            <div className="menu-link-item">
              <div
                className="menu-link-item-holder"
                onClick={() => handleLinkClick("home")}
              >
                <a className="menu-link">Home</a>
              </div>
              <div
                className="menu-link-item-holder"
                onClick={() => handleLinkClick("description")}
              >
                <a className="menu-link">About</a>
              </div>
              <div
                className="menu-link-item-holder"
                onClick={() => handleLinkClick("work")}
              >
                <a className="menu-link">Work</a>
              </div>
              <div
                className="menu-link-item-holder"
                onClick={() => handleLinkClick("contact")}
              >
                <a className="menu-link">Contact</a>
              </div>
            </div>

            {/* Other links */}
          </div>
          <div className="menu-info">
            <div className="menu-info-col">
              <a
                href="#"
                onClick={() =>
                  (window.location.href = "https://github.com/Guevarnation")
                }
              >
                Github &#8599;
              </a>
              <a
                href="#"
                onClick={() =>
                  (window.location.href =
                    "https://www.linkedin.com/in/eugenio-guevara-a8417b20b/")
                }
              >
                LinkedIn &#8599;
              </a>
              {/* <a href="#">Facebook &#8599;</a> */}
            </div>
            <div className="menu-info-col" onClick={handleEmailClick}>
              <p>guevaraeu1@gmail.com</p>
              {/* <p>Monterrey, Mexico</p> */}
            </div>
          </div>
        </div>
        {/* <div className="menu-preview">
          <p className="menu-guevara">Ver video</p>
        </div> */}
      </div>
    </div>
  );
};

export default Menu;
