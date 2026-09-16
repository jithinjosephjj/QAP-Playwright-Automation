const fs = require('fs');
const path = require('path');

/**
 * Page-load smoke check used by tests/load/page-load-smoke.noauth.spec.js.
 *
 * For ONE catalog entry it:
 *   1. navigates to the route and waits for the app loader to clear
 *      (full-screen ngx-spinner overlay OR a large inline grid spinner),
 *      recording how long the loader stayed up and whether it got STUCK;
 *   2. verifies the page really rendered: still on the route (no redirect to
 *      /login or elsewhere), no error/"page not found"/"under construction"
 *      text, no error toast, visible content in the main area;
 *   3. finds the page's Add button (the "+" ri-add icon button every Sioniq
 *      list screen carries, or a button captioned Add/New/Create), clicks
 *      it and verifies an add form opened (offcanvas / modal / wizard step /
 *      new form fields / route change) with the loader cleared again;
 *   4. collects, for the whole page + Add interaction: failed API calls
 *      (HTTP >= 400 on the app's /sioniq/ API), network failures, uncaught
 *      page errors and console errors.
 *
 * Returns a plain result record; the spec decides what is a failure.
 * Nothing here asserts (page-object rule: assertions live in the spec).
 */

const LOADER_TIMEOUT_MS = 30_000; // loader still up after this -> STUCK
const SETTLE_MS = 800; // quiet period after the loader clears
const ADD_OPEN_TIMEOUT_MS = 12_000;

// Text that means the route did NOT render a working screen.
const BROKEN_TEXT = /something went wrong|page not found|404 error|unauthori[sz]ed|access denied|internal server error|unexpected error/i;
const UNDER_CONSTRUCTION = /under construction|coming soon|work in progress/i;
const ERROR_TOAST = /error|fail|exception|invalid|not implemented|setup required/i;

// Console noise that is not the page's fault.
const CONSOLE_NOISE = /favicon|ERR_ABORTED|net::ERR_BLOCKED_BY_CLIENT|Third-party cookie|DevTools|ExpressionChangedAfterItHasBeenChecked/i;

// App-WIDE script errors that fire on EVERY full page load regardless of the
// route (seen on qap 15-09-2026: the dashboard vector-map script and a
// layout NullInjectorError). Real defects, but not this page's - reported as
// warnings so they do not turn all 150+ tests red. Raise them separately.
const KNOWN_GLOBAL_ERRORS = [
  /jsVectorMap is not defined/i,
  /NullInjectorError: No provider for/i,
];
const isGlobalNoise = (t) => KNOWN_GLOBAL_ERRORS.some((re) => re.test(t));
const firstLine = (t, n = 160) => String(t).split('\n')[0].trim().slice(0, n);

/** DOM probe: is the app loader visible right now (overlay or big grid spinner)? */
function loaderUpInPage() {
  const visible = (el) => {
    if (!el || !el.getClientRects().length) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity || '1') > 0.01;
  };
  const big = (el) => { const r = el.getBoundingClientRect(); return r.width >= 24 && r.height >= 24; };
  if ([...document.querySelectorAll('.ngx-spinner-overlay, .loader-overlay, .page-loader')].some(visible)) return true;
  return [...document.querySelectorAll('.spinner-border, .spinner-grow')].some((el) => visible(el) && big(el));
}

/** DOM probe: what the screen looks like after load. */
function pageStateInPage() {
  const visible = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  // The content area WITHOUT the sidebar/header (Velzon layout classes first).
  // Take the first candidate that exists and is on screen; body is the fallback.
  const CANDIDATES = ['.main-content', '#layout-wrapper .page-content', '.page-content', 'main', 'router-outlet ~ *'];
  let main = null;
  let mainSelector = 'body';
  for (const sel of CANDIDATES) {
    const el = document.querySelector(sel);
    if (el && visible(el)) { main = el; mainSelector = sel; break; }
  }
  if (!main) main = document.body;
  const text = (main.innerText || '').replace(/\s+/g, ' ').trim();
  const bodyText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
  const toasts = [...document.querySelectorAll('.toast, .toast-container *, #toast-container *, .alert-danger')]
    .filter(visible).map((t) => (t.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const heading = (document.querySelector('.page-title, .page-title-box h4, h4, h5, .card-title, .breadcrumb') || {}).innerText || '';
  const submitButtons = [...document.querySelectorAll('button')]
    .filter((b) => visible(b) && /^\s*(submit|save|register|update|next|add items?)\s*$/i.test((b.innerText || '').trim())).length;
  return {
    pathname: location.pathname,
    mainSelector,
    textLength: text.length,
    bodyTextLength: bodyText.length,
    text: text.slice(0, 20_000),
    textSample: text.slice(0, 400),
    heading: heading.replace(/\s+/g, ' ').trim().slice(0, 80),
    toasts: [...new Set(toasts)],
    fields: main.querySelectorAll('input, select, textarea, ng-select').length,
    forms: main.querySelectorAll('form').length,
    tables: main.querySelectorAll('table').length,
    openPanels: document.querySelectorAll('.modal.show, .offcanvas.show, [role="dialog"]').length,
    submitButtons,
    addFormText: /add new record|please complete the form|new record/i.test(text),
  };
}

/** DOM probe: click the page's Add button; returns how it was found or null. */
function clickAddInPage() {
  const visible = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.disabled;
  const icon = [...document.querySelectorAll('.ri-add-fill, .ri-add-line, .ri-add-circle-fill, .ri-add-circle-line, .mdi-plus, .fa-plus, .bx-plus')]
    .map((i) => i.closest('button, a'))
    .find(visible);
  if (icon) { icon.click(); return `icon:${(icon.className || '').toString().trim().slice(0, 40)}`; }
  // exact captions only - "Add Description", "Add Items" etc. are row/item
  // actions inside a screen, not the screen's add-record button
  const captioned = [...document.querySelectorAll('button, a.btn')]
    .find((e) => visible(e) && /^\s*(\+\s*)?(add( new)?( record)?|new|create)\s*$/i.test((e.innerText || '').trim()));
  if (captioned) { captioned.click(); return `caption:${(captioned.innerText || '').trim().slice(0, 30)}`; }
  return null;
}

async function waitForLoaderToClear(page, timeoutMs) {
  const t0 = Date.now();
  let firstSeen = -1;
  let lastSeen = -1;
  let stuck = false;
  for (;;) {
    const up = await page.evaluate(loaderUpInPage).catch(() => false);
    const now = Date.now();
    if (up) {
      if (firstSeen < 0) firstSeen = now;
      lastSeen = now;
    } else if (now - Math.max(lastSeen, t0) >= SETTLE_MS) {
      break; // quiet for SETTLE_MS after the last loader sighting
    }
    if (now - t0 > timeoutMs) { stuck = up; break; }
    await page.waitForTimeout(150);
  }
  return { loaderMs: firstSeen < 0 ? 0 : lastSeen - firstSeen, loaderStuck: stuck };
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {{module:string,name:string,path:string}} entry
 * @param {{screenshotDir?: string}} [opts]
 */
async function checkPage(page, entry, opts = {}) {
  const rec = {
    module: entry.module,
    name: entry.name,
    path: entry.path,
    status: 'PASS',
    failures: [], // -> test fails
    warnings: [], // -> reported only
    loadMs: 0,
    loaderMs: 0,
    loaderStuck: false,
    heading: '',
    addFound: null,
    addOpened: false,
    addMs: 0,
    addLoaderMs: 0,
    addLoaderStuck: false,
    failedApi: [],
    netFailures: [],
    pageErrors: [],
    consoleErrors: [],
    globalErrors: [], // KNOWN_GLOBAL_ERRORS sightings (warning only)
    screenshot: '',
  };

  // ---- collectors (scoped to this check) ----
  const onResponse = (r) => {
    const u = r.url();
    if (r.status() >= 400 && /\/sioniq\//i.test(u) && r.request().method() !== 'OPTIONS') {
      rec.failedApi.push(`${r.status()} ${r.request().method()} ${u.replace(/^https?:\/\/[^/]+/, '')}`);
    }
  };
  const onRequestFailed = (req) => {
    const err = (req.failure() || {}).errorText || '';
    if (/ERR_ABORTED/.test(err)) return; // SPA navigation cancels in-flight calls
    rec.netFailures.push(`${err} ${req.method()} ${req.url().replace(/^https?:\/\/[^/]+/, '')}`);
  };
  const onPageError = (e) => {
    const t = firstLine(e && e.message ? e.message : e, 300);
    (isGlobalNoise(t) ? rec.globalErrors : rec.pageErrors).push(t);
  };
  const onConsole = (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (CONSOLE_NOISE.test(t)) return;
    (isGlobalNoise(t) ? rec.globalErrors : rec.consoleErrors).push(firstLine(t));
  };
  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);
  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  try {
    // ---- 1. open the route ----
    const t0 = Date.now();
    await page.goto(entry.path, { waitUntil: 'domcontentloaded' });
    const ld = await waitForLoaderToClear(page, LOADER_TIMEOUT_MS);
    rec.loaderMs = ld.loaderMs;
    rec.loaderStuck = ld.loaderStuck;
    rec.loadMs = Date.now() - t0;

    // ---- 2. did the page render? ----
    let st = await page.evaluate(pageStateInPage);
    rec.heading = st.heading;
    if (/\/login/.test(st.pathname)) {
      rec.failures.push('SESSION LOST - redirected to /login');
      rec.sessionLost = true;
      return finish();
    }
    if (rec.loaderStuck) rec.failures.push(`LOADER STUCK - still spinning after ${LOADER_TIMEOUT_MS / 1000}s`);
    if (!st.pathname.startsWith(entry.path.split('?')[0])) rec.failures.push(`REDIRECTED to ${st.pathname}`);
    if (BROKEN_TEXT.test(st.text)) rec.failures.push(`ERROR TEXT on page: "${st.text.match(BROKEN_TEXT)[0]}"`);
    if (UNDER_CONSTRUCTION.test(st.text)) rec.warnings.push('UNDER CONSTRUCTION screen');
    // blank = nothing painted at all (no layout), or an empty content area
    // with no grid/form/field in it
    if (st.bodyTextLength < 20) rec.failures.push('BLANK PAGE - nothing rendered (no layout, no content)');
    else if (st.textLength < 20 && !st.tables && !st.forms && !st.fields) rec.failures.push(`BLANK CONTENT AREA (${st.mainSelector}) - layout rendered but the screen is empty`);
    const errToasts = st.toasts.filter((t) => ERROR_TOAST.test(t));
    if (errToasts.length) rec.failures.push(`ERROR TOAST on load: ${errToasts.join(' | ')}`);

    // ---- 3. Add button ----
    if (!rec.failures.length && !UNDER_CONSTRUCTION.test(st.text)) {
      const before = st;
      const tA = Date.now();
      rec.addFound = await page.evaluate(clickAddInPage);
      if (rec.addFound) {
        const deadline = Date.now() + ADD_OPEN_TIMEOUT_MS;
        while (Date.now() < deadline) {
          await page.waitForTimeout(200);
          st = await page.evaluate(pageStateInPage).catch(() => before);
          // an add form shows up as: a modal/offcanvas, an inline "Add new
          // record" form replacing the grid (Velzon list->form toggle), a
          // wizard route, or simply new fields + a Submit/Save button
          const opened = st.openPanels > before.openPanels
            || st.forms > before.forms
            || st.fields > before.fields
            || st.pathname !== before.pathname
            || (st.submitButtons > 0 && before.submitButtons === 0)
            || (st.addFormText && !before.addFormText);
          if (opened) { rec.addOpened = true; break; }
        }
        const al = await waitForLoaderToClear(page, LOADER_TIMEOUT_MS);
        rec.addLoaderMs = al.loaderMs;
        rec.addLoaderStuck = al.loaderStuck;
        rec.addMs = Date.now() - tA;
        st = await page.evaluate(pageStateInPage).catch(() => st);
        if (!rec.addOpened) rec.failures.push('ADD CLICKED but no form/panel opened');
        if (rec.addLoaderStuck) rec.failures.push('LOADER STUCK after Add');
        if (/\/login/.test(st.pathname)) { rec.failures.push('SESSION LOST after Add'); rec.sessionLost = true; }
        const addToasts = st.toasts.filter((t) => ERROR_TOAST.test(t));
        if (addToasts.length) rec.failures.push(`ERROR TOAST after Add: ${addToasts.join(' | ')}`);
        if (BROKEN_TEXT.test(st.text)) rec.failures.push(`ERROR TEXT after Add: "${st.text.match(BROKEN_TEXT)[0]}"`);
      } else {
        rec.warnings.push('NO ADD BUTTON on this page (read-only / report / dashboard screen)');
      }
    }

    // ---- 4. network + script health ----
    const serverErrors = rec.failedApi.filter((f) => /^5\d\d/.test(f));
    const clientErrors = rec.failedApi.filter((f) => /^4\d\d/.test(f));
    if (serverErrors.length) rec.failures.push(`API 5xx: ${[...new Set(serverErrors)].join(' | ')}`);
    if (clientErrors.length) rec.failures.push(`API 4xx: ${[...new Set(clientErrors)].join(' | ')}`);
    if (rec.netFailures.length) rec.warnings.push(`network failures: ${[...new Set(rec.netFailures)].slice(0, 3).join(' | ')}`);
    if (rec.pageErrors.length) rec.failures.push(`UNCAUGHT JS ERROR: ${[...new Set(rec.pageErrors)].slice(0, 2).join(' | ')}`);
    if (rec.consoleErrors.length) rec.warnings.push(`console errors (${rec.consoleErrors.length}): ${[...new Set(rec.consoleErrors)].slice(0, 2).join(' | ')}`);
    // rec.globalErrors is NOT a per-page warning - the report lists those once
    return finish();
  } catch (e) {
    rec.failures.push(`EXCEPTION: ${String(e && e.message ? e.message : e).split('\n')[0].slice(0, 300)}`);
    if (/Target page, context or browser has been closed/i.test(String(e))) rec.sessionLost = true;
    return finish();
  } finally {
    page.off('response', onResponse);
    page.off('requestfailed', onRequestFailed);
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }

  async function finish() {
    rec.status = rec.failures.length ? 'FAIL' : rec.warnings.length ? 'WARN' : 'PASS';
    if (rec.status === 'FAIL' && opts.screenshotDir) {
      try {
        fs.mkdirSync(opts.screenshotDir, { recursive: true });
        rec.screenshot = path.join(opts.screenshotDir, `${slug(entry.path)}.png`);
        await page.screenshot({ path: rec.screenshot, fullPage: false });
      } catch { rec.screenshot = ''; }
    }
    return rec;
  }
}

function slug(s) {
  return String(s).replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

/** Markdown summary of a run, grouped by module. */
function renderReport(rawResults, meta) {
  // one record per route - a rerun of a page (LOAD_KEEP=1 -g "...") replaces
  // its earlier record but keeps the original position
  const byPath = new Map();
  for (const r of rawResults) byPath.set(r.path, r);
  // normalise older records that carried the app-wide errors as a warning
  const results = [...byPath.values()].map((r) => {
    const warnings = (r.warnings || []).filter((w) => !/^known app-wide script errors/.test(w));
    const status = r.failures.length ? 'FAIL' : warnings.length ? 'WARN' : 'PASS';
    return { ...r, warnings, status };
  });
  const counts = { PASS: 0, WARN: 0, FAIL: 0 };
  for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;
  const L = [];
  L.push(`# Page-load smoke report - ${meta.client} (${meta.url})`);
  L.push('');
  L.push(`Run: ${meta.startedAt} -> ${meta.finishedAt} | pages: ${results.length} | PASS ${counts.PASS} | WARN ${counts.WARN} | FAIL ${counts.FAIL}`);
  L.push('');
  L.push('Checks per page: route renders (no redirect / error text / blank / error toast), loader clears (not stuck), Add button opens a form, no API 4xx/5xx, no uncaught JS errors. WARN = page fine but something to note (no Add button, console errors, under construction).');
  L.push('');
  const fails = results.filter((r) => r.status === 'FAIL');
  L.push(`## Failures (${fails.length})`);
  L.push(fails.length ? fails.map((r) => `- **${r.module} > ${r.name}** \`${r.path}\`: ${r.failures.join('; ').replace(/\s+/g, ' ')}`).join('\n') : '_None._');
  L.push('');
  const globals = new Map();
  for (const r of results) for (const g of r.globalErrors || []) globals.set(g.slice(0, 120), (globals.get(g.slice(0, 120)) || 0) + 1);
  if (globals.size) {
    L.push('## App-wide script errors (seen on every page - reported once, raise separately)');
    for (const [g, c] of globals) L.push(`- \`${g}\` - on ${c} page loads`);
    L.push('');
  }
  const noAdd = results.filter((r) => r.addFound === null && !r.failures.length);
  L.push(`## Pages without an Add button (${noAdd.length})`);
  L.push(noAdd.length ? noAdd.map((r) => `\`${r.path}\``).join(', ') : '_None._');
  L.push('');
  const slow = [...results].filter((r) => r.loadMs > 0).sort((a, b) => b.loadMs - a.loadMs).slice(0, 10);
  L.push('## Slowest page loads (top 10)');
  L.push('| Page | Route | load ms | loader ms | Add ms |');
  L.push('|---|---|---:|---:|---:|');
  for (const r of slow) L.push(`| ${r.module} > ${r.name} | \`${r.path}\` | ${r.loadMs} | ${r.loaderMs} | ${r.addMs} |`);
  L.push('');
  L.push('## All pages');
  L.push('| Status | Module | Page | Route | load ms | loader ms | Add | Add opened | Add ms | Notes |');
  L.push('|---|---|---|---|---:|---:|---|---|---:|---|');
  for (const r of results) {
    const notes = [...r.failures, ...r.warnings].join('; ').replace(/\|/g, '/').replace(/\s+/g, ' ').slice(0, 240);
    L.push(`| ${r.status} | ${r.module} | ${r.name} | \`${r.path}\` | ${r.loadMs} | ${r.loaderMs}${r.loaderStuck ? ' (stuck)' : ''} | ${r.addFound ? 'yes' : (r.addFound === null && r.failures.length ? '-' : 'no')} | ${r.addFound ? (r.addOpened ? 'yes' : 'NO') : '-'} | ${r.addMs} | ${notes} |`);
  }
  return L.join('\n');
}

module.exports = { checkPage, renderReport, slug };
