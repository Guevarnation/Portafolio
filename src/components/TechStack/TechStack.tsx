"use client";

import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

// Custom hook for individual tech item visibility (like Projects)
function useTechItemInView() {
  return useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px 100px 0px", // Increased from 50px to 100px like Projects
  });
}

// Custom hook for title visibility
function useTitleInView() {
  return useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px 50px 0px",
  });
}

const TechItem = memo(function TechItem({
  tech,
  index,
  prefersReducedMotion,
  categoryTranslation,
}: {
  tech: TechType;
  index: number;
  prefersReducedMotion: boolean;
  categoryTranslation: string;
}) {
  // Individual useInView for each tech item (like Projects)
  const { ref, inView } = useTechItemInView();

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 20,
        scale: prefersReducedMotion ? 1 : 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5, // Increased from 0.4 for smoother animation
          delay: (index % 12) * 0.03, // Reduced delay and mod by row for better performance
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    }),
    [prefersReducedMotion, index]
  );

  const hoverVariants = useMemo(() => {
    if (prefersReducedMotion) return {};
    return {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    };
  }, [prefersReducedMotion]);

  const IconComponent = tech.icon;

  return (
    <motion.div
      ref={ref}
      className={styles.techItem}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      whileHover={hoverVariants}
    >
      <div className={styles.iconContainer}>
        <IconComponent
          className={styles.techIcon}
          style={{ color: tech.color }}
        />
      </div>
      <div className={styles.textContainer}>
        <span className={styles.techName}>{tech.name}</span>
        <span className={styles.techCategory}>{categoryTranslation}</span>
      </div>
    </motion.div>
  );
});

export default function TechStack() {
  const t = useTranslations("TechStack");
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Separate useInView for title
  const { ref: titleRef, inView: titleInView } = useTitleInView();

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
        y: prefersReducedMotion ? 0 : 30,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    }),
    [prefersReducedMotion]
  );

  return (
    <section className={styles.techStack} id="tech-stack">
      <div className={styles.container}>
        <motion.h2
          ref={titleRef}
          className={styles.sectionTitle}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={titleVariants}
        >
          {t("title")}
        </motion.h2>

        <div className={styles.techGrid}>
          {technologies.map((tech, index) => (
            <TechItem
              key={tech.name}
              tech={tech}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              categoryTranslation={categoryTranslations[tech.category]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
