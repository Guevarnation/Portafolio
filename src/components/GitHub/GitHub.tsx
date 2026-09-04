import { getGitHubData, GITHUB_PROFILE_URL } from "@/lib/github";
import GitHubClient, {
  type CalendarProps,
  type FeaturedRepo,
  type RepoId,
  type LanguageKey,
} from "./GitHubClient";

/**
 * Curated public repos — one per language in the profile bio. Descriptions
 * live in messages/*.json under `GitHub.repos.<id>.description`; GitHub's own
 * strings are too terse ("technical interview"). `pushedAt` is filled from
 * the API at build time when available.
 */
const FEATURED: { id: RepoId; name: string; language: LanguageKey }[] = [
  { id: "portfolio", name: "Portafolio", language: "typescript" },
  { id: "ledger", name: "supercool-ledger", language: "go" },
  { id: "polymarket", name: "rust-polymarket-bot", language: "rust" },
  { id: "binance", name: "binance_futures_bot", language: "python" },
];

const DAY_MS = 86_400_000;

function toUtcDay(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Async Server Component: fetches once at build time (ISR daily), reduces the
 * payload to a few small arrays and hands them to the animated client island.
 */
export default async function GitHub() {
  const data = await getGitHubData();

  let calendar: CalendarProps | null = null;
  if (data.days && data.days.length > 0) {
    // Re-key by date so any gap in the source becomes a 0-count day and the
    // client can derive every date from `startDate` + index.
    const byDate = new Map(data.days.map((d) => [d.date, d]));
    const start = toUtcDay(data.days[0].date);
    const end = toUtcDay(data.days[data.days.length - 1].date);
    const counts: number[] = [];
    const levels: number[] = [];
    for (let ms = start; ms <= end; ms += DAY_MS) {
      const day = byDate.get(toIsoDate(ms));
      counts.push(day?.count ?? 0);
      levels.push(day?.level ?? 0);
    }
    calendar = {
      startDate: toIsoDate(start),
      counts,
      levels,
      total: data.totalContributions ?? counts.reduce((sum, c) => sum + c, 0),
      restricted: data.restrictedContributions,
    };
  }

  const repos: FeaturedRepo[] = FEATURED.map((repo) => {
    const live = data.repos[repo.name];
    return {
      ...repo,
      url: live?.url ?? `${GITHUB_PROFILE_URL}/${repo.name}`,
      pushedAt: live?.pushedAt ?? null,
    };
  });

  return (
    <GitHubClient
      calendar={calendar}
      createdAt={data.createdAt}
      repos={repos}
      profileUrl={GITHUB_PROFILE_URL}
    />
  );
}
