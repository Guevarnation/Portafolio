"use client";

import styles from "./page.module.scss";
import Preloader from "../../components/Preloader/Preloader";
import Landing from "../../components/Landing/Landing";
import Description from "../../components/Description/Description";
import Projects from "../../components/Projects/Projects";
// import SlidingImages from "../../components/SlidingImages/SlidingImages";
import Contact from "../../components/Contact/Contact";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GitHub from "@/components/GitHub/GitHub";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
      }, 2000);
    })();
  }, []);

  return (
    <main className={styles.main}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Landing />
      <Description />
      <Projects />
      {/* <SlidingImages /> */}
      <GitHub />
      <Contact />
    </main>
  );
}
