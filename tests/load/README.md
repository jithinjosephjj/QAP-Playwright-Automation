# tests/load — page-load smoke suite (TC-LOAD-*)

"Open every page, click its Add button, make sure nothing broke."

A breadth-first health check of the whole application: one test per screen
in the sidebar menu (157 routes on qap as of 15-09-2026), independent of the
deep transaction workflows under `tests/e2e-qap`. Run it after a deployment
or before a regression cycle to spot screens that no longer open, loaders
that never clear, add forms that fail to appear, and API calls that error.

## What each page test checks

| Check | Failure (test goes red) | Warning (reported only) |
|---|---|---|
| Route renders | redirected (incl. to `/login`), blank page, error text ("something went wrong", "page not found", "unauthorized"…), error toast | "under construction" screen |
| Loader | full-screen spinner / large grid spinner still up after 30 s (STUCK) | — |
| Add button (`+` ri-add icon, or a button captioned Add/New/Create) | clicked but no offcanvas / modal / wizard / new fields / route change within 12 s; loader stuck after Add; error toast after Add | page has no Add button (reports, dashboards, read-only screens) |
| API health (`/sioniq/` calls during load + Add) | any HTTP 4xx / 5xx | network-level failures |
| Script health | uncaught JS error (`pageerror`) | console `error` entries |

Timings are recorded for every page (load, loader, Add) and the report lists
the 10 slowest.

## Files

- `page-catalog.js` — the route list, grouped by module in sidebar order.
  Generated from the qap sidebar (`a[href]` of the logged-in Admin).
- `_page-load-check.js` — the check itself (`checkPage`) and the report
  renderer. No assertions in here; the spec decides what fails.
- `page-load-smoke.noauth.spec.js` — TC-LOAD-000 (catalog vs live menu,
  soft) + TC-LOAD-001…N (one per catalog entry).

## Running

```
SIONIQ_CLIENT=qap npx playwright test tests/load --headed
SIONIQ_CLIENT=qap npx playwright test tests/load --headed -g "Procurement"
SIONIQ_CLIENT=qap npx playwright test tests/load --headed -g "Stock Inward|Transfers"
```

Must run headed (Device Radar gate). Login happens once for the whole run —
the suite shares one browser page across its tests and logs in again only if
the app drops the session (Playwright also restarts the worker after any
failed test, which costs one extra login). A full run takes roughly 25–35
minutes.

Running in module chunks: every run resets the results file unless
`LOAD_KEEP=1` is set, so one report can be built up chunk by chunk:

```
SIONIQ_CLIENT=qap npx playwright test tests/load --headed -g "TC-LOAD-000|Admin"
LOAD_KEEP=1 SIONIQ_CLIENT=qap npx playwright test tests/load --headed -g "Procurement"
LOAD_KEEP=1 SIONIQ_CLIENT=qap npx playwright test tests/load --headed -g "Inventory"
...
```

Catalog entries can carry `skip: '<reason>'` — the page test is then skipped
with that reason (used for `/pages-profile`, the user-profile link, which
drops the session when opened).

## Output

Written to `reports/page-load/` (gitignored; deliberately NOT under
`test-results/`, which Playwright empties at the start of every run):

- `page-load-report.md` — human summary: failures, app-wide script errors,
  pages without Add, slowest pages, full table.
- `page-load-report.json` — the raw records; `page-load-results.jsonl` is the
  append log the report is built from.
- `screens/<route>.png` — screenshot of each failing page (also attached to
  the Playwright HTML report).
- `page-load-report.html` — standalone, filterable HTML version of the same
  report; regenerate it after a run with `node tests/load/render-html-report.js`.

A route that lands on `/login` is retried once after a fresh login; if it
bounces again it is reported as a route guard / permission problem, not a
session loss.

## Keeping the catalog current

TC-LOAD-000 compares the live sidebar with `page-catalog.js` and lists any
new or removed routes in its output (soft failure). Add new routes to the
catalog under their module block.
