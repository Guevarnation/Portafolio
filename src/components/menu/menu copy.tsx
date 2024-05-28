"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

import "./menu.css";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const menuLinks = [
  { path: "/", label: "Inicio" },
  { path: "/work", label: "Trabajo" },
  { path: "/about", label: "Acerca de mi" },
  { path: "/contact", label: "Contacto" },
  { path: "/lab", label: "ZAZA" },
];

const Menu = () => {
  //   const container = useRef();
  const container = useRef<HTMLDivElement>(null);

  const tl = useRef<GSAPTimeline | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isMenuOpen]);

  return (
    <div className="menu-container" ref={container}>
      <div className="menu-bar">
        <div className="menu-logo">
          <Link href="/">Guevara</Link>
        </div>
        <div className="menu-open" onClick={toggleMenu}>
          <p>Menu</p>
        </div>
      </div>
      <div className="menu-overlay">
        <div className="menu-overlay-bar">
          <div className="menu-logo">
            <Link href="/">Guevara</Link>
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
            {menuLinks.map((link, index) => (
              <div className="menu-link-item" key={index}>
                <div className="menu-link-item-holder" onClick={toggleMenu}>
                  <Link href={link.path} className="menu-link">
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="menu-info">
            <div className="menu-info-col">
              <a href="#">X &#8599;</a>
              <a href="#">Instagram &#8599;</a>
              <a href="#">LinkedIn &#8599;</a>
              <a href="#">Facebook &#8599;</a>
              {/* <a href="#">Dribbble &#8599;</a> */}
            </div>
            <div className="menu-info-col">
              <p>info@guevara.com</p>
              <p>+(52) 81 1599 9681</p>
            </div>
          </div>
        </div>
        <div className="menu-preview">
          <p>Ver video</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
