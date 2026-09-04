"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useFormatter, useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { FaGithub } from "react-icons/fa";
import { FiActivity, FiArrowUpRight, FiFolder } from "react-icons/fi";
import { SiGo, SiPython, SiRust, SiTypescript } from "react-icons/si";
import styles from "./style.module.scss";

export type RepoId = "portfolio" | "ledger" | "polymarket" | "binance";
export type LanguageKey = "typescript" | "go" | "rust" | "python";

export interface CalendarProps {
  /** ISO date of index 0; every following index is the next UTC day. */
  startDate: string;
  counts: number[];
  levels: number[];
  total: number;
  /** Contributions in private repos, when the source exposes it. */
  restricted: number | null;
}

export interface FeaturedRepo {
  id: RepoId;
  name: string;
  url: string;
  language: LanguageKey;
  pushedAt: string | null;
}

interface GitHubClientProps {
  calendar: CalendarProps | null;
  createdAt: string | null;
  repos: FeaturedRepo[];
  profileUrl: string;
}

const LANGUAGES: Record<LanguageKey, { name: string; icon: IconType }> = {
  typescript: { name: "TypeScript", icon: SiTypescript },
  go: { name: "Go", icon: SiGo },
  rust: { name: "Rust", icon: SiRust },
  python: { name: "Python", icon: SiPython },
};

const DAY_MS = 86_400_000;
const DAYS_PER_WEEK = 7;
/** Rows (Sun = 0) that get a weekday label. */
const LABELLED_WEEKDAYS = [1, 3, 5];
/** Minimum columns between two month labels so they never collide. */
const MIN_LABEL_GAP = 3;
const UTC = { timeZone: "UTC" } as const;

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
  // The year wipes in left → right once instead of staggering 370 cells.
  const reveal: Variants = {
    hidden: { clipPath: reduced ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" },
    visible: {
      clipPath: "inset(0 0 0 0)",
      transition: reduced ? { duration: 0 } : { duration: 0.8, ease: EASE },
    },
  };
  return { section, block, chip, reveal };
}

interface Cell {
  key: string;
  level: number;
  title: string;
}

interface MonthLabel {
  column: number;
  label: string;
}

/**
 * Scrolls a horizontally overflowing heatmap to its newest weeks on mount.
 * Callback refs run at commit time, so this is safe under the React Compiler.
 */
function scrollToEnd(el: HTMLDivElement | null) {
  if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth;
}

export default function GitHubClient({
  calendar,
  createdAt,
  repos,
  profileUrl,
}: GitHubClientProps) {
  const t = useTranslations("GitHub");
  const format = useFormatter();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "-50px" });
  const show = prefersReducedMotion || inView;
  const variants = buildVariants(prefersReducedMotion);

  /* ---------------- Heatmap geometry + derived stats ---------------- */

  let cells: Cell[] = [];
  const months: MonthLabel[] = [];
  let weekCount = 0;
  let leadingBlanks = 0;
  let activeDays = 0;
  let busiestCount = 0;
  let busiestDate: Date | null = null;

  if (calendar) {
    const startMs = Date.parse(`${calendar.startDate}T00:00:00Z`);
    leadingBlanks = new Date(startMs).getUTCDay();
    const dayCount = calendar.counts.length;
    weekCount = Math.ceil((leadingBlanks + dayCount) / DAYS_PER_WEEK);

    cells = calendar.counts.map((count, i) => {
      const date = new Date(startMs + i * DAY_MS);
      if (count > 0) activeDays += 1;
      if (count > busiestCount) {
        busiestCount = count;
        busiestDate = date;
      }
      return {
        key: String(i),
        level: calendar.levels[i] ?? 0,
        title: t("cellTitle", {
          count,
          date: format.dateTime(date, { dateStyle: "medium", ...UTC }),
        }),
      };
    });

    // One label per month, placed on the first week that contains a day of
    // that month. A label that would sit fewer than MIN_LABEL_GAP columns
    // after the previous one replaces it (the later month owns the space).
    let previousMonth = -1;
    for (let week = 0; week < weekCount; week++) {
      const firstIndex = Math.max(0, week * DAYS_PER_WEEK - leadingBlanks);
      if (firstIndex >= dayCount) break;
      const month = new Date(startMs + firstIndex * DAY_MS).getUTCMonth();
      if (month === previousMonth) continue;
      previousMonth = month;
      const label = {
        column: week,
        label: format.dateTime(new Date(startMs + firstIndex * DAY_MS), {
          month: "short",
          ...UTC,
        }),
      };
      const last = months[months.length - 1];
      if (last && week - last.column < MIN_LABEL_GAP) months[months.length - 1] = label;
      else months.push(label);
    }
  }

  // 2024-01-07 is a Sunday; offset by row to get localized weekday names.
  const weekdayLabels = LABELLED_WEEKDAYS.map((row) => ({
    row,
    label: format
      .dateTime(new Date(Date.UTC(2024, 0, 7 + row)), { weekday: "short", ...UTC })
      .replace(/[^\p{L}]/gu, "")
      .slice(0, 3),
  }));

  const activePct = calendar
    ? Math.round((activeDays / calendar.counts.length) * 100)
    : 0;
  const privatePct =
    calendar && calendar.restricted !== null && calendar.total > 0
      ? Math.round((calendar.restricted / calendar.total) * 100)
      : null;
  const busiestLabel = busiestDate
    ? format.dateTime(busiestDate, { dateStyle: "medium", ...UTC })
    : "";
  const sinceYear = createdAt ? new Date(createdAt).getUTCFullYear() : null;

  const summary = calendar
    ? t("heatmapSummary", {
        total: format.number(calendar.total),
        activeDays: format.number(activeDays),
        date: busiestLabel,
        max: format.number(busiestCount),
      })
    : t("unavailable");

  const stats = calendar
    ? [
        {
          id: "contributions",
          value: format.number(calendar.total),
          detail: t("stats.contributions.detail"),
        },
        {
          id: "activeDays",
          value: format.number(activeDays),
          detail: t("stats.activeDays.detail", { pct: activePct }),
        },
        {
          id: "busiestDay",
          value: format.number(busiestCount),
          detail: t("stats.busiestDay.detail", { date: busiestLabel }),
        },
        privatePct !== null
          ? {
              id: "privateWork",
              value: `${format.number(privatePct)}%`,
              detail: t("stats.privateWork.detail"),
            }
          : {
              id: "activeSince",
              value: sinceYear ? String(sinceYear) : "—",
              detail: t("stats.activeSince.detail"),
            },
      ]
    : [];

  return (
    <section
      className={styles.github}
      id="github"
      ref={ref}
      aria-labelledby="github-title"
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
              <FaGithub className={styles.eyebrowIcon} aria-hidden="true" />
              {t("eyebrow")}
            </p>
            <h2 id="github-title" className={styles.sectionTitle}>
              {t("title")}
            </h2>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
            aria-label={t("profileAria")}
          >
            <FaGithub className={styles.chipIcon} aria-hidden="true" />
            <span>{t("profileLink")}</span>
            <FiArrowUpRight className={styles.linkArrow} aria-hidden="true" />
          </a>
        </m.div>

        {stats.length > 0 && (
          <m.ul className={styles.stats} variants={variants.block}>
            {stats.map((stat) => (
              <m.li key={stat.id} className={styles.stat} variants={variants.chip}>
                <span className={styles.statLabel}>{t(`stats.${stat.id}.label`)}</span>
                <strong className={styles.statValue}>{stat.value}</strong>
                <span className={styles.statDetail}>{stat.detail}</span>
              </m.li>
            ))}
          </m.ul>
        )}

        <m.article className={styles.heatmapCard} variants={variants.block}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <FiActivity className={styles.cardIcon} aria-hidden="true" />
              {t("heatmapTitle")}
            </h3>
            {calendar && (
              <p className={styles.legend} aria-hidden="true">
                <span>{t("less")}</span>
                <span className={styles.legendSwatches}>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={styles.legendSwatch}
                      data-level={level}
                    />
                  ))}
                </span>
                <span>{t("more")}</span>
              </p>
            )}
          </div>

          {calendar ? (
            <div
              className={styles.heatmapScroller}
              ref={scrollToEnd}
              tabIndex={0}
              role="region"
              aria-label={t("chartTitle")}
              aria-describedby="github-heatmap-desc"
            >
              <div
                className={styles.heatmap}
                aria-hidden="true"
                style={{ "--weeks": weekCount } as React.CSSProperties}
              >
                <div className={styles.months} aria-hidden="true">
                  {months.map(({ column, label }) => (
                    <span
                      key={column}
                      className={styles.month}
                      style={{ gridColumnStart: column + 1 }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className={styles.weekdays} aria-hidden="true">
                  {weekdayLabels.map(({ row, label }) => (
                    <span
                      key={row}
                      className={styles.weekday}
                      style={{ gridRowStart: row + 1 }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <m.div
                  className={styles.cells}
                  variants={variants.reveal}
                  aria-hidden="true"
                >
                  {Array.from({ length: leadingBlanks }, (_, i) => (
                    <span key={`blank-${i}`} className={styles.blank} />
                  ))}
                  {cells.map((cell) => (
                    <span
                      key={cell.key}
                      className={styles.cell}
                      data-level={cell.level}
                      title={cell.title}
                    />
                  ))}
                </m.div>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderGrid} aria-hidden="true">
                {Array.from({ length: 84 }, (_, i) => (
                  <span key={i} className={styles.cell} data-level={0} />
                ))}
              </div>
              <p className={styles.placeholderText}>{t("unavailable")}</p>
            </div>
          )}
          <p id="github-heatmap-desc" className={styles.srOnly}>
            {summary}
          </p>
        </m.article>

        <div className={styles.reposHeader}>
          <h3 className={styles.cardTitle}>
            <FiFolder className={styles.cardIcon} aria-hidden="true" />
            {t("reposTitle")}
          </h3>
          <a
            href={`${profileUrl}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewAll}
          >
            {t("viewAll")}
            <FiArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className={styles.repos}>
          {repos.map((repo) => {
            const language = LANGUAGES[repo.language];
            const LanguageIcon = language.icon;
            return (
              <m.a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoCard}
                variants={variants.block}
              >
                <span className={styles.repoTop}>
                  <span className={styles.repoName}>{repo.name}</span>
                  <FiArrowUpRight className={styles.repoArrow} aria-hidden="true" />
                </span>
                <span className={styles.repoDescription}>
                  {t(`repos.${repo.id}.description`)}
                </span>
                <span className={styles.repoFooter}>
                  <span className={styles.chip}>
                    <LanguageIcon className={styles.chipIcon} aria-hidden="true" />
                    <span>{language.name}</span>
                  </span>
                  {repo.pushedAt && (
                    <span className={styles.repoMeta}>
                      {t("updated", {
                        date: format.dateTime(new Date(repo.pushedAt), {
                          month: "short",
                          year: "numeric",
                          ...UTC,
                        }),
                      })}
                    </span>
                  )}
                </span>
              </m.a>
            );
          })}
        </div>
      </m.div>
    </section>
  );
}
