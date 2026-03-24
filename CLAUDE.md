# Portfolio – eugenioguevara.com

## Project

Personal developer portfolio built with Next.js 16, React 19, and TypeScript. Deployed on Vercel.

## Commands

- `bun dev` — Start dev server (Turbopack)
- `bun run build` — Production build
- `bun lint` — ESLint
- **Package manager:** bun (not npm/yarn)

## Architecture

- **App Router** with `[locale]` dynamic route (next-intl, EN/ES)
- **Styling:** SCSS Modules + Tailwind CSS v4.2
- **Animations:** GSAP (ScrollTrigger) + Framer Motion + Locomotive Scroll
- **Path alias:** `@/*` → `./src/*`
- **Assets:** Videos/images on Cloudinary, static images in `/public/images/`

## Structure

```
src/
  app/[locale]/       — Pages and layouts
  components/         — Feature components (Landing, Projects, TechStack, etc.)
  common/             — Reusable components (RoundedButton, Magnetic)
  i18n/               — Internationalization config
messages/             — Translation files (en.json, es.json)
```

## Conventions

- All user-facing text must have EN and ES translations in `messages/`
- Components use SCSS Modules (`.module.scss`) for scoped styles
- TypeScript strict mode enabled
- Keep animations performant — use `will-change`, GPU-accelerated transforms
