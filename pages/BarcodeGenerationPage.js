const { StockInwardBasePage } = require('./StockInwardBasePage');

/**
 * Barcode Generation — Inventory > Operations > Barcode.
 * Route: /inv/view-barcode-generation. qap "process wise" client (mapped live
 * 11-09-2026).
 *
 * The form generates a tag for lotted metal. Cascade: Item Type -> Source From
 * ("Vendor", the default) -> Stock Identity Type ("Stock") -> Vendor (the lot's
 * source vendor) -> Lot No (e.g. LLL12, created by Lot Generation) -> Lot Serial
 * No. The article cascade (Group Category -> Category -> Style/Subgroup/Model ->
 * Article -> Purity) is filled (Gold) if the lot did not pre-fill it, then the
 * Gross Weight Component and Submit generate the tag number.
 */
class BarcodeGenerationPage extends StockInwardBasePage {
  constructor(page) {
    super(page, 'Barcode Generation');
    this.addBtn = page.locator('button:has(i.ri-add-fill)').locator('visible=true').first();
  }

  async open() {
    await this.goto('/inv/view-barcode-generation');
    await this.waitForIdle();
    await this.waitForSpinner();
  }

  async pickFirst(controlname) {
    const wrap = this.select(controlname);
    if (await this.page.locator('.ng-dropdown-panel').first().isVisible().catch(() => false)) { await this.page.keyboard.press('Escape'); await this.page.waitForTimeout(300); }
    await wrap.locator('.ng-select-container').first().click().catch(() => {});
    await this.page.waitForTimeout(900);
    const opt = this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasNotText: /No items found|Type to search/i }).first();
    let label = '';
    if (await opt.isVisible({ timeout: 4_000 }).catch(() => false)) { label = ((await opt.textContent()) || '').trim(); await opt.click().catch(() => {}); await this.page.waitForTimeout(1_000); }
    else await this.page.keyboard.press('Escape').catch(() => {});
    return label;
  }

  async optionCount(controlname) {
    const wrap = this.select(controlname);
    if (await this.page.locator('.ng-dropdown-panel').first().isVisible().catch(() => false)) { await this.page.keyboard.press('Escape'); await this.page.waitForTimeout(300); }
    await wrap.locator('.ng-select-container').first().click().catch(() => {});
    await this.page.waitForTimeout(1_200);
    const o = (await this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasNotText: /No items found|Type to search/i }).allTextContents().catch(() => [])).map((s) => s.trim());
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);
    return o;
  }

  invalidControls() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll('sioniq-ng-select')]
        .filter((n) => n.querySelector('ng-select')?.classList.contains('ng-invalid') && n.offsetParent)
        .map((n) => n.getAttribute('controlname')));
  }

  /**
   * Generate a barcode tag from a lot. Returns the generated tag number.
   * @param {string} [lotNo] specific Lot No to consume; falls back to the latest.
   */
  async generate({ itemType = 'Metal', vendor = 'Celestia Jewels P', lotNo, groupCategory = 'Gold', brand, amount, grossWeight = 10, stone } = {}) {
    await this.open();
    await this.addBtn.click({ timeout: 30_000 });
    await this.select('masterDataValueID_JewelleryItemType').waitFor({ state: 'visible', timeout: 30_000 });

    await this.pick('masterDataValueID_JewelleryItemType', itemType, { exact: true });
    // Source From stays "Vendor" (the default). Cascade: Item Type -> Stock
    // Identity Type -> Vendor -> Lot No -> Lot Serial No.
    await this.pick('masterDataValueID_StockIdentityType', 'Stock', { exact: true });
    await this.pick('vendorID', vendor, { search: true });
    await this.page.waitForTimeout(2_500);

    // Lot No list loads async - retry until options appear, then pick ours/first
    let lots = [];
    for (let i = 0; i < 6 && lots.length === 0; i++) { lots = await this.optionCount('lotGenerationID'); if (!lots.length) await this.page.waitForTimeout(1_500); }
    if (!lots.length) throw new Error('Barcode: no Lot No options (vendor has no un-barcoded lot stock)');
    const target = (lotNo && lots.find((l) => l.replace(/\s+/g, '') === String(lotNo).replace(/\s+/g, ''))) || lots[0];
    await this.pick('lotGenerationID', target, { exact: true });
    await this.page.waitForTimeout(1_200);
    const serial = await this.pickFirst('lotGenerationMetalID');
    console.log(`barcode: lot=${target} serial=${serial}`);

    const emptyOf = async (cn) => !(await this.select(cn).locator('.ng-value').first().isVisible({ timeout: 800 }).catch(() => false));

    if (stone) {
      // Stone barcode: stone hierarchy (stoneID / stoneCategoryID /
      // stoneSubCategoryID / Shape-Style-Size 'value' / stoneArticleID),
      // Weight Entry Mode + UOM, then Stone Gross Weight With Tare + Rate. The
      // lot may pre-fill the hierarchy - fill only what's still empty.
      if (await emptyOf('stoneID')) await this.pick('stoneID', stone.group || 'Diamond', { exact: true }).catch(() => {});
      for (const cn of ['stoneCategoryID', 'stoneSubCategoryID']) { if (await emptyOf(cn)) await this.pickFirst(cn).catch(() => {}); }
      // 'value' (Shape / Style / Size) repeats - fill each empty occurrence
      const values = this.page.locator('sioniq-ng-select[controlname="value"] ng-select').locator('visible=true');
      const vcount = await values.count().catch(() => 0);
      for (let i = 0; i < vcount; i++) {
        const w = values.nth(i);
        if (await w.locator('.ng-value').first().isVisible({ timeout: 500 }).catch(() => false)) continue;
        await w.locator('.ng-select-container').first().click().catch(() => {});
        await this.page.waitForTimeout(700);
        const opt = this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasNotText: /No items found|Type to search/i }).first();
        if (await opt.isVisible({ timeout: 2_500 }).catch(() => false)) await opt.click().catch(() => {});
        else await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(500);
      }
      if (await emptyOf('stoneArticleID')) await this.pick('stoneArticleID', stone.article || 'DND-Drop', { search: true }).catch(() => this.pickFirst('stoneArticleID').catch(() => {}));
      await this.pick('masterDataValueID_WeightEntryMode', 'Without Tare Weight', { exact: true }).catch(() => {});
      if (await emptyOf('weightUOMID')) await this.pick('weightUOMID', stone.uom || 'Gram', { exact: true }).catch(() => {});
      // weight + rate drive the amount (and tax)
      await this.fillByLabel('Stone Gross Weight With Tare', grossWeight).catch(() => this.fillByLabel('Gross Weight', grossWeight).catch(() => {}));
      if (stone.rate !== undefined) await this.fillByLabel('Rate', stone.rate).catch(() => {});
    } else {
      // Brand tags carry a mandatory Brand Name (productBrandID)
      if (brand) await this.pick('productBrandID', brand, { search: true }).catch(() => this.pick('productBrandID', brand, { exact: true }).catch(() => {}));
      // article cascade - fill only what's still empty (lot may pre-fill some)
      if (await emptyOf('metalID')) await this.pick('metalID', groupCategory, { exact: true }).catch(() => {});
      for (const cn of ['productCategoryID', 'productSubCategoryID', 'productArticleID', 'purityID']) {
        if (await emptyOf(cn)) await this.pickFirst(cn).catch(() => {});
      }
      await this.pickFirst('masterDataValueID_VendorMakingType').catch(() => {});
      await this.pickFirst('masterDataValueID_VendorMakingOn').catch(() => {});

      // gross weight - Metal uses a "Gross Weight Component" decimal cell; Brand
      // uses a plain "Gross Weight" input and additionally a mandatory Amount.
      if (brand) {
        await this.fillByLabel('Gross Weight', grossWeight).catch(() => {});
        if (amount !== undefined) await this.fillByLabel('Amount', amount).catch(() => {});
      } else {
        const gw = this.page.locator('form').filter({ hasText: /Gross Weight Component/i }).locator('input[type="decimal"]').first();
        if (await gw.isVisible({ timeout: 4_000 }).catch(() => false)) { await gw.click(); await gw.fill(String(grossWeight)); await this.page.keyboard.press('Tab'); }
      }
    }
    await this.page.waitForTimeout(1_000);
    const taxTwoStep = !!(brand || stone); // both compute tax before saving

    // Match the barcode SAVE (CreateBarcodeGeneration), never the pre-submit tax
    // preview (GenerateTax, which for Brand fires first and returns 200).
    const resp = this.page.waitForResponse(
      (r) => r.request().method() === 'POST' && /Barcode|CreateTag|GenerateTag/i.test(r.url()) && !/Tax|GetAll|Pagination|KeepAlive|List|Search|Master|Template|Translation|GetLocation/i.test(r.url()),
      { timeout: 60_000 },
    ).catch(() => null);
    const submit = this.page.locator('button').filter({ hasText: /^\s*Submit\s*$/ }).locator('visible=true').last();
    await submit.scrollIntoViewIfNeeded().catch(() => {});
    await submit.click({ timeout: 15_000, force: true });
    // Brand/Stone: the first Submit only computes tax (GenerateTax); once the
    // tax fields populate, a second Submit actually saves the tag.
    if (taxTwoStep) {
      await this.page.waitForResponse((r) => /GenerateTax/i.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }).catch(() => {});
      await this.page.waitForTimeout(1_500);
      await submit.click({ timeout: 15_000, force: true }).catch(() => {});
    }
    await this.page.waitForTimeout(1_500);
    const confirm = this.page.locator('[role="dialog"], .modal, ngb-modal-window').filter({ hasText: /Are you sure|Confirm|proceed|generate/i }).getByRole('button', { name: /Yes|Ok|Confirm|Submit|Proceed|Generate/i }).locator('visible=true').last();
    if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) { await confirm.click().catch(() => {}); console.log('barcode: confirmed dialog'); }
    const r = await resp;
    if (!r) throw new Error(`Barcode Submit fired no save - invalid: ${JSON.stringify(await this.invalidControls())}`);
    const body = await r.json().catch(() => null);
    console.log('barcode save:', r.status(), r.url().split('/').slice(-1)[0], JSON.stringify(body).slice(0, 400));
    if (r.status() >= 400 || (body && body.errorCode)) throw new Error(`Barcode save rejected (HTTP ${r.status()}): ${body ? body.error || body.message || '' : ''}`);

    // the generated tag IS the save receiptNo (Metal: "26/01/0100012";
    // Brand: alphanumeric like "CBJ00002SB"). Fall back to a page scan.
    let tag = (body && body.data && (body.data.receiptNo || body.data.tagNo || body.data.barcodeNo)) || '';
    if (!tag) { const m = JSON.stringify(body || {}).match(/\d{2}\/\d{2}\/\d{6,7}/); if (m) tag = m[0]; }
    if (!tag) { await this.page.waitForTimeout(1_500); tag = await this.page.evaluate(() => { const mm = document.body.innerText.match(/\d{2}\/\d{2}\/\d{6,7}/); return mm ? mm[0] : ''; }); }
    await this.page.locator('.btn-close').last().click({ timeout: 8_000 }).catch(() => {});
    return tag;
  }
}

module.exports = { BarcodeGenerationPage };
