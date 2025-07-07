"use client";

import React, { memo, useMemo, useState, useRef, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";
import {
  SiNextdotjs,
  SiReact,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiMysql,
  SiStripe,
  SiTailwindcss,
  SiExpo,
  SiFlutter,
  SiExpress,
  SiNodedotjs,
  SiAmazon,
  SiGooglecloud,
  SiDigitalocean,
  SiVercel,
  SiEthereum,
  SiWeb3Dotjs,
  SiOpenai,
  SiSupabase,
  SiGooglemaps,
  SiPuppeteer,
  SiR,
  SiSolidity,
  SiMongodb,
  SiFirebase,
  SiIonic,
} from "react-icons/si";
import {
  FaDatabase,
  FaTools,
  FaMobile,
  FaCode,
  FaRobot,
  FaCreditCard,
  FaChrome,
  FaFileExcel,
  FaChartBar,
  FaBrain,
  FaWallet,
} from "react-icons/fa";

interface TechType {
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
}

const TechItem = memo(function TechItem({
  tech,
  index,
  prefersReducedMotion,
  categoryTranslation,
  shouldAnimate,
}: {
  tech: TechType;
  index: number;
  prefersReducedMotion: boolean;
  categoryTranslation: string;
  shouldAnimate: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Professional easing curves
  const springConfig = {
    type: "spring" as const,
    damping: 25,
    stiffness: 300,
    mass: 0.8,
  };

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 40,
        scale: prefersReducedMotion ? 1 : 0.8,
        rotateX: prefersReducedMotion ? 0 : -15,
        filter: "blur(10px)",
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
          ...springConfig,
          delay: index * 0.08,
          opacity: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
          filter: { duration: 0.8, ease: "easeOut" },
        },
      },
    }),
    [prefersReducedMotion, index, springConfig]
  );

  const hoverVariants = useMemo(() => {
    if (prefersReducedMotion) return {};

    return {
      scale: 1.08,
      y: -8,
      rotateY: 5,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400,
      },
    };
  }, [prefersReducedMotion]);

  const iconAnimation = useMemo(() => {
    if (prefersReducedMotion) return {};

    return {
      scale: isHovered ? 1.2 : 1,
      rotate: isHovered ? [0, -5, 5, 0] : 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        rotate: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    };
  }, [isHovered, prefersReducedMotion]);

  const textAnimation = useMemo(() => {
    if (prefersReducedMotion) return {};

    return {
      y: isHovered ? -2 : 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400,
      },
    };
  }, [isHovered, prefersReducedMotion]);

  const IconComponent = tech.icon;

  return (
    <motion.div
      className={styles.techItem}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={itemVariants}
      whileHover={hoverVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        willChange: shouldAnimate ? "auto" : "transform, opacity",
        transform: "translate3d(0, 0, 0)",
        perspective: "1000px",
      }}
    >
      <motion.div className={styles.iconContainer} animate={iconAnimation}>
        <IconComponent
          className={styles.techIcon}
          style={{ color: tech.color }}
        />
      </motion.div>
      <motion.div
        animate={textAnimation}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span className={styles.techName}>{tech.name}</span>
        <span className={styles.techCategory}>{categoryTranslation}</span>
      </motion.div>
    </motion.div>
  );
});

export default function TechStack() {
  const t = useTranslations("TechStack");
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "hidden" | "title" | "grid"
  >("hidden");
  const sectionRef = useRef<HTMLElement>(null);

  // Enhanced intersection observer with better timing
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Choreographed animation phases
          setTimeout(() => setAnimationPhase("title"), 100);
          setTimeout(() => setAnimationPhase("grid"), 600);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px 100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const technologies = useMemo(
    (): TechType[] => [
      // Frontend Frameworks & Libraries
      {
        name: "Next.js",
        category: "Frontend",
        icon: SiNextdotjs,
        color: "#000000",
      },
      { name: "React", category: "Frontend", icon: SiReact, color: "#61DAFB" },
      {
        name: "React Native",
        category: "Mobile",
        icon: SiReact,
        color: "#61DAFB",
      },
      { name: "Expo", category: "Mobile", icon: SiExpo, color: "#000020" },
      {
        name: "Flutter",
        category: "Mobile",
        icon: SiFlutter,
        color: "#02569B",
      },
      { name: "Ionic", category: "Mobile", icon: SiIonic, color: "#3880FF" },
      {
        name: "TailwindCSS",
        category: "Styling",
        icon: SiTailwindcss,
        color: "#06B6D4",
      },

      // Backend & APIs
      {
        name: "Express",
        category: "Backend",
        icon: SiExpress,
        color: "#000000",
      },
      {
        name: "Node.js",
        category: "Backend",
        icon: SiNodedotjs,
        color: "#339933",
      },

      // Programming Languages
      {
        name: "JavaScript",
        category: "Languages",
        icon: SiJavascript,
        color: "#F7DF1E",
      },
      {
        name: "TypeScript",
        category: "Languages",
        icon: SiTypescript,
        color: "#3178C6",
      },
      {
        name: "Python",
        category: "Languages",
        icon: SiPython,
        color: "#3776AB",
      },
      { name: "R", category: "Languages", icon: SiR, color: "#276DC3" },
      {
        name: "Solidity",
        category: "Languages",
        icon: SiSolidity,
        color: "#363636",
      },

      // State Management & Data
      {
        name: "Tanstack",
        category: "State Management",
        icon: FaCode,
        color: "#FF4154",
      },
      { name: "MySQL", category: "Database", icon: SiMysql, color: "#4479A1" },
      {
        name: "MongoDB",
        category: "Database",
        icon: SiMongodb,
        color: "#47A248",
      },
      {
        name: "Firebase",
        category: "Database",
        icon: SiFirebase,
        color: "#FFCA28",
      },
      {
        name: "Supabase",
        category: "Database",
        icon: SiSupabase,
        color: "#3ECF8E",
      },
      {
        name: "pgvector",
        category: "Database",
        icon: FaDatabase,
        color: "#336791",
      },

      // AI & Machine Learning
      { name: "OpenAI", category: "AI/ML", icon: SiOpenai, color: "#412991" },
      { name: "Anthropic", category: "AI/ML", icon: FaBrain, color: "#D97757" },
      {
        name: "Vercel AI SDK",
        category: "AI/ML",
        icon: FaRobot,
        color: "#000000",
      },

      // Cloud & Infrastructure
      { name: "AWS", category: "Cloud", icon: SiAmazon, color: "#FF9900" },
      {
        name: "Google Cloud",
        category: "Cloud",
        icon: SiGooglecloud,
        color: "#4285F4",
      },
      {
        name: "DigitalOcean",
        category: "Cloud",
        icon: SiDigitalocean,
        color: "#0080FF",
      },
      { name: "Vercel", category: "Cloud", icon: SiVercel, color: "#000000" },

      // Payment & Authentication
      {
        name: "Stripe",
        category: "Services",
        icon: SiStripe,
        color: "#635BFF",
      },
      {
        name: "Clerk",
        category: "Services",
        icon: FaCreditCard,
        color: "#6C47FF",
      },
      { name: "Pusher", category: "Services", icon: FaTools, color: "#300D4F" },

      // Tools & Analytics
      {
        name: "Puppeteer",
        category: "Tools",
        icon: SiPuppeteer,
        color: "#40B5A8",
      },
      {
        name: "Selenium",
        category: "Tools",
        icon: FaRobot,
        color: "#40B5A8",
      },
      { name: "Excel", category: "Tools", icon: FaFileExcel, color: "#217346" },
      { name: "Stata", category: "Tools", icon: FaChartBar, color: "#1A365D" },
      {
        name: "Chrome API",
        category: "Tools",
        icon: FaChrome,
        color: "#4285F4",
      },

      // Blockchain
      {
        name: "Ethereum",
        category: "Blockchain",
        icon: SiEthereum,
        color: "#627EEA",
      },
      {
        name: "Web3.js",
        category: "Blockchain",
        icon: SiWeb3Dotjs,
        color: "#F16822",
      },
      {
        name: "MetaMask",
        category: "Blockchain",
        icon: FaWallet,
        color: "#F6851B",
      },

      // Native APIs
      {
        name: "Native APIs",
        category: "Mobile",
        icon: FaMobile,
        color: "#FF6B6B",
      },
      {
        name: "Google Maps API",
        category: "APIs",
        icon: SiGooglemaps,
        color: "#4285F4",
      },
    ],
    []
  );

  // Pre-compute all translations to avoid re-renders
  const categoryTranslations = useMemo(() => {
    const categories = Array.from(
      new Set(technologies.map((tech) => tech.category))
    );
    return categories.reduce((acc, category) => {
      acc[category] = t(`categories.${category}`);
      return acc;
    }, {} as Record<string, string>);
  }, [technologies, t]);

  const titleVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 50,
        scale: prefersReducedMotion ? 1 : 0.9,
        filter: "blur(10px)",
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 200,
          duration: 0.8,
          opacity: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
          filter: { duration: 1, ease: "easeOut" },
        },
      },
    }),
    [prefersReducedMotion]
  );

  const containerVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
          when: "beforeChildren",
        },
      },
    }),
    []
  );

  // Background animation for the entire section
  const sectionVariants = useMemo(
    () => ({
      hidden: {
        background: "linear-gradient(135deg, transparent 0%, transparent 100%)",
      },
      visible: {
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)",
        transition: {
          duration: 2,
          ease: "easeOut",
        },
      },
    }),
    []
  );

  return (
    <motion.section
      ref={sectionRef}
      className={styles.techStack}
      id="tech-stack"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={sectionVariants}
      style={{
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial="hidden"
          animate={animationPhase !== "hidden" ? "visible" : "hidden"}
          variants={titleVariants}
          style={{
            willChange:
              animationPhase !== "hidden" ? "auto" : "transform, opacity",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        >
          {t("title")}
        </motion.h2>

        <motion.div
          className={styles.techGrid}
          initial="hidden"
          animate={animationPhase === "grid" ? "visible" : "hidden"}
          variants={containerVariants}
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        >
          {technologies.map((tech, index) => (
            <TechItem
              key={tech.name}
              tech={tech}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              categoryTranslation={categoryTranslations[tech.category]}
              shouldAnimate={animationPhase === "grid"}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
