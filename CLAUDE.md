# Portfolio – eugenioguevara.com

## Project

Personal developer portfolio built with Next.js 16, React 19, and TypeScript. Deployed on Vercel.

## Commands

- `bun dev` — Start dev server (Turbopack)
- `bun run build` — Production build
- `bun lint` — ESLint (flat config `eslint.config.mjs`; `next lint` was removed in Next 16)
- **Package manager:** bun (not npm/yarn)

## Architecture

- **App Router** with `[locale]` dynamic route (next-intl v4, EN/ES). Locales are defined once in `src/i18n/routing.ts` (`defineRouting`) and shared by `src/proxy.ts` (middleware — renamed from `middleware.ts` in Next 16) and `src/i18n/request.ts` (`getRequestConfig` using `requestLocale`).
- **Rendering:** Pages are Server Components prerendered as static SSG per locale (`generateStaticParams` + `setRequestLocale`). Interactive sections are `"use client"` islands. `NextIntlClientProvider` is used with no props — locale/messages are inherited from the server.
- **Styling:** SCSS Modules + Tailwind CSS v4.3 (Lightning CSS handles prefixing — no autoprefixer).
- **Animations:** GSAP (`useGSAP` from `@gsap/react`, ScrollTrigger) + Framer Motion. Motion runs under `LazyMotion features={domAnimation} strict` (`src/components/MotionProvider`), so **always use `m.*`, never `motion.*`** (strict mode throws otherwise). Hooks (`useScroll`/`useTransform`/`useInView`) still import from `framer-motion`.
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
