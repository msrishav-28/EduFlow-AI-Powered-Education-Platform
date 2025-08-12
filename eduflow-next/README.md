# EduFlow — Next.js Frontend

This is the Next.js frontend for EduFlow. It includes Tailwind CSS, Framer Motion, Zustand, React Query, and PWA support.

## Quick start

1. Copy envs

```bash
cp .env.example .env.local
# Fill Firebase NEXT_PUBLIC_* and optionally GOOGLE_GENAI_API_KEY / OLLAMA_BASE_URL
```

2. Install dependencies

```bash
npm install
```

3. Run dev server

```bash
npm run dev
```

4. Open http://localhost:3000

5. Optional health checks
- /api/health/ai → verifies Gemini key presence and Ollama availability

## Features
- App Router (Next 14)
- Tailwind CSS with custom theme
- Framer Motion animations
- React Query for data fetching
- Zustand for state management
- PWA via next-pwa
- Accessible UI components (skip link, focus rings, aria-live regions, labeled charts)
- Security headers (CSP, HSTS, Permissions-Policy), markdown sanitization
- Structured metadata & JSON-LD for SEO
- Jest + Testing Library + jest-axe tests

## Architecture Overview
```
app/                Route groups & pages
	(app)/dashboard   Authenticated study modules (chat, mcq, pdf, analysis, etc.)
	api/ai/generate   Unified AI generation endpoint (Gemini/Ollama, streaming)
components/         UI + layout primitives
lib/                api wrappers, firebase, seo helpers, mcq parser
store/              Zustand provider selection
__tests__/          Unit & a11y tests
```

Data Flow:
User Action -> Page component -> aiGenerate / aiGenerateStream -> /api/ai/generate -> Provider SDK or Ollama HTTP -> Streamed tokens -> UI state -> Firestore session log.

## SEO & Metadata
- Base JSON-LD (WebApplication) injected in root layout.
- Per-module metadata via `moduleMeta()` helper (example: Chat page).
- OpenGraph & Twitter summary tags auto-derived.
- Extend by adding `export const metadata` to other dashboard pages.

## Security
- CSP (adjust domains as new providers added).
- HSTS + Permissions-Policy hardened.
- Markdown sanitized (rehype-sanitize) before rendering AI output.
- Future: Firestore security rules & Sentry instrumentation.

## Testing
- `api.test.ts` covers error + success path for aiGenerate.
- `mcq.test.ts` validates JSON & plain-text parsing including answer detection.
- `a11y.test.tsx` baseline jest-axe check.
- Extend with streaming and PDF parsing mocks next.

## Contributing (Extended)
Run full quality gates locally:
```bash
npm run lint
npm run type-check
npm test
npm run build
```
Open a PR; GitHub Actions will validate.

## Roadmap / Next Steps
- Add per-module metadata exports for all routes.
- Bundle analysis & further code-splitting of markdown/highlight.
- Sentry + Web Vitals reporting hook.
- Firestore security rules & SECURITY.md.
- Optional: export sessions / notes as CSV/JSON.

### Observability
Enable Sentry (after adding dependency):
```
npm install @sentry/nextjs
npx sentry-wizard -i nextjs
```
Set SENTRY_DSN in env. Web Vitals are forwarded via reportWebVitals -> monitoring helper (captures via Sentry if present).

Analyze bundle:
```
ANALYZE=true npm run build
```
Opens interactive treemap to guide additional dynamic imports.


## Notes
- Add real icons to `public/icons/` for better PWA install prompts.
- The app guards Firebase during SSR; if envs aren’t set, auth is disabled but pages still render.
