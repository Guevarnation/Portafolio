"use client";

import React, { memo, useMemo } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiPython,
  SiMysql,
  SiPostgresql,
  SiAmazon,
  SiDocker,
  SiSolidity,
  SiOpenai,
  SiTailwindcss,
  SiNodedotjs,
  SiGo,
  SiTensorflow,
  SiWeb3Dotjs,
  SiGraphql,
  SiHono,
  SiDrizzle,
  SiExpress,
  SiExpo,
  SiAngular,
  SiIonic,
  SiSupabase,
  SiFirebase,
  SiMongodb,
  SiVercel,
  SiDigitalocean,
  SiGooglecloud,
  SiStripe,
  SiPuppeteer,
  SiR,
  SiEthereum,
  SiGooglemaps,
} from "react-icons/si";
import {
  FaDatabase,
  FaServer,
  FaCloud,
  FaCode,
  FaMobile,
  FaRobot,
  FaCreditCard,
  FaTools,
  FaFileExcel,
  FaChartBar,
  FaChrome,
  FaWallet,
} from "react-icons/fa";
import { BiLaptop } from "react-icons/bi";

interface TechItemData {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  level: "Expert" | "Advanced" | "Intermediate";
  years: string;
}

interface TechCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: TechItemData[];
}

const TechCard = memo(function TechCard({
  tech,
  prefersReducedMotion,
}: {
  tech: TechItemData;
  prefersReducedMotion: boolean;
}) {
  const hoverVariants: Variants = {
    hover: {
      y: prefersReducedMotion ? 0 : -4,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const Icon = tech.icon;

  return (
    <motion.div
      className={styles.techCard}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={prefersReducedMotion ? undefined : "hover"}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper} style={{ color: tech.color }}>
          <Icon size={24} />
        </div>
        <div className={styles.info}>
          <h4 className={styles.name}>{tech.name}</h4>
          <span className={styles.level}>{tech.level}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default function TechStack() {
  const t = useTranslations("TechStack");
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px",
  });

  const categories: TechCategory[] = useMemo(
    () => [
      {
        id: "core",
        label: "Core & Languages",
        icon: FaCode,
        items: [
          {
            name: "TypeScript",
            icon: SiTypescript,
            color: "#3178C6",
            level: "Expert",
            years: "5+ Years",
          },
          {
            name: "Python",
            icon: SiPython,
            color: "#3776AB",
            level: "Expert",
            years: "4+ Years",
          },
          {
            name: "Go",
            icon: SiGo,
            color: "#00ADD8",
            level: "Advanced",
            years: "3+ Years",
          },
          {
            name: "Solidity",
            icon: SiSolidity,
            color: "#363636",
            level: "Intermediate",
            years: "2+ Years",
          },
          {
            name: "R",
            icon: SiR,
            color: "#276DC3",
            level: "Intermediate",
            years: "2+ Years",
          },
        ],
      },
      {
        id: "web_mobile",
        label: "Web & Mobile",
        icon: FaMobile,
        items: [
          {
            name: "Next.js",
            icon: SiNextdotjs,
            color: "#000000",
            level: "Expert",
            years: "4+ Years",
          },
          {
            name: "React",
            icon: SiReact,
            color: "#61DAFB",
            level: "Expert",
            years: "5+ Years",
          },
          {
            name: "Tailwind",
            icon: SiTailwindcss,
            color: "#06B6D4",
            level: "Expert",
            years: "3+ Years",
          },
          {
            name: "React Native",
            icon: SiReact,
            color: "#61DAFB",
            level: "Advanced",
            years: "3+ Years",
          },
          {
            name: "Expo",
            icon: SiExpo,
            color: "#000020",
            level: "Advanced",
            years: "3+ Years",
          },
          {
            name: "Angular",
            icon: SiAngular,
            color: "#DD0031",
            level: "Intermediate",
            years: "2+ Years",
          },
          {
            name: "Ionic",
            icon: SiIonic,
            color: "#3880FF",
            level: "Intermediate",
            years: "2+ Years",
          },
        ],
      },
      {
        id: "backend_data",
        label: "Backend & Data",
        icon: FaDatabase,
        items: [
          {
            name: "Node.js",
            icon: SiNodedotjs,
            color: "#339933",
            level: "Advanced",
            years: "5+ Years",
          },
          {
            name: "Hono.js",
            icon: SiHono,
            color: "#E36002",
            level: "Advanced",
            years: "1+ Years",
          },
          {
            name: "Express",
            icon: SiExpress,
            color: "#000000",
            level: "Advanced",
            years: "4+ Years",
          },
          {
            name: "Drizzle ORM",
            icon: SiDrizzle,
            color: "#C5F74F",
            level: "Advanced",
            years: "1+ Years",
          },
          {
            name: "PostgreSQL",
            icon: SiPostgresql,
            color: "#336791",
            level: "Advanced",
            years: "4+ Years",
          },
          {
            name: "MySQL",
            icon: SiMysql,
            color: "#4479A1",
            level: "Advanced",
            years: "5+ Years",
          },
          {
            name: "MongoDB",
            icon: SiMongodb,
            color: "#47A248",
            level: "Advanced",
            years: "3+ Years",
          },
          {
            name: "Supabase",
            icon: SiSupabase,
            color: "#3ECF8E",
            level: "Advanced",
            years: "2+ Years",
          },
          {
            name: "Firebase",
            icon: SiFirebase,
            color: "#FFCA28",
            level: "Advanced",
            years: "3+ Years",
          },
        ],
      },
      {
        id: "infra_tools",
        label: "Infra, AI & Tools",
        icon: FaCloud,
        items: [
          {
            name: "AWS",
            icon: SiAmazon,
            color: "#FF9900",
            level: "Advanced",
            years: "4+ Years",
          },
          {
            name: "Docker",
            icon: SiDocker,
            color: "#2496ED",
            level: "Intermediate",
            years: "3+ Years",
          },
          {
            name: "OpenAI API",
            icon: SiOpenai,
            color: "#412991",
            level: "Advanced",
            years: "2+ Years",
          },
          {
            name: "Vercel",
            icon: SiVercel,
            color: "#000000",
            level: "Expert",
            years: "4+ Years",
          },
          {
            name: "Stripe",
            icon: SiStripe,
            color: "#635BFF",
            level: "Advanced",
            years: "3+ Years",
          },
          {
            name: "Web3.js",
            icon: SiWeb3Dotjs,
            color: "#F16822",
            level: "Intermediate",
            years: "2+ Years",
          },
          {
            name: "Puppeteer",
            icon: SiPuppeteer,
            color: "#40B5A8",
            level: "Advanced",
            years: "2+ Years",
          },
          {
            name: "Cursor",
            icon: BiLaptop,
            color: "#000000",
            level: "Expert",
            years: "1+ Years",
          },
        ],
      },
    ],
    []
  );

  return (
    <section className={styles.techStack} id="tech-stack" ref={ref}>
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {t("title")}
        </motion.h2>

        <div className={styles.categoriesGrid}>
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              className={styles.categoryColumn}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: catIndex * 0.1,
                    duration: 0.5,
                    when: "beforeChildren",
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              <h3 className={styles.categoryTitle}>
                <category.icon className={styles.catIcon} />
                {category.label}
              </h3>
              <div className={styles.cardsList}>
                {category.items.map((tech) => (
                  <TechCard
                    key={tech.name}
                    tech={tech}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
