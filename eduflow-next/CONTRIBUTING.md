# Contributing to EduFlow (Next.js Frontend)

## Development Workflow
1. Fork & clone
2. Create a feature branch: `git checkout -b feat/short-description`
3. Install deps: `npm install`
4. Run dev server: `npm run dev`
5. Write tests for new logic
6. Ensure quality gates pass:
```bash
npm run lint
npm run type-check
npm test
npm run build
```
7. Commit using conventional style: `feat(chat): add streaming status indicator`
8. Open PR against `master`

## Code Style
- TypeScript strictness (no implicit any) enforced via `tsc --noEmit`
- Prefer functional components & hooks; avoid class components
- Small composable utilities in `lib/`
- Keep components accessible (focus management, aria labels)

## Testing Guidelines
| Layer | Tools | Notes |
|-------|-------|-------|
| Unit | Jest, Testing Library | Components, utils, hooks |
| Accessibility | jest-axe | Add targeted a11y tests for new complex UI |
| Integration (future) | Playwright | Auth + module flows |

## Commit Message Format
`<type>(scope): <summary>`
Types: feat, fix, docs, test, refactor, perf, chore, security

## Performance Practices
- Dynamic import heavy libs (Monaco, markdown highlight)
- Avoid unnecessary re-renders (memo where needed)
- Measure Web Vitals (planned hook)

## Security Practices
- Never expose secret keys in client code
- Sanitize any user or model-provided HTML (already applied to markdown)
- Update CSP if adding external domains

## Adding Metadata
Use helper in `lib/seo.ts`:
```ts
export const metadata = moduleMeta('Page Title', 'Description of page')
```

## Releasing
1. Ensure CHANGELOG (future) updated
2. Tag commit: `git tag -a vX.Y.Z -m "Release"` and push tags
3. Verify CI pipeline green

## Questions?
Open a discussion or draft PR for feedback early.
