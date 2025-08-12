# Security Policy

## Supported Versions
The project is under active development; only the `master` branch receives security updates.

## Reporting a Vulnerability
Please open a private security advisory or email the maintainer before creating a public issue. Provide:
- Affected route or component
- Reproduction steps / payload
- Expected vs actual behavior
- Potential impact (data exposure, XSS, etc.)

## Hardening Measures Implemented
- Strict security headers (CSP, HSTS, Permissions-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Markdown sanitization (rehype-sanitize) for AI output
- Principle of least privilege pending Firestore rules (draft to be added)
- Dependency scanning via GitHub (enable Dependabot)

## Planned
- Firestore security rules file & review checklist
- Sentry error monitoring & alerting
- Automated CSP report-only collection endpoint
- Regular dependency audit in CI (npm audit --production)

## Firestore Rules (Draft Outline)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Responsible Disclosure
We aim to respond within 72 hours. Critical issues will be prioritized with a patch release.
