# Portfolio – eugenioguevara.com

## Project

Personal developer portfolio built with Next.js 16, React 19, and TypeScript. Deployed on Vercel.

## Commands

- `bun dev` — Start dev server (Turbopack is the default in Next 16; no flag needed)
- `bun run build` — Production build
- `bun lint` — ESLint (flat config `eslint.config.mjs`; `next lint` was removed in Next 16)
- `bun run typecheck` — `tsc --noEmit`
- **Package manager:** bun (not npm/yarn)

## Architecture

- **App Router** with `[locale]` dynamic route (next-intl v4, EN/ES). Locales are defined once in `src/i18n/routing.ts` (`defineRouting`, plus `SITE_URL`/`localeUrl()` for every absolute URL) and shared by `src/proxy.ts` (middleware — renamed from `middleware.ts` in Next 16) and `src/i18n/request.ts` (`getRequestConfig` reading the `[locale]` root param via `next/root-params`; `requestLocale` and `setRequestLocale` are deprecated in next-intl 4.13.5+ and must not be reintroduced).
- **URL structure:** `localePrefix: "as-needed"` — English is `/` (canonical, `x-default`), Spanish is `/es`; `/en/...` 307s to the unprefixed path. Never hardcode `/en`; use `localeUrl(locale)`. The proxy matcher skips paths with a dot and `*opengraph-image`, so `/en/opengraph-image` (the URL Next writes into `og:image`) serves the PNG directly.
- **Rendering:** Pages are Server Components prerendered as static SSG per locale (`generateStaticParams` in the layout; no `setRequestLocale`). The layout reads the locale with `getLocale()`. Interactive sections are `"use client"` islands. `NextIntlClientProvider` is used with no props — locale/messages are inherited from the server.
- **Styling:** SCSS Modules + Tailwind CSS v4.3 (Lightning CSS handles prefixing — no autoprefixer).
- **Animations:** GSAP (`useGSAP` from `@gsap/react`, ScrollTrigger) + Framer Motion. Motion runs under `LazyMotion features={domAnimation} strict` (`src/components/MotionProvider`), so **always use `m.*`, never `motion.*`** (strict mode throws otherwise). Hooks (`useScroll`/`useTransform`/`useInView`) still import from `framer-motion`.
- **React Compiler:** enabled (`reactCompiler: true`); `eslint-plugin-react-hooks` v7 rules are the compiler's rules, so lint errors like `set-state-in-effect` must be fixed, not disabled.
- **Page canvas:** TechStack, GitHub and Contact sit inside `.dark` in `app/[locale]/page.tsx`; TechStack and GitHub have no background of their own so Contact (scroll-linked `y` from -200 to 0, -80 on mobile) shows through the repo-card gaps. GitHub keeps `position: relative; z-index: 1` and opaque card surfaces.
- **Lazy islands (measured, not used):** `next/dynamic` from a Server Component (page.tsx) splits the chunk but still ships it as an initial `<script async>`; from a Client Component wrapper it does defer, but for this bundle it fragmented shared modules into four extra chunks (+3.8 KB gz net) for 5 KB deferred. Initial JS is ~290 KB gz, 80 % of it next runtime + react-dom + gsap/motion/intl-messageformat; there is nothing left to lazy-load profitably. Never lazy-load Header, Landing or IntroOverlay.
- **Resource hints:** `preconnect`/`prefetchDNS` from `react-dom` in the layout (the Metadata API has no field for them). The hero `<Image>` uses `preload` + `fetchPriority="high"`.
- **GitHub section:** `src/lib/github.ts` is a server-only data module (GraphQL with `GITHUB_TOKEN`, public fallbacks without it) fetched at build time with `revalidate: 86400`, so `/` and `/es` are ISR (daily) rather than pure SSG. The token must be a fine-grained PAT limited to public repositories (read-only); a broader token changes the "private client work" stat. See `.env.example`.
- **Path alias:** `@/*` → `./src/*`
- **Assets:** Videos/images on Cloudinary, static images in `/public/images/`

## Structure

```
src/
  app/[locale]/       — Pages and layouts (page is a Server Component)
  components/         — Feature components (Landing, Projects, TechStack, etc.)
                        + MotionProvider (LazyMotion), IntroOverlay (preloader)
  common/             — Reusable components (RoundedButton, Magnetic)
  i18n/               — routing.ts (defineRouting) + request.ts (getRequestConfig)
messages/             — Translation files (en.json, es.json)
```

## Conventions

- All user-facing text must have EN and ES translations in `messages/`
- Components use SCSS Modules (`.module.scss`) for scoped styles
- TypeScript strict mode enabled
- Keep animations performant — use `will-change`, GPU-accelerated transforms
- Use `m.*` (LazyMotion) for Framer Motion elements; use `useGSAP` (not raw `useEffect`/`useLayoutEffect`) for GSAP so animations are auto-reverted

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
