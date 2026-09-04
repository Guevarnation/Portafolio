# eugenioguevara.com

Personal portfolio of Eugenio Guevara, full-stack developer and economist based in Monterrey, Mexico. Bilingual (EN/ES) single-page site with a preloader, project showcase, tech stack, GitHub activity and contact section.

Live: https://www.eugenioguevara.com

## Stack

- Next.js 16 (App Router, React Server Components, static prerender per locale)
- React 19, TypeScript (strict)
- next-intl v4 for `/en` and `/es` routing and translations
- Tailwind CSS v4 + SCSS Modules
- GSAP (`useGSAP`, ScrollTrigger) and Framer Motion (`LazyMotion` strict, `m.*` components)
- Videos and posters served from Cloudinary; static images in `public/images/`
- Vercel Analytics

## Commands

Package manager is **bun**.

```bash
bun install        # install dependencies
bun dev            # dev server (Turbopack) at http://localhost:3000
bun run build      # production build
bun run start      # serve the production build
bun lint           # ESLint (flat config)
bun run typecheck  # tsc --noEmit
```

## Structure

```
src/
  app/
    [locale]/            # layout (metadata, JSON-LD), page, opengraph-image, not-found
    sitemap.ts           # /sitemap.xml with hreflang alternates
    robots.ts            # /robots.txt
  components/            # Feature sections (Landing, Projects, TechStack, GitHub, Contact, ...)
                         # + MotionProvider (LazyMotion), IntroOverlay + Preloader
  common/                # Reusable pieces (RoundedButton, Magnetic)
  i18n/                  # routing.ts (defineRouting) + request.ts (getRequestConfig)
  proxy.ts               # next-intl locale middleware
messages/                # en.json / es.json (identical key structure)
public/images/           # Static images and store badges
```

## Conventions

- Every user-facing string lives in both `messages/en.json` and `messages/es.json`.
- Use `m.*` from Framer Motion (never `motion.*`) because motion runs under `LazyMotion strict`.
- Use `useGSAP` for GSAP animations so they are reverted automatically.
- Scoped styles go in `*.module.scss`; Tailwind utilities are fine for layout.

## Deployment

Deployed on Vercel. The canonical host is `https://www.eugenioguevara.com`; the apex domain 308-redirects to `www`. Every absolute URL in metadata, sitemap, robots, JSON-LD and Open Graph uses the `www` host, and `next.config.mjs` sends `X-Robots-Tag: noindex, nofollow` on any other host (preview deployments, `*.vercel.app`, localhost).

## Environment

`GITHUB_TOKEN` (optional): fine-grained personal access token with read-only access to public repositories. Powers the GitHub section at build time and daily ISR revalidation; without it the build falls back to public APIs. See `.env.example`.
