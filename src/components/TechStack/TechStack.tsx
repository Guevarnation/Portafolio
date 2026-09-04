"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { RiOpenaiFill } from "react-icons/ri";
import type { IconType } from "react-icons";
import {
  SiAngular,
  SiAnthropic,
  SiAstro,
  SiClaude,
  SiClerk,
  SiCloudinary,
  SiDocker,
  SiDrizzle,
  SiExpo,
  SiExpress,
  SiGithubactions,
  SiGo,
  SiGooglecloud,
  SiGooglegemini,
  SiHono,
  SiIonic,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,

  SiPostgresql,
  SiPrisma,
  SiPuppeteer,
  SiPusher,
  SiPython,
  SiReact,
  SiResend,
  SiRust,
  SiShadcnui,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTurborepo,
  SiTypescript,
  SiVercel,
  SiModelcontextprotocol,
  SiGithub,
  SiBun,
  SiZod,
  SiFigma,
  SiLinux,
} from "react-icons/si";
import {
  FaAws,
  FaBrain,
  FaCloud,
  FaCode,
  FaDatabase,
  FaGlobe,
  FaGraduationCap,
  FaLanguage,
  FaMobileAlt,
  FaPlug,
  FaProjectDiagram,
  FaServer,
  FaTools,
} from "react-icons/fa";
import { TbSql, TbTerminal2, TbVector } from "react-icons/tb";
import styles from "./style.module.scss";

type GroupId =
  | "languages"
  | "web"
  | "mobile"
  | "backend"
  | "data"
  | "cloud"
  | "ai"
  | "services"
  | "tooling";

type HighlightId = "aws" | "languages" | "economics";

interface TechItem {
  name: string;
  icon: IconType;
  /** Emphasised in the UI — the tools he reaches for first. */
  primary?: boolean;
}

interface TechGroup {
  id: GroupId;
  icon: IconType;
  items: TechItem[];
}

interface Highlight {
  id: HighlightId;
  icon: IconType;
}

// Static data: no translations needed for product names, so it lives outside
// the component and is never re-created on render.
const GROUPS: TechGroup[] = [
  {
    id: "languages",
    icon: FaCode,
    items: [
      { name: "TypeScript", icon: SiTypescript, primary: true },
      { name: "Go", icon: SiGo, primary: true },
      { name: "Rust", icon: SiRust },
      { name: "Python", icon: SiPython },
      { name: "SQL", icon: TbSql },
    ],
  },
  {
    id: "web",
    icon: FaGlobe,
    items: [
      { name: "Next.js", icon: SiNextdotjs, primary: true },
      { name: "React", icon: SiReact },
      { name: "Astro", icon: SiAstro },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "shadcn/ui", icon: SiShadcnui },
    ],
  },
  {
    id: "mobile",
    icon: FaMobileAlt,
    items: [
      { name: "React Native", icon: SiReact, primary: true },
      { name: "Expo", icon: SiExpo },
      { name: "Ionic", icon: SiIonic },
      { name: "Angular", icon: SiAngular },
    ],
  },
  {
    id: "backend",
    icon: FaServer,
    items: [
      { name: "Hono", icon: SiHono, primary: true },
      { name: "NestJS", icon: SiNestjs },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Drizzle ORM", icon: SiDrizzle, primary: true },
      { name: "Prisma", icon: SiPrisma },
    ],
  },
  {
    id: "data",
    icon: FaDatabase,
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, primary: true },
      { name: "Neon", icon: FaDatabase },
      { name: "pgvector", icon: TbVector },
      { name: "MySQL", icon: SiMysql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Supabase", icon: SiSupabase },
    ],
  },
  {
    id: "cloud",
    icon: FaCloud,
    items: [
      { name: "AWS", icon: FaAws, primary: true },
      { name: "Google Cloud", icon: SiGooglecloud },
      { name: "Vercel", icon: SiVercel },
      { name: "Docker", icon: SiDocker },
      { name: "Turborepo", icon: SiTurborepo },
      { name: "EAS", icon: SiExpo },
      { name: "GitHub Actions", icon: SiGithubactions },
    ],
  },
  {
    id: "ai",
    icon: FaBrain,
    items: [
      { name: "Claude API", icon: SiAnthropic, primary: true },
      { name: "OpenAI", icon: RiOpenaiFill },
      { name: "Vercel AI SDK", icon: SiVercel },
      { name: "RAG pipelines", icon: FaProjectDiagram },
      { name: "Gemini", icon: SiGooglegemini },
    ],
  },
  {
    id: "services",
    icon: FaPlug,
    items: [
      { name: "Stripe + Connect", icon: SiStripe },
      { name: "Clerk", icon: SiClerk },
      { name: "Pusher", icon: SiPusher },
      { name: "Resend", icon: SiResend },
      { name: "Cloudinary", icon: SiCloudinary },
      { name: "Vercel Blob", icon: SiVercel },
      { name: "Puppeteer", icon: SiPuppeteer },
    ],
  },
  {
    id: "tooling",
    icon: FaTools,
    items: [
      { name: "Claude Code", icon: SiClaude },
      { name: "MCP", icon: SiModelcontextprotocol },
      { name: "Cursor", icon: TbTerminal2 },
      { name: "Git & GitHub", icon: SiGithub },
      { name: "Bun", icon: SiBun },
      { name: "Zod", icon: SiZod },
      { name: "Figma", icon: SiFigma },
      { name: "Linux", icon: SiLinux },
    ],
  },
];

const HIGHLIGHTS: Highlight[] = [
  { id: "aws", icon: FaAws },
  { id: "languages", icon: FaLanguage },
  { id: "economics", icon: FaGraduationCap },
];

const EASE = [0.33, 1, 0.68, 1] as const;

function buildVariants(reduced: boolean) {
  const lift = reduced ? 0 : 16;
  const duration = reduced ? 0 : 0.5;
  const section: Variants = {
    hidden: {},
    visible: {
      transition: reduced ? { duration: 0 } : { staggerChildren: 0.08 },
    },
  };
  const block: Variants = {
    hidden: { opacity: 0, y: lift },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0 }
        : { duration, ease: EASE, when: "beforeChildren", staggerChildren: 0.03 },
    },
  };
  const chip: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.3 } },
  };
  return { section, block, chip };
}

export default function TechStack() {
  const t = useTranslations("TechStack");
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "-50px" });
  const show = prefersReducedMotion || inView;
  const variants = buildVariants(prefersReducedMotion);

  return (
    <section
      className={styles.techStack}
      id="tech-stack"
      ref={ref}
      aria-labelledby="tech-stack-title"
    >
      <m.div
        className={styles.container}
        variants={variants.section}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
      >
        <m.div className={styles.header} variants={variants.block}>
          <h2 id="tech-stack-title" className={styles.sectionTitle}>
            {t("title")}
          </h2>
          <p className={styles.legend}>
            <span className={styles.legendSwatch} aria-hidden="true" />
            {t("legend")}
          </p>
        </m.div>

        <m.ul className={styles.highlights} variants={variants.block}>
          {HIGHLIGHTS.map(({ id, icon: Icon }) => (
            <m.li key={id} className={styles.highlight} variants={variants.chip}>
              <Icon className={styles.highlightIcon} aria-hidden="true" />
              <span className={styles.highlightText}>
                <strong>{t(`highlights.${id}.label`)}</strong>
                <span>{t(`highlights.${id}.detail`)}</span>
              </span>
            </m.li>
          ))}
        </m.ul>

        <div className={styles.grid}>
          {GROUPS.map(({ id, icon: GroupIcon, items }) => (
            <m.article key={id} className={styles.card} variants={variants.block}>
              <h3 className={styles.cardTitle}>
                <GroupIcon className={styles.cardIcon} aria-hidden="true" />
                {t(`groups.${id}`)}
              </h3>
              <ul className={styles.chips}>
                {items.map(({ name, icon: Icon, primary }) => (
                  <m.li
                    key={name}
                    className={`${styles.chip} ${primary ? styles.chipPrimary : ""}`}
                    variants={variants.chip}
                  >
                    <Icon className={styles.chipIcon} aria-hidden="true" />
                    <span>{name}</span>
                    {primary && (
                      <span className={styles.srOnly}> ({t("core")})</span>
                    )}
                  </m.li>
                ))}
              </ul>
            </m.article>
          ))}
        </div>
      </m.div>
    </section>
  );
}
