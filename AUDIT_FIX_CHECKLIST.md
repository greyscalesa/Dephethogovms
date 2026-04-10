# Prioritized Fix Checklist

## P0 (Critical)
- [x] Harden authentication/session security:
  - Replace unsigned JSON session cookie with signed JWT session cookie.
  - Validate `session` token in middleware and auth endpoints.
  - Support bcrypt password verification (`$2*`) with legacy plaintext fallback.
- [x] Add baseline CI guardrails:
  - Run install, lint, and build on every PR/push.
- [x] Add `.env.example`:
  - Document required runtime secrets and public keys.
- [x] Enforce route-level authorization on all current API routes:
  - All current non-auth endpoints now enforce authenticated access and company/site scoping.
  - New endpoints must apply the same guard pattern.
- [ ] Remove plaintext password storage from DB:
  - [x] New employee passwords are now written as bcrypt hashes.
  - [x] Added one-time migration utility with dry-run/apply mode (`npm run migrate:passwords`).
  - [ ] Existing plaintext records still need migration execution in your environment.

## P1 (High)
- [ ] Add API request validation with `zod`:
  - Validate payloads for visitor/booking/employee/etc. writes.
- [ ] Add automated tests:
  - Start with auth/session, middleware protection, and critical API routes.
- [ ] Improve security defaults:
  - Prevent fallback secrets/keys in production startup.
  - Add stricter cookie controls where applicable.
- [ ] Improve operational logging:
  - Replace ad hoc `console.error` with structured server logging.

## P2 (Medium)
- [ ] Expand README:
  - Setup, env matrix, local/dev/prod runbook, and troubleshooting.
- [ ] Add deploy runbook for Netlify:
  - Build command, runtime env vars, and rollback checklist.
- [ ] Add code quality consistency:
  - Optional formatter config and contribution standards.
