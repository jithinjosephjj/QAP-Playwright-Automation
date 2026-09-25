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

## Metal tag journey (QA lead, 18-09-2026)

One tag, one shared state file (`e2e-metal-tag-journey-state.json`), four legs
in this order - every leg checks the state's `location` before moving the tag:

| Leg | Spec | Direction |
|---|---|---|
| 1 HO -> HO | `ho-ho-tag-transfer-workflow` (TC-HHT-01..07) | Kakkanad -> Aluva (creates the tag) |
| 2 HO -> Branch | `ho-branch-tag-transfer-workflow` (TC-HBT-01..02) | Aluva -> Cochin (an HO is process-wise: the received tag sits in Transfer FVHK under From Transaction Type InterStockAccept) |
| 3 Branch -> Branch | `branch-branch-tag-transfer-workflow` (TC-BB-01..02) | Cochin -> Palakkad |
| 4 Branch -> HO | `branch-ho-tag-transfer-workflow` (TC-BH-01..02) | Palakkad -> Kakkanad |

Run the whole loop with
`SIONIQ_CLIENT=qap npx playwright test tests/e2e-qap/ho-ho-tag-transfer-workflow.noauth.spec.js tests/e2e-qap/ho-branch-tag-transfer-workflow.noauth.spec.js tests/e2e-qap/branch-branch-tag-transfer-workflow.noauth.spec.js tests/e2e-qap/branch-ho-tag-transfer-workflow.noauth.spec.js --workers=1`.
The Brand and Stone variants still seed their own tags (per-entity state files).

## Metal inward -> Locker -> Locker -> Lot process (QA lead, 25-09-2026)

`metal-inward-locker-transfer-workflow` (TC-MILT-01..07, state
`e2e-qap-metal-inward-locker-transfer-state.json`), all at Kakkanad through
Internal Stock Transfer + Accept:

| Step | Transfer | Accept |
|---|---|---|
| 01 | Metal Inward, gross weight 100 (Celestia Jewels P, Tendulkar) | - |
| 02 | Department -> Locker, To Employee Sioniquser2 (To Locker auto-fills) | Received At Locker / Employee Sioniquser2, From Department |
| 03 | Locker -> Locker, Sioniquser2 -> Sioniquser3 | Received At Locker / Employee Sioniquser3, From Locker / Sioniquser2 |
| 04 | Locker (Sioniquser3) -> Process "Lot FVHK" | Received At Process "Lot FVHK", From Locker / Sioniquser3 |
| 05 | Lot Generation from the Lot-process stock (employee Sioniquser1) | - |
| 06 | Barcode generation (login Sioniquser1) -> tag | - |
| 07 | Process "Lot FVHK" -> Process "Transfer FVHK", Stock Identity Type "Tag Number" | Received At Process "Transfer FVHK", From Process "Lot FVHK", tagwise |

Stock Entity Type for metal inward stock is **Material** (the list reads Alloy /
Brand / Metal Stock / Stone / Material since 24-09-2026). Locker stock grids
show article + weight but no inward number, so the locker legs pick the row by
the article code `G-CB-NK-Tendulkar`. Run: `npm run test:locker-transfer`.
