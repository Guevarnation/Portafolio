"use client";

import { useRef, useState, type CSSProperties } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
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
  FaServer,
  FaTools,
} from "react-icons/fa";
import { FiGrid, FiLayers, FiPlus } from "react-icons/fi";
import {
  SiAnthropic,
  SiClaude,
  SiDrizzle,
  SiGo,
  SiHono,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiStripe,
  SiTypescript,
} from "react-icons/si";
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
  /**
   * Set only on core tools (the ones he reaches for first): the chip gets
   * the accent treatment and is the only one that carries its mark. Every
   * other chip is text-only, which keeps ~45 inline SVGs out of the HTML.
   */
  icon?: IconType;
}

interface TechGroup {
  id: GroupId;
  icon: IconType;
  items: readonly TechItem[];
}

interface Highlight {
  id: HighlightId;
  icon: IconType;
}

// Static data: product names need no translation, so it lives outside the
// component and is never re-created on render.
const GROUPS: readonly TechGroup[] = [
  {
    id: "languages",
    icon: FaCode,
    items: [
      { name: "TypeScript", icon: SiTypescript },
      { name: "Go", icon: SiGo },
      { name: "Rust" },
      { name: "Python" },
      { name: "SQL" },
    ],
  },
  {
    id: "web",
    icon: FaGlobe,
    items: [
      { name: "Next.js", icon: SiNextdotjs },
      { name: "React" },
      { name: "Astro" },
      { name: "Tailwind CSS" },
      { name: "shadcn/ui" },
      { name: "TanStack Query" },
      { name: "Zustand" },
    ],
  },
  {
    id: "mobile",
    icon: FaMobileAlt,
    items: [
      { name: "React Native", icon: SiReact },
      { name: "Expo" },
      { name: "Ionic (Angular)" },
    ],
  },
  {
    id: "backend",
    icon: FaServer,
    items: [
      { name: "Hono", icon: SiHono },
      { name: "NestJS" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "Drizzle ORM", icon: SiDrizzle },
      { name: "Prisma" },
    ],
  },
  {
    id: "data",
    icon: FaDatabase,
    items: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Neon" },
      { name: "pgvector" },
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "Supabase" },
    ],
  },
  {
    id: "cloud",
    icon: FaCloud,
    items: [
      { name: "AWS", icon: FaAws },
      { name: "Google Cloud" },
      { name: "Vercel" },
      { name: "Docker" },
      { name: "Turborepo" },
      { name: "EAS" },
      { name: "GitHub Actions" },
    ],
  },
  {
    id: "ai",
    icon: FaBrain,
    items: [
      { name: "Claude API", icon: SiAnthropic },
      { name: "OpenAI" },
      { name: "Vercel AI SDK" },
      { name: "RAG pipelines" },
      { name: "Gemini" },
    ],
  },
  {
    id: "services",
    icon: FaPlug,
    items: [
      { name: "Stripe + Connect", icon: SiStripe },
      { name: "Clerk" },
      { name: "Pusher" },
      { name: "Resend" },
      { name: "Cloudinary" },
      { name: "Vercel Blob" },
      { name: "Puppeteer" },
    ],
  },
  {
    id: "tooling",
    icon: FaTools,
    items: [
      { name: "Claude Code", icon: SiClaude },
      { name: "MCP" },
      { name: "Cursor" },
      { name: "Git & GitHub" },
      { name: "Bun" },
      { name: "Zod" },
      { name: "Figma" },
      { name: "Linux" },
    ],
  },
];

const HIGHLIGHTS: readonly Highlight[] = [
  { id: "aws", icon: FaAws },
  { id: "languages", icon: FaLanguage },
  { id: "economics", icon: FaGraduationCap },
];

const EASE = [0.33, 1, 0.68, 1] as const;

// Same entrance as the "More work" row and the GitHub section: the section
// staggers its blocks, the grid staggers its tiles, each tile fades its chip
// list in and staggers the chips up. Motion only ever owns opacity/transform
// on the slot (the article) and the chip list; the hover geometry lives on
// the inner .tile as transform/opacity, so the two never fight. Chips
// animate `y` only: their rest opacity (.72) is CSS, and an inline opacity
// from Motion would override it.
//
// The hidden geometry does not depend on `reduced`: useReducedMotion() is
// null on the server and read from matchMedia on the client, so a value
// that changed with it would make the server's inline style differ from the
// client's first render. Reduced motion only zeroes the durations.
function buildVariants(reduced: boolean) {
  const lift = 16;
  const still = { duration: 0 } as const;
  const section: Variants = {
    hidden: {},
    visible: { transition: reduced ? still : { staggerChildren: 0.08 } },
  };
  const block: Variants = {
    hidden: { opacity: 0, y: lift },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduced
        ? still
        : {
            duration: 0.5,
            ease: EASE,
            when: "beforeChildren",
            staggerChildren: 0.03,
          },
    },
  };
  const grid: Variants = {
    hidden: {},
    visible: {
      transition: reduced
        ? still
        : { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };
  const chip: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: reduced ? still : { duration: 0.3 } },
  };
  const list: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reduced ? still : { duration: 0.3, staggerChildren: 0.03 },
    },
  };
  const item: Variants = {
    hidden: { y: 8 },
    visible: { y: 0, transition: reduced ? still : { duration: 0.3 } },
  };
  return { section, block, grid, tile: block, chip, list, item };
}

export default function TechStack() {
  const t = useTranslations("TechStack");
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "-50px" });
  const show = reduced || inView;
  const variants = buildVariants(reduced);

  // Same model as ProjectRow: `active` follows the pointer/focus, `pinned` is
  // a click (Enter/Space) and survives the pointer leaving the grid. Moving
  // to another tile hands the pin over, so at most one tile is open. Focus
  // leaving the grid clears both, so a pinned tile can always be closed from
  // the keyboard. Both drive data-open/aria-expanded; below 1024px or without
  // hover the CSS ignores them and renders every tile open (the trigger is
  // hidden there, so nothing toggles).
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  // Pointer type of the press in flight. A tap on a hover-capable touch
  // screen focuses the button before `click`; without this the focus would
  // set `active` and a second tap could not collapse the tile. For touch the
  // compat mouse events (mousedown, focus, click) fire *after* pointerup, so
  // the ref is cleared on the click that ends the sequence (or on
  // pointercancel), never on pointerup.
  const pressType = useRef<string | null>(null);
  const focus = (i: number) => {
    setActive(i);
    setPinned((p) => (p === i ? p : null));
  };
  const open = active ?? pinned;

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
          <div className={styles.headingGroup}>
            <p className={styles.eyebrow}>
              <FiLayers className={styles.eyebrowIcon} aria-hidden="true" />
              {t("eyebrow")}
            </p>
            <h2 id="tech-stack-title" className={styles.sectionTitle}>
              {t("title")}
            </h2>
          </div>
          <p className={styles.hint}>{t("hint")}</p>
        </m.div>

        <m.ul className={styles.highlights} variants={variants.block}>
          {HIGHLIGHTS.map(({ id, icon: Icon }) => (
            <m.li key={id} className={styles.highlight} variants={variants.chip}>
              <span className={styles.highlightLabel}>
                <Icon className={styles.highlightIcon} aria-hidden="true" />
                {t(`highlights.${id}.kicker`)}
              </span>
              <strong className={styles.highlightValue}>
                {t(`highlights.${id}.label`)}
              </strong>
              <span className={styles.highlightDetail}>
                {t(`highlights.${id}.detail`)}
              </span>
            </m.li>
          ))}
        </m.ul>

        <m.div className={styles.gridHeader} variants={variants.block}>
          <p className={styles.cardTitle}>
            <FiGrid className={styles.cardIcon} aria-hidden="true" />
            {t("gridTitle")}
          </p>
          <p className={styles.legend}>
            <span className={styles.legendSwatch} aria-hidden="true" />
            {t("legend")}
          </p>
        </m.div>

        <m.div
          className={styles.grid}
          variants={variants.grid}
          // Cleared on the grid, not per tile, so crossing the gap between
          // two tiles does not close-then-open.
          onPointerLeave={(e) => {
            if (e.pointerType !== "touch") setActive(null);
          }}
          onPointerDown={(e) => {
            pressType.current = e.pointerType;
          }}
          onPointerCancel={() => {
            pressType.current = null;
          }}
          // Bubbles from the trigger after its own onClick has toggled the pin.
          onClick={() => {
            pressType.current = null;
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setActive(null);
              setPinned(null);
            }
          }}
        >
          {GROUPS.map(({ id, icon: GroupIcon, items }, i) => {
            const expanded = open === i;
            const title = t(`groups.${id}`);
            const titleId = `stack-${id}-title`;
            const panelId = `stack-${id}-panel`;
            const core = items.filter((item) => item.icon).length;
            return (
              <m.article
                key={id}
                className={styles.slot}
                data-open={expanded ? "true" : "false"}
                aria-labelledby={titleId}
                variants={variants.tile}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") focus(i);
                }}
                onFocus={() => {
                  if (pressType.current !== "touch") focus(i);
                }}
                onBlur={() => setActive((a) => (a === i ? null : a))}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setPinned(null);
                    setActive(null);
                  }
                }}
              >
                <div className={styles.tile}>
                  <span className={styles.hairline} aria-hidden="true" />
                  <span className={styles.index} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.kicker}>
                    <GroupIcon className={styles.groupIcon} aria-hidden="true" />
                    {t("kicker", { count: items.length, core })}
                  </span>
                  <h3 id={titleId} className={styles.tileTitle}>
                    {title}
                  </h3>
                  <m.ul
                    className={styles.chips}
                    aria-label={t("tools")}
                    variants={variants.list}
                  >
                    {items.map(({ name, icon: Icon }, j) => (
                      <m.li
                        key={name}
                        className={`${styles.chip} ${Icon ? styles.chipPrimary : ""}`}
                        style={{ "--i": j } as CSSProperties}
                        variants={variants.item}
                      >
                        {Icon && (
                          <Icon className={styles.chipIcon} aria-hidden="true" />
                        )}
                        <span>{name}</span>
                        {Icon && (
                          <span className={styles.srOnly}> ({t("core")})</span>
                        )}
                      </m.li>
                    ))}
                  </m.ul>
                  <div id={panelId} className={styles.note}>
                    <p className={styles.summary}>{t(`notes.${id}`)}</p>
                  </div>
                  {/* Whole-tile hit area; the only interactive element inside. */}
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    aria-label={t("details", { name: title })}
                    onClick={() => setPinned((p) => (p === i ? null : i))}
                  >
                    <span className={styles.glyph} aria-hidden="true">
                      <FiPlus />
                    </span>
                  </button>
                </div>
              </m.article>
            );
          })}
        </m.div>
      </m.div>
    </section>
  );
}
