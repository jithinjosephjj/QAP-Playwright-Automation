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

## Linked Metal tag journey (18-09-2026)

The four Metal direction flows share one tag where a tag can physically flow:

| Spec | Direction | State file |
|---|---|---|
| `ho-ho-tag-transfer-workflow` | Kakkanad HO -> Aluva HO | `e2e-ho-ho-tag-transfer-state.json` (own tag) |
| `ho-branch-tag-transfer-workflow` | Kakkanad HO -> Palakkad (SEED) | `e2e-metal-tag-journey-state.json` |
| `branch-ho-tag-transfer-workflow` | Palakkad -> Kakkanad | same file - moves the seeded tag |
| `branch-branch-tag-transfer-workflow` | Palakkad -> Cochin | same file - moves the seeded tag |

The shared state carries `location` (written by every Transfer In). The two
reverse flows run only while `location` is `Palakkad`; only one of them can
take a given tag, so run HO-Branch again for the next journey. The Brand and
Stone variants still seed their own tags (per-entity state files).
