"use client";

import { useRef, useState } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Image, { type ImageLoader } from "next/image";
import { FiPlus } from "react-icons/fi";
import { cloudinaryPoster } from "./cloudinary";
import styles from "./ProjectRow.module.scss";

// The four smaller projects, shown as one expanding band under the full
// cards. Posters only (no videos). The two Cloudinary ones go through a
// custom loader instead of the Next optimizer, so the srcset is a set of
// Cloudinary renditions (up to w_1200: 2x for the ~520 px expanded slot).
interface RowItem {
  key: string;
  technologies: readonly string[];
  poster: string;
  loader?: ImageLoader;
}

const ROW_POSTER_MAX_WIDTH = 1200;

function remotePoster(transform?: string): ImageLoader {
  return ({ src, width }) =>
    cloudinaryPoster(src, width, { maxWidth: ROW_POSTER_MAX_WIDTH, transform });
}

const ITEMS: readonly RowItem[] = [
  {
    key: "Dropper",
    technologies: [
      "Flutter",
      "Node.js",
      "Puppeteer",
      "CAPTCHA Solver",
      "Google Cloud",
    ],
    poster:
      "https://res.cloudinary.com/drjfzsw6m/video/upload/v1752085528/Screen_Recording_2025-07-09_at_12.18.00_p.m._1_.mp4_kqnph4.mp4",
    // The recording starts with 5% of window chrome (pure white rows) at the
    // top; g_south drops them so the tile's top edge stays dark.
    loader: remotePoster("c_fill,g_south,ar_1.77"),
  },
  {
    key: "ChromeExtension",
    technologies: ["JavaScript", "Chrome API", "Custom UI Framework"],
    poster: "https://res.cloudinary.com/drjfzsw6m/video/upload/tm_1_cmv0l6.mp4",
    loader: remotePoster(),
  },
  {
    key: "PolymarketEngine",
    technologies: ["Rust", "WebSockets", "AWS EC2", "Go"],
    poster: "/images/polymarket-engine.png",
  },
  {
    key: "BlockchainSolutions",
    technologies: ["Solidity", "Ethereum", "Web3.js"],
    poster: "/images/blockchain.jpg",
  },
];

// One column on phones, two on tablets, and at most the expanded tile
// (~520 px) on desktop. Bare vw values (not calc) so Next trims the srcset to
// the device sizes instead of emitting every candidate from 16w up.
const POSTER_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1023px) 50vw, 520px";

const EASE = [0.33, 1, 0.68, 1] as const;

// Same entrance as TechStack: the section staggers header -> row, the row
// staggers its tiles. Motion only ever owns opacity/transform on the slot
// (the article); the hover geometry lives on the inner .tile as
// transform + clip-path, so the two never fight. The hidden geometry does
// not depend on `reduced` (null on the server, matchMedia on the client), so
// the server's inline style matches the client's first render; reduced
// motion only zeroes the durations.
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
      transition: reduced ? still : { duration: 0.5, ease: EASE },
    },
  };
  const row: Variants = {
    hidden: {},
    visible: {
      transition: reduced
        ? still
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };
  return { section, block, row, tile: block };
}

type Pos = "idle" | "before" | "expanded" | "after";

export default function ProjectRow() {
  const t = useTranslations("Projects");
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "-50px" });
  const show = reduced || inView;
  const variants = buildVariants(reduced);

  // `active` follows the pointer/focus; `pinned` is a click (Enter/Space)
  // and survives the pointer leaving the row. Moving to another tile hands
  // the pin over, so at most one tile is ever expanded and the fixed-width
  // info column never has to fit a half-grown tile. Focus leaving the row
  // (Tab away, click elsewhere) clears both, so a pinned tile can always be
  // closed from the keyboard. Both drive data-expanded/aria-expanded and the
  // per-tile data-pos geometry; below 1024px or without hover the CSS
  // ignores them and renders every tile open (always-open on touch is
  // intended: the trigger is hidden there, so nothing toggles).
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
    <m.section
      className={styles.more}
      id="more-work"
      aria-labelledby="more-work-title"
      ref={ref}
      variants={variants.section}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
    >
      <m.div className={styles.header} variants={variants.block}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>
            <span className={styles.swatch} aria-hidden="true" />
            {t("moreEyebrow")}
          </p>
          <h3 id="more-work-title" className={styles.sectionTitle}>
            {t("moreTitle")}
          </h3>
        </div>
        <p className={styles.hint}>{t("moreHint")}</p>
      </m.div>

      <m.div
        className={styles.row}
        variants={variants.row}
        // Cleared on the row, not per tile, so crossing the gap between two
        // tiles does not collapse-then-expand.
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
        {ITEMS.map((item, i) => {
          const expanded = open === i;
          const pos: Pos =
            open === null
              ? "idle"
              : expanded
                ? "expanded"
                : i < open
                  ? "before"
                  : "after";
          const title = t(`${item.key}.title`);
          const titleId = `more-${item.key}-title`;
          const panelId = `more-${item.key}-panel`;
          return (
            <m.article
              key={item.key}
              className={styles.slot}
              data-expanded={expanded ? "true" : "false"}
              data-pos={pos}
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
                <div className={styles.poster}>
                  <Image
                    src={item.poster}
                    alt=""
                    fill
                    sizes={POSTER_SIZES}
                    loader={item.loader}
                    className={styles.posterImg}
                  />
                </div>
                <span className={styles.scrim} aria-hidden="true" />
                <span className={styles.scrimStrong} aria-hidden="true" />
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.body}>
                  <span className={styles.kicker}>
                    {t(`${item.key}.kicker`)}
                  </span>
                  <h4 id={titleId} className={styles.tileTitle}>
                    {title}
                  </h4>
                  <div id={panelId} className={styles.panel}>
                    <p className={styles.summary}>{t(`${item.key}.summary`)}</p>
                    <ul className={styles.chips} aria-label={t("moreTech")}>
                      {item.technologies.map((name) => (
                        <li key={name} className={styles.chip}>
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Whole-tile hit area; the only interactive element inside. */}
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  aria-label={t("moreDetails", { name: title })}
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
    </m.section>
  );
}
