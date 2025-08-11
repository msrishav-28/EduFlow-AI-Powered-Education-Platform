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
- Accessible UI components

## Notes
- Add real icons to `public/icons/` for better PWA install prompts.
- The app guards Firebase during SSR; if envs aren’t set, auth is disabled but pages still render.
