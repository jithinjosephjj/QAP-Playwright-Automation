const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { LoginPage } = require('../../pages/LoginPage');
const env = require('../../utils/env');
const { PAGE_CATALOG } = require('./page-catalog');
const { checkPage, renderReport } = require('./_page-load-check');

/**
 * PAGE-LOAD SMOKE SUITE (TC-LOAD-*) - "does every screen open, and does its
 * Add button work?"
 *
 * One test per catalogued route (tests/load/page-catalog.js - every sidebar
 * menu entry the Admin sees). Each test opens the route, waits for the app
 * loader, verifies the screen rendered, clicks the Add (+) button and
 * verifies the add form opened - while watching for failed API calls,
 * error toasts, stuck loaders and uncaught JS errors. See
 * _page-load-check.js for the exact rules.
 *
 * Login happens ONCE per run (shared browser page) - 150+ logins would
 * dominate the runtime. If the app drops the session mid-run the next test
 * logs in again. MUST run headed (Device Radar gate).
 *
 * Output: test-results/load/page-load-report.{json,md} (+ a screenshot per
 * failing page). Filter with -g, e.g. -g "Procurement" or -g "Stock Inward".
 *
 * Run:  SIONIQ_CLIENT=qap npx playwright test tests/load --headed
 */

// NOT under test-results/: Playwright empties that folder at the start of
// every run, which would destroy the results of earlier chunks (LOAD_KEEP).
const OUT_DIR = path.join(__dirname, '..', '..', 'reports', 'page-load');
// Results are appended to a JSONL file rather than kept in memory: Playwright
// restarts the worker after a failed test, which would re-run beforeAll and
// wipe an in-memory array. workerIndex 0 = the first worker of the run.
const RESULTS_FILE = path.join(OUT_DIR, 'page-load-results.jsonl');
const META_FILE = path.join(OUT_DIR, 'page-load-meta.json');

function readResults() {
  try {
    return fs.readFileSync(RESULTS_FILE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch { return []; }
}
function readMeta() {
  try { return JSON.parse(fs.readFileSync(META_FILE, 'utf8')); } catch { return { client: env.CLIENT, url: env.URL, startedAt: '' }; }
}

/** @type {import('@playwright/test').BrowserContext} */
let context;
/** @type {import('@playwright/test').Page} */
let page;

async function loginShared() {
  const login = new LoginPage(page);
  await login.open();
  await login.login();
  await login.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
  await page.waitForLoadState('domcontentloaded');
}

test.describe('Page-load smoke [' + env.CLIENT + ']', () => {
  test.describe.configure({ mode: 'default' }); // independent tests, shared session

  test.beforeAll(async ({ browser }, workerInfo) => {
    workerInfo.setTimeout(180_000); // login can retry up to 4x under load
    fs.mkdirSync(OUT_DIR, { recursive: true });
    if (workerInfo.workerIndex === 0 && process.env.LOAD_KEEP !== '1') {
      // fresh run: reset the accumulated results (LOAD_KEEP=1 appends, for
      // running the catalog in module chunks: -g "Admin", then -g "Inventory"...)
      fs.writeFileSync(RESULTS_FILE, '');
      fs.writeFileSync(META_FILE, JSON.stringify({ client: env.CLIENT, url: env.URL, startedAt: new Date().toISOString() }));
    }
    context = await browser.newContext({ viewport: null, ignoreHTTPSErrors: true });
    page = await context.newPage();
    await loginShared();
  });

  // Runs after every worker (also after a restart) - re-renders the report
  // from everything collected so far, so the last one wins with the full set.
  test.afterAll(async () => {
    const meta = { ...readMeta(), finishedAt: new Date().toISOString() };
    const results = readResults();
    fs.writeFileSync(path.join(OUT_DIR, 'page-load-report.json'), JSON.stringify({ meta, results }, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'page-load-report.md'), renderReport(results, meta));
    const c = { PASS: 0, WARN: 0, FAIL: 0 };
    for (const r of results) c[r.status]++;
    console.log(`\nPage-load smoke so far: ${results.length} pages - PASS ${c.PASS}, WARN ${c.WARN}, FAIL ${c.FAIL}`);
    console.log(`report -> ${path.join(OUT_DIR, 'page-load-report.md')}`);
    await context.close().catch(() => {});
  });

  // TC-LOAD-000: the catalog must still match the live sidebar menu.
  test('TC-LOAD-000 sidebar menu matches the page catalog', async () => {
    test.setTimeout(120_000);
    await page.goto('/dsb/e-commerce', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3_000);
    const live = await page.evaluate(() => [...new Set(
      [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')).filter((h) => h && h !== '/'),
    )]);
    const known = new Set(PAGE_CATALOG.map((p) => p.path));
    const missing = live.filter((h) => !known.has(h));
    const gone = [...known].filter((h) => !live.includes(h));
    console.log(`sidebar routes: ${live.length}, catalogued: ${known.size}, new (not in catalog): ${missing.length}, catalogued but no longer in menu: ${gone.length}`);
    if (missing.length) console.log('NEW routes to add to page-catalog.js:\n  ' + missing.join('\n  '));
    if (gone.length) console.log('Catalogued routes missing from the menu:\n  ' + gone.join('\n  '));
    // soft: a menu change should be visible in the report, not hide the page checks
    expect.soft(missing, `sidebar has routes missing from page-catalog.js: ${missing.join(', ')}`).toEqual([]);
  });

  let n = 0;
  for (const entry of PAGE_CATALOG) {
    n += 1;
    const id = `TC-LOAD-${String(n).padStart(3, '0')}`;
    test(`${id} ${entry.module} > ${entry.name} (${entry.path}) loads and Add opens`, async () => {
      test.setTimeout(150_000);
      test.skip(!!entry.skip, entry.skip || '');

      // self-heal a dropped session before the check
      if (/\/login/.test(page.url())) await loginShared();

      let rec = await checkPage(page, entry, { screenshotDir: path.join(OUT_DIR, 'screens') });
      if (rec.sessionLost) {
        console.log(`  landed on /login opening ${entry.path} - logging in again and retrying once`);
        await loginShared();
        rec = await checkPage(page, entry, { screenshotDir: path.join(OUT_DIR, 'screens') });
        if (rec.sessionLost) {
          // a fresh session also bounces -> it is the ROUTE (guard/permission),
          // not an expired session
          rec.failures = rec.failures.map((f) => f.replace(/SESSION LOST[^;|]*/,
            'ROUTE REDIRECTS TO /login even with a fresh session (route guard / permission)'));
        }
      }
      fs.appendFileSync(RESULTS_FILE, JSON.stringify(rec) + '\n');

      const line = `${rec.status.padEnd(4)} ${entry.path} load ${rec.loadMs}ms loader ${rec.loaderMs}ms add:${rec.addFound ? (rec.addOpened ? 'opened' : 'NOT OPENED') : 'none'}${rec.addMs ? ' ' + rec.addMs + 'ms' : ''}`;
      console.log(line + (rec.failures.length ? '\n     ' + rec.failures.join('\n     ') : '') + (rec.warnings.length ? '\n     warn: ' + rec.warnings.join('\n     warn: ') : ''));
      if (rec.screenshot) test.info().attachments.push({ name: 'page', path: rec.screenshot, contentType: 'image/png' });

      expect(rec.failures, `${entry.module} > ${entry.name} (${entry.path}) failed: ${rec.failures.join(' | ')}`).toEqual([]);
    });
  }
});
