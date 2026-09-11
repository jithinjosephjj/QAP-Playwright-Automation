const { StockInwardBasePage } = require('./StockInwardBasePage');

/**
 * Lot Generation — Inventory > Operations > Lot Generation.
 * Route: /inv/view-lot-generation.
 *
 * Add form (mapped live, 31-08-2026): filter cascade Item Type → Stock
 * Source Type → From Transaction Type → Vendor (multi) reveals a grid of
 * inward records keyed by Inward Number (e.g. "M161"). Checking a row opens
 * the item panel with Reference Type / Category / Article pre-filled from
 * the inward; Employee and Business Unit are the manual mandatory picks.
 * "Add To Lot" stages the item, Submit saves the lot.
 */
class LotGenerationPage extends StockInwardBasePage {
  constructor(page) {
    super(page, 'Lot Generation');
    this.submitApiPattern = /Lot/i;
  }

  async open() {
    await this.goto('/inv/view-lot-generation');
    await this.addBtn.waitFor({ state: 'visible', timeout: 30_000 });
  }

  rowMatcher(rowText) {
    const esc = String(rowText).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('row').filter({ hasText: new RegExp(esc, 'i') });
  }

  /**
   * Generate a lot from the accepted process stock (qap "process wise" client,
   * mapped live 11-09-2026). The qap lot form reveals its "Pending Non-Barcoded
   * Stock" grid as soon as Item Type is picked - no Source From needed (that is
   * just an optional Department|Locker|Process filter). Check the stock row ->
   * the item panel opens with the article chain pre-filled from the stock;
   * Employee and Business Unit are the manual mandatory picks -> Add To Lot
   * stages it -> Submit saves (POST CreateLotGeneration).
   */
  async generateLotFromProcess({ itemType = 'Metal', rowText, employee, businessUnit }) {
    await this.open();
    await this.waitForSpinner();
    await this.addBtn.click({ timeout: 60_000 });
    await this.select('masterDataValueID_JewelleryItemType').waitFor({ state: 'visible', timeout: 30_000 });

    await this.pick('masterDataValueID_JewelleryItemType', itemType, { exact: true });
    await this.waitForIdle();
    await this.page.waitForTimeout(2_500); // "Pending Non-Barcoded Stock" grid loads

    // select the stock row (by reference number if given, else the first) - the
    // row opens the item panel. Rows are checkbox-selectable ("Click to edit").
    const rows = this.page.locator('table tbody tr');
    const row = rowText
      ? rows.filter({ hasText: new RegExp(String(rowText).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first()
      : rows.first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    const box = row.getByRole('checkbox').first();
    if (await box.isVisible({ timeout: 3_000 }).catch(() => false)) await box.check({ force: true });
    else await row.getByText(/Click to edit/i).first().click({ timeout: 8_000 }).catch(() => row.click());
    await this.page.waitForTimeout(2_500);

    if (employee) await this.pick('employeeID', employee, { search: true }).catch(() => {});
    if (businessUnit) await this.pick('businessUnitID', businessUnit, { exact: true }).catch(() => {});

    const addBtn = this.page.getByRole('button', { name: /Add To Lot/i }).locator('visible=true').last();
    await addBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await addBtn.click();
    await this.page.waitForTimeout(2_500);

    const resp = this.page.waitForResponse(
      (r) => r.request().method() === 'POST' && /CreateLotGeneration|GenerateLot/i.test(r.url()),
      { timeout: 60_000 },
    ).catch(() => null);
    const submit = this.page.locator('button').filter({ hasText: /^\s*Submit\s*$/ }).locator('visible=true').last();
    await submit.scrollIntoViewIfNeeded().catch(() => {});
    await submit.click({ timeout: 15_000, force: true });
    const r = await resp;
    if (!r) {
      throw new Error(`Lot Submit fired no CreateLotGeneration - form silently blocked; invalid: ${JSON.stringify(await this.invalidControls())}`);
    }
    const body = await r.json().catch(() => null);
    console.log('lot save:', r.status(), JSON.stringify(body).slice(0, 250));
    if (r.status() >= 400 || (body && body.errorCode)) {
      throw new Error(`Lot save rejected (HTTP ${r.status()}): ${body ? body.error || body.message || '' : ''}`);
    }
    let lotNo = (body && body.data && (body.data.receiptNo || body.data.lotNo || body.data.docNo || body.data.lotNumber)) || '';
    if (!lotNo) lotNo = await this.voucherNumber().catch(() => '');
    // print template may 501 here (separate bug) - just close the dialog
    await this.page.locator('.btn-close').last().click({ timeout: 8_000 }).catch(() => {});
    return lotNo;
  }

  /** Server-typeahead pick: type `term`, then click the option matching `optionText` (exact). */
  async typeaheadPick(controlname, term, optionText) {
    const wrap = this.select(controlname);
    const opt = this.page.locator('.ng-dropdown-panel .ng-option')
      .filter({ hasText: new RegExp(String.raw`^\s*${String(optionText).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*$`) }).first();
    for (let attempt = 1; attempt <= 4; attempt++) {
      if (await this.page.locator('.ng-dropdown-panel').first().isVisible().catch(() => false)) {
        await this.page.keyboard.press('Escape'); await this.page.waitForTimeout(300);
      }
      await wrap.locator('.ng-select-container').click().catch(() => {});
      await wrap.locator('input[role="combobox"]').fill(term).catch(() => {});
      await this.page.waitForTimeout(2_000); // server filter debounce
      if (await opt.isVisible({ timeout: attempt * 3_000 }).catch(() => false)) {
        if (await opt.click({ timeout: 8_000 }).then(() => true).catch(() => false)) { await this.page.waitForTimeout(600); return; }
      }
      await this.page.keyboard.press('Escape');
    }
    throw new Error(`typeaheadPick: "${optionText}" (term "${term}") never appeared for "${controlname}"`);
  }

  async pickFirst(controlname) {
    const wrap = this.select(controlname);
    await wrap.locator('.ng-select-container').click().catch(() => {});
    await this.page.waitForTimeout(1_200);
    const opt = this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasNotText: /No items found|Type to search/i }).first();
    if (await opt.isVisible({ timeout: 4_000 }).catch(() => false)) {
      console.log(`lot ${controlname} -> first option: ${((await opt.textContent()) || '').trim()}`);
      await opt.click();
      await this.page.waitForTimeout(800);
    }
  }

  async invalidControls() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll('sioniq-ng-select')]
        .filter((n) => n.querySelector('ng-select')?.classList.contains('ng-invalid') && n.offsetParent)
        .map((n) => n.getAttribute('controlname')));
  }

  /**
   * Generate one lot from an inward record. Returns the lot number from the
   * save response (falls back to the Print dialog's voucher number).
   */
  async generateLot({ itemType = 'Metal', sourceType = 'Inward', transactionType = 'Metal Inward', vendor = 'RAJA', inwardNo, employee, businessUnit = 'Cochin' }) {
    await this.open();
    await this.waitForSpinner();
    await this.addBtn.click({ timeout: 60_000 });
    await this.select('masterDataValueID_JewelleryItemType').waitFor({ state: 'visible', timeout: 30_000 });

    await this.pick('masterDataValueID_JewelleryItemType', itemType, { exact: true });
    await this.pick('masterDataValueID_StockSourceType', sourceType, { exact: true });
    await this.pick('fromTransactionTypeID', transactionType, { exact: true });
    // Vendor is a MULTI-select - close its panel or it swallows the next
    // click. Non-vendor sources (Stone Assorting Receipt) may not render it.
    await this.pick('vendorFilter', vendor, { closePanel: true })
      .catch((e) => console.log('lot: vendor filter skipped -', String(e).slice(0, 100)));
    await this.waitForIdle();
    await this.page.waitForTimeout(2_500);

    // check the inward's grid row - this opens the item panel
    const row = this.rowMatcher(inwardNo).first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    await row.getByRole('checkbox').first().check({ force: true });
    await this.page.waitForTimeout(2_500);

    // panel pre-fills the article chain from the inward; Employee and
    // Business Unit are the manual mandatory picks
    await this.pick('employeeID', employee, { search: true });
    await this.pick('businessUnitID', businessUnit, { exact: true });

    await this.page.getByRole('button', { name: 'Add To Lot' }).click();
    await this.page.waitForTimeout(2_500);

    const resp = this.page.waitForResponse(
      (r) => r.request().method() === 'POST' && /create|save/i.test(r.url()) && /lot/i.test(r.url()) && !/GetAll|Pagination|KeepAlive/i.test(r.url()),
      { timeout: 120_000 },
    ).catch(() => null);
    await this.submitBtn.click();
    const r = await resp;
    if (!r) throw new Error('Lot Submit fired no save request - form silently blocked (check Add To Lot registered the item)');
    const body = await r.json().catch(() => null);
    console.log('lot save:', r.status(), JSON.stringify(body).slice(0, 250));
    if (r.status() >= 400 || (body && body.errorCode)) {
      throw new Error(`Lot save rejected (HTTP ${r.status()}): ${body ? body.error || '' : ''}`);
    }
    let lotNo = (body && body.data && (body.data.receiptNo || body.data.lotNo || body.data.docNo)) || '';
    if (!lotNo && (await this.printDialog.isVisible({ timeout: 10_000 }).catch(() => false))) {
      lotNo = await this.voucherNumber();
    }
    // the Print dialog offers Preview here - verify the template renders.
    // Recorded (not thrown) so a broken template cannot swallow the lot
    // number - the spec asserts printPreviewError after persisting state.
    this.printPreviewError = null;
    await this.printDialog.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    await this.verifyPrintPreview().catch((e) => { this.printPreviewError = String(e); });
    await this.page.locator('.btn-close').last().click({ timeout: 10_000 }).catch(() => {});
    return lotNo;
  }
}

module.exports = { LotGenerationPage };
