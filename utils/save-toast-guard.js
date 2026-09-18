const { expect } = require('@playwright/test');

/**
 * SAVE-TOAST GUARD (QA lead, 16-09-2026): after EVERY successful save the app
 * must show its success toast ("Saved successfully!"). A save whose response
 * says success but shows no toast is an application BUG - it must be flagged
 * in the report, not silently passed.
 *
 * Wired in as an automatic fixture (fixtures/test-fixtures.js), so every spec
 * gets it without changes:
 *   - listens to the page's API responses; a POST/PUT to a Create/Save/Submit/
 *     Accept/Update/Generate/Register/Finalize endpoint whose body reports
 *     success (code 1001 / "Saved successfully") counts as a SAVE;
 *   - for each save, waits up to TOAST_TIMEOUT_MS for a visible success toast
 *     (or success dialog) containing "saved" / "success";
 *   - at test end, every save without a toast is:
 *       * printed as "BUG: success toast not shown after save ..."
 *       * added to the test as a "BUG" annotation (visible in the HTML report)
 *       * reported through expect.soft, so the test is marked FAILED with the
 *         bug message while the workflow itself still ran to completion.
 *
 * SAVE_TOAST_GUARD=off disables it; SAVE_TOAST_GUARD=warn reports without
 * failing the test.
 */

const TOAST_TIMEOUT_MS = 8_000;
const SAVE_URL = /Create|Save|Submit|Accept|Update|Generate|Register|Finalize|Approve|Confirm/i;
// endpoints that look like saves but are lookups / computations
// (any "/Get..." action is a lookup even when it contains Accept/Transfer,
// e.g. InternalStockAcceptV2/GetInternalStockAcceptTransferredRecords)
const NOT_A_SAVE = /\/Get[A-Z]|GetAll|Pagination|Search|List|KeepAlive|GetMasterData|Translation|Login|GenerateTax|GetPrint|Preview|Validate|Check|Calculate/i;
const SUCCESS_TEXT = /saved|success|done|created|accepted|submitted|generated|updated|registered/i;

// toast / alert containers seen across the app (ngx-toastr, bootstrap, sweetalert)
const TOAST_SELECTOR = '.toast-container, #toast-container, .toast, .toastr, ngb-toast, p-toast, p-toastitem, .p-toast-message, [role="alert"], [role="status"], .swal2-popup, .alert-success, .notyf__toast';

function isSaveResponse(r, body) {
  if (!['POST', 'PUT', 'PATCH'].includes(r.request().method())) return false;
  const u = r.url();
  if (!/\/sioniq\//i.test(u) || NOT_A_SAVE.test(u) || !SAVE_URL.test(u)) return false;
  if (r.status() >= 400 || !body || typeof body !== 'object') return false;
  const msg = String(body.message || body.header || '');
  return body.code === 1001 || /saved successfully/i.test(msg) || (/success/i.test(msg) && body.data);
}

function describe(r, body) {
  const ep = r.url().replace(/^https?:\/\/[^/]+/, '').split('?')[0].split('/').slice(-2).join('/');
  const receipt = body && body.data && (body.data.receiptNo || body.data.voucherNo || body.data.docNo);
  return `${ep}${receipt ? ` (receipt ${receipt})` : ''} -> "${(body && body.message) || ''}"`;
}

/** Attach to a page; returns { misses, saves, finish() }. */
function attachSaveToastGuard(page) {
  const misses = [];
  const saves = [];
  const pending = [];
  const onResponse = (r) => {
    // cheap pre-filter BEFORE touching the body: a streaming / long-poll
    // response never completes and r.json() would hang the fixture teardown
    const u = r.url();
    if (!['POST', 'PUT', 'PATCH'].includes(r.request().method())) return;
    if (!/\/sioniq\//i.test(u) || NOT_A_SAVE.test(u) || !SAVE_URL.test(u) || r.status() >= 400) return;
    const p = (async () => {
      let body = null;
      try {
        body = await Promise.race([r.json(), new Promise((res) => setTimeout(() => res(null), 10_000))]);
      } catch { return; }
      if (!body || !isSaveResponse(r, body)) return;
      const what = describe(r, body);
      saves.push(what);
      const toast = page.locator(TOAST_SELECTOR).filter({ hasText: SUCCESS_TEXT }).locator('visible=true').first();
      const shown = await toast.waitFor({ state: 'visible', timeout: TOAST_TIMEOUT_MS }).then(() => true).catch(() => false);
      if (shown) {
        const text = (await toast.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 80);
        console.log(`  toast ok after save: ${what} | "${text}"`);
      } else if (!page.isClosed()) {
        misses.push(what);
        console.log(`  BUG: success toast NOT shown within ${TOAST_TIMEOUT_MS / 1000}s after save: ${what}`);
      }
    })().catch(() => {});
    pending.push(p);
  };
  page.on('response', onResponse);
  return {
    misses,
    saves,
    async finish() {
      page.off('response', onResponse);
      // never let the teardown outlive the toast window + body read
      await Promise.race([Promise.allSettled(pending), new Promise((res) => setTimeout(res, TOAST_TIMEOUT_MS + 12_000))]);
    },
  };
}

/** Report the misses at test end (annotation + console + soft assertion). */
function reportSaveToastMisses(testInfo, guard) {
  const mode = (process.env.SAVE_TOAST_GUARD || 'on').toLowerCase();
  if (mode === 'off' || !guard.misses.length) return;
  const msg = `BUG: "Saved successfully" toast not shown after save (${guard.misses.length} of ${guard.saves.length} saves): ${guard.misses.join(' | ')}`;
  testInfo.annotations.push({ type: 'BUG', description: msg });
  console.log(msg);
  if (mode !== 'warn') expect.soft(guard.misses, msg).toEqual([]);
}

module.exports = { attachSaveToastGuard, reportSaveToastMisses, TOAST_SELECTOR };
