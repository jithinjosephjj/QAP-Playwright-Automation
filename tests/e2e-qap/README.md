# e2e-qap — client "qap" (process-wise) transaction workflows

E2E transaction workflow specs for the **qap client** (`https://qap.sioniq.com`,
Admin / 123, BU Cochin). This client's transaction pages follow a different
(process-wise) workflow than the qa client; master screens are the same, so the
shared specs under `tests/masters`, `tests/hrm`, `tests/crm`, `tests/inward`
and the shared page objects under `pages/` are reused as-is.

## Conventions (same as tests/e2e)

- File names: `<workflow>.noauth.spec.js` — e2e specs run in the `no-auth`
  project and log in themselves via `LoginPage` (Device Radar gate means they
  MUST run headed).
- State files: `makeState('e2e-qap-<workflow>-state.json')` so document numbers
  never collide with the qa client's state files.
- Import `{ test, expect }` from `../../fixtures/test-fixtures`.

## Running

```
npm run e2e:qap        # this folder, headed, against qap
npm run test:qap       # whole suite against qap (tests/e2e is auto-ignored)
```

The active client comes from `SIONIQ_CLIENT` in `.env` (see `utils/env.js`);
`playwright.config.js` ignores the other clients' e2e folders automatically.
