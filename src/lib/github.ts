/**
 * GitHub data for the "GitHub Activity" section.
 *
 * Server-only: this module reads `process.env.GITHUB_TOKEN` and is imported
 * exclusively from the async Server Component in `components/GitHub/GitHub.tsx`.
 *
 * Fetch strategy (all requests use the Next data cache with a daily
 * revalidation window, so the page is prerendered at build time and becomes
 * ISR with `revalidate: 86400`):
 *
 *   1. GITHUB_TOKEN present  → one GraphQL request (calendar + repos), cost 1.
 *   2. No token / GraphQL failed → public fallbacks, no auth:
 *        - calendar: github-contributions-api.jogruber.de (v4)
 *        - repos:    api.github.com REST (60 req/h per IP, we need ~2/day)
 *   3. Everything failed:
 *        - at build time (or in dev) → resolve with empty data and log a
 *          one-line warning; the section renders a themed placeholder.
 *        - at runtime revalidation in production → throw, so Next keeps
 *          serving the last successfully generated page instead of caching a
 *          degraded section for a day.
 */

export const GITHUB_LOGIN = "Guevarnation";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_LOGIN}`;

const REVALIDATE_SECONDS = 86_400;
const USER_AGENT = "eugenioguevara.com (portfolio)";
const NEXT_OPTIONS = { revalidate: REVALIDATE_SECONDS, tags: ["github"] };
// A hung upstream must not stall the build worker or hold an ISR regeneration open.
const FETCH_TIMEOUT_MS = 10_000;
const timeoutSignal = () => AbortSignal.timeout(FETCH_TIMEOUT_MS);

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  /** ISO calendar date (YYYY-MM-DD). */
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface RepoActivity {
  name: string;
  url: string;
  pushedAt: string;
}

export interface GitHubData {
  /** Chronological, ~370 days ending today. `null` when no calendar source answered. */
  days: ContributionDay[] | null;
  totalContributions: number | null;
  /** Contributions in private repos (GraphQL only). */
  restrictedContributions: number | null;
  /** Account creation timestamp (ISO). */
  createdAt: string | null;
  /** Public, non-fork repos keyed by name. */
  repos: Record<string, RepoActivity>;
  source: "graphql" | "public" | "none";
}

const EMPTY: GitHubData = {
  days: null,
  totalContributions: null,
  restrictedContributions: null,
  createdAt: null,
  repos: {},
  source: "none",
};

/* ------------------------------------------------------------------ */
/* GraphQL (primary)                                                   */
/* ------------------------------------------------------------------ */

const GRAPHQL_QUERY = `query($login: String!) {
  user(login: $login) {
    createdAt
    repositories(privacy: PUBLIC, ownerAffiliations: OWNER, isFork: false,
                 first: 20, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes { name url pushedAt primaryLanguage { name } }
    }
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

type GraphQLLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

interface GraphQLResponse {
  data?: {
    user: {
      createdAt: string;
      repositories: {
        nodes: {
          name: string;
          url: string;
          pushedAt: string;
          primaryLanguage: { name: string } | null;
        }[];
      };
      contributionsCollection: {
        restrictedContributionsCount: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              contributionLevel: GraphQLLevel;
            }[];
          }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
}

const LEVELS: Record<GraphQLLevel, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchGraphQL(token: string): Promise<GitHubData> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    signal: timeoutSignal(),
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { login: GITHUB_LOGIN } }),
    next: NEXT_OPTIONS,
  });
  if (!res.ok) throw new Error(`GitHub GraphQL responded ${res.status}`);

  const json = (await res.json()) as GraphQLResponse;
  const user = json.data?.user;
  if (!user) {
    throw new Error(
      `GitHub GraphQL returned no user: ${json.errors?.map((e) => e.message).join("; ") ?? "unknown"}`
    );
  }

  const calendar = user.contributionsCollection.contributionCalendar;
  const days: ContributionDay[] = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVELS[d.contributionLevel] ?? 0,
    }))
  );

  const repos: Record<string, RepoActivity> = {};
  for (const node of user.repositories.nodes) {
    // The profile-README repo has no language; skip it.
    if (node.name === GITHUB_LOGIN || !node.primaryLanguage) continue;
    repos[node.name] = { name: node.name, url: node.url, pushedAt: node.pushedAt };
  }

  return {
    days,
    totalContributions: calendar.totalContributions,
    restrictedContributions: user.contributionsCollection.restrictedContributionsCount,
    createdAt: user.createdAt,
    repos,
    source: "graphql",
  };
}

/* ------------------------------------------------------------------ */
/* Public fallbacks (no auth)                                          */
/* ------------------------------------------------------------------ */

interface JogruberResponse {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
}

async function fetchPublicCalendar(): Promise<
  Pick<GitHubData, "days" | "totalContributions">
> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_LOGIN}?y=last`,
    { headers: { "User-Agent": USER_AGENT }, next: NEXT_OPTIONS, signal: timeoutSignal() }
  );
  if (!res.ok) throw new Error(`Contributions API responded ${res.status}`);
  const json = (await res.json()) as JogruberResponse;
  if (!Array.isArray(json.contributions) || json.contributions.length === 0) {
    throw new Error("Contributions API returned no days");
  }
  const days: ContributionDay[] = json.contributions.map((d) => ({
    date: d.date,
    count: d.count,
    level: Math.max(0, Math.min(4, Math.round(d.level))) as ContributionLevel,
  }));
  const total =
    typeof json.total?.lastYear === "number"
      ? json.total.lastYear
      : days.reduce((sum, d) => sum + d.count, 0);
  return { days, totalContributions: total };
}

interface RestRepo {
  name: string;
  html_url: string;
  pushed_at: string;
  language: string | null;
  fork: boolean;
}

async function fetchPublicRepos(): Promise<
  Pick<GitHubData, "repos" | "createdAt">
> {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  const [reposRes, userRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_LOGIN}/repos?sort=pushed&per_page=20`, {
      headers,
      next: NEXT_OPTIONS,
      signal: timeoutSignal(),
    }),
    fetch(`https://api.github.com/users/${GITHUB_LOGIN}`, {
      headers,
      next: NEXT_OPTIONS,
      signal: timeoutSignal(),
    }),
  ]);
  if (!reposRes.ok) throw new Error(`GitHub REST /repos responded ${reposRes.status}`);

  const list = (await reposRes.json()) as RestRepo[];
  const repos: Record<string, RepoActivity> = {};
  for (const r of list) {
    if (r.fork || r.name === GITHUB_LOGIN || !r.language) continue;
    repos[r.name] = { name: r.name, url: r.html_url, pushedAt: r.pushed_at };
  }

  let createdAt: string | null = null;
  if (userRes.ok) {
    const user = (await userRes.json()) as { created_at?: string };
    createdAt = user.created_at ?? null;
  }
  return { repos, createdAt };
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

let warnedFallback = false;
function warnOnce(message: string) {
  if (warnedFallback) return;
  warnedFallback = true;
  console.warn(`[github] ${message}`);
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * True while a route is being regenerated at runtime in production (ISR).
 * In that situation a failure must propagate so Next keeps the last good
 * page; at build time and in development we degrade gracefully instead.
 */
function isRuntimeRevalidation(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  );
}

export async function getGitHubData(): Promise<GitHubData> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      return await fetchGraphQL(token);
    } catch (error) {
      if (isRuntimeRevalidation()) throw error;
      warnOnce(
        `GraphQL request failed (${describe(error)}); falling back to public APIs.`
      );
    }
  } else {
    warnOnce(
      "GITHUB_TOKEN is not set; using the public contributions API + REST fallback (set it on Vercel for the authoritative GraphQL source)."
    );
  }

  const [calendar, repos] = await Promise.allSettled([
    fetchPublicCalendar(),
    fetchPublicRepos(),
  ]);

  if (calendar.status === "rejected") {
    if (isRuntimeRevalidation()) throw calendar.reason;
    console.warn(
      `[github] Contribution calendar unavailable (${describe(calendar.reason)}); rendering placeholder.`
    );
  }
  if (repos.status === "rejected") {
    console.warn(`[github] Public repo metadata unavailable (${describe(repos.reason)}).`);
  }

  if (calendar.status === "rejected" && repos.status === "rejected") return EMPTY;

  return {
    ...EMPTY,
    ...(calendar.status === "fulfilled" ? calendar.value : {}),
    ...(repos.status === "fulfilled" ? repos.value : {}),
    source: "public",
  };
}
