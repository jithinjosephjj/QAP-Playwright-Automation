const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { uniqueInvoiceNo } = require('../../utils/unique');
const { DEMO_FILES } = require('../../utils/demo-files'); // Demo files folder images for Add Files

/**
 * Shared builder for the qap "process wise" TAG TRANSFER family: a jewellery tag
 * is created at Kakkanad HO (inward -> lot -> barcode -> transfer process) and
 * transferred out, by Tag Number, to a destination business unit that receives
 * it via Transfer In. Two axes vary:
 *   - ENTITY: Metal (Metal Inward tab) or Brand (Brand Inward tab, + Brand Name)
 *   - DESTINATION: Aluva HO / Palakkad branch / Cochin branch / Kakkanad HO
 *
 * Each test logs in fresh with the BU/user it needs; env resolves the qap URL +
 * user "Admin" (SIONIQ_CLIENT=qap), only the BU / barcode-user are overridden.
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 */

const KAKKANAD = { bu: 'Kakkanad' };
const KAKKANAD_BARCODE = { user: 'Sioniquser1', bu: 'Kakkanad' };

const LOT_PROCESS = 'Lot FVHK';
const TRANSFER_PROCESS = 'Transfer FVHK';

/** Pull the inward receipt/voucher number out of a save-response body. */
function inwardNoFrom(body) {
  const d = body && body.data;
  if (!d) return '';
  return d.receiptNo || d.voucherNo || d.voucherNumber || d.docNo || d.inwardNo || '';
}

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

/** METAL entity: Metal Inward tab (Kakkanad vendor Celestia Jewels P). */
const METAL_ENTITY = {
  name: 'Metal',
  itemType: 'Metal',
  stockEntity: 'Metal',
  groupCategory: 'Gold',
  transactionType: 'Metal Inward',
  vendor: 'Celestia Jewels P',
  async doInward({ metalInward }) {
    await metalInward.open();
    await metalInward.selectTab();
    await metalInward.openAddWizard();
    const invoiceNo = uniqueInvoiceNo();
    await metalInward.fillBasicDetails({
      subTransactionType: 'Invoice', businessUnit: 'Kakkanad', inwardType: 'Stock',
      purchaseType: 'Direct', vendor: this.vendor, purchaser: 'Sioniquser1', invoiceNo,
    });
    await metalInward.nextBtn.click();
    await metalInward.waitForIdle();
    await metalInward.fillItem({
      entryMode: 'SINGLE TAG', referenceType: 'Combination', article: 'Tendulkar',
      purity: '91.60', noOfPcs: 1, grossWeightWithTare: 100, rate: 6000,
    });
    await metalInward.attachDemoImageIfOffered(DEMO_FILES.image1); // demo image when the item step offers Add Files
    await metalInward.addItemBtn.click();
    await metalInward.waitForIdle();
    await metalInward.nextBtn.click();
    await metalInward.waitForIdle();
    await expect(metalInward.gridRows.filter({ hasText: 'Tendulkar' })).toHaveCount(1, { timeout: 30_000 });
    const saved = await metalInward.submit();
    expect(saved, 'metal inward save response').toBeTruthy();
    const inwardNo = inwardNoFrom(saved) || await metalInward.voucherNumber().catch(() => '');
    return { inwardNo, invoiceNo };
  },
};

/** BRAND entity: Stock Inward > Brand tab (Cost Center, Brand Name, MRP pricing). */
const BRAND_ENTITY = {
  name: 'Brand',
  itemType: 'Brand',
  stockEntity: 'Brand',
  groupCategory: 'Gold',
  brand: 'SIO Brand',
  barcodeAmount: 50000, // Brand barcode requires a Pricing Amount (mandatory)
  transactionType: 'Brand Inward', // grid filter on the internal transfer (probed 14-09-2026)
  vendor: 'Celestia Jewels P',
  async doInward({ brandInward }) {
    await brandInward.open();
    await brandInward.selectTab(); // Brand
    await brandInward.openAddWizard();
    const invoiceNo = uniqueInvoiceNo();
    // Brand basics use Cost Center (not Business Unit); Sub Transaction Type
    // defaults to Invoice.
    await brandInward.fillBasicDetails({
      vendor: this.vendor, purchaseType: 'Direct', costCenter: 'Kakkanad',
      inwardType: 'Stock', purchaser: 'Sioniquser1', invoiceNo,
    });
    await brandInward.attachDemoImageIfOffered(DEMO_FILES.image1); // Brand step 1 offers Add Files
    await brandInward.nextBtn.click();
    await brandInward.waitForIdle();
    await brandInward.fillItem({
      referenceType: 'Combination', groupCategory: 'Gold', category: 'Gold Ornaments',
      brand: this.brand, article: 'Tendulkar', purity: '91.60', noOfPcs: 1,
      grossWeight: 25, mrp: 50000, discountPercent: 0,
    });
    await brandInward.attachDemoImageIfOffered(DEMO_FILES.image2);
    await brandInward.addItemBtn.click();
    await brandInward.waitForIdle();
    // Brand is a 2-step wizard - a second Next may not exist; click if present.
    if (await brandInward.nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await brandInward.nextBtn.click();
      await brandInward.waitForIdle();
    }
    const saved = await brandInward.submit();
    expect(saved, 'brand inward save response').toBeTruthy();
    console.log('brand inward save body:', JSON.stringify(saved).slice(0, 300));
    const inwardNo = inwardNoFrom(saved) || await brandInward.voucherNumber().catch(() => '');
    return { inwardNo, invoiceNo };
  },
};

/** STONE entity: Stock Inward > Stone tab (stone hierarchy, UOM, rate pricing). */
const STONE_ENTITY = {
  name: 'Stone',
  itemType: 'Stone',
  stockEntity: 'Stone',
  // The transfer forms' "Group Category" is a metal-only filter (Gold/Silver/..)
  // with no Stone option, so it is skipped for stone (null). The stone barcode
  // uses barcodeStone.group instead.
  groupCategory: null,
  transactionType: 'Stone Inward', // internal-transfer grid filter (falls back if absent)
  vendor: 'Celestia Jewels P',
  barcodeStone: { group: 'Diamond', article: 'DND-Drop', uom: 'Gram', rate: 1000 },
  async doInward({ stoneInward, page }) {
    await stoneInward.open();
    await stoneInward.selectTab(); // Stone
    await stoneInward.openAddWizard();
    const invoiceNo = uniqueInvoiceNo().replace(/[^A-Za-z0-9]/g, ''); // Stone strips non-alphanumerics
    await stoneInward.fillBasicDetails({
      inwardType: 'Stock', purchaseType: 'Direct', vendor: this.vendor,
      invoiceNo, invoiceDate: '01-01-2026',
    });
    await stoneInward.nextBtn.click();
    await stoneInward.waitForIdle();
    // article search back-fills the stone hierarchy; Without-Tare avoids the tare dialog
    await stoneInward.fillItem({
      refType: 'Combination', stoneArticle: 'DND-Drop', entryMode: 'Without Tare Weight',
      uom: 'Gram', noOfPcs: 1, grossWeight: 25, discountPercent: 0, returnPercent: 0,
      assortedStock: true, // stone stock must be assorted to become lottable/barcodeable
    });
    // Shape ('value') is mandatory and NOT back-filled by the article - set it
    await stoneInward.pick('value', 'Cushion', { exact: true }).catch(() => {});
    await stoneInward.waitForIdle();
    await stoneInward.attachDemoImageIfOffered(DEMO_FILES.image1);
    // stage the item ("Add Items", plural)
    await page.getByRole('button', { name: /^\s*Add Items?\s*$/ }).locator('visible=true').last().click({ timeout: 15_000 }).catch(() => {});
    await stoneInward.waitForIdle();
    await page.waitForTimeout(1_500);
    if (await stoneInward.nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await stoneInward.nextBtn.click();
      await stoneInward.waitForIdle();
    }
    const saved = await stoneInward.submit();
    expect(saved, 'stone inward save response').toBeTruthy();
    console.log('stone inward save body:', JSON.stringify(saved).slice(0, 300));
    const inwardNo = inwardNoFrom(saved) || await stoneInward.voucherNumber().catch(() => '');
    return { inwardNo, invoiceNo };
  },
};

const ENTITIES = { Metal: METAL_ENTITY, Brand: BRAND_ENTITY, Stone: STONE_ENTITY };

/**
 * Register the 7-step tag-transfer suite for one entity + destination.
 * @param {object} cfg
 * @param {string} cfg.title       describe() title
 * @param {string} cfg.tc          test-id prefix, e.g. "TC-HHT"
 * @param {string} cfg.stateFile   per-variant state json filename
 * @param {string} cfg.destinationBU  receiving business unit (login + Transfer Out target)
 * @param {string} [cfg.destinationLabel]  human label for logs
 * @param {string} [cfg.entity]    'Metal' (default) | 'Brand'
 */
/**
 * @param {{title:string, tc:string, stateFile:string, destinationBU:string,
 *   destinationLabel?:string, entity?:'Metal'|'Brand'|'Stone',
 *   stopAfterTransferOut?:boolean, stopAfterTransferProcess?:boolean}} cfg
 */
function registerTagTransferSuite(cfg) {
  const { title, tc, stateFile, destinationBU } = cfg;
  const destLabel = cfg.destinationLabel || destinationBU;
  const entity = ENTITIES[cfg.entity || 'Metal'];
  const state = makeState(stateFile);
  const DEST = { bu: destinationBU };

  test.describe(title, () => {
    test(`${tc}-01 ${entity.name.toLowerCase()} inward at Kakkanad HO`, async ({ loginPage, metalInward, brandInward, stoneInward, page }) => {
      test.setTimeout(600_000);
      await loginAs(loginPage, page, KAKKANAD);
      const { inwardNo, invoiceNo } = await entity.doInward({ metalInward, brandInward, stoneInward, page });
      state.writeState({ inwardNo, invoiceNo });
      console.log(`${entity.name} inward created at Kakkanad (qap): ${inwardNo}`);
    });

    test(`${tc}-02 internal transfer: inward stock -> Lot process + accept`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { inwardNo } = state.readState();
      expect(inwardNo, `run ${tc}-01 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const tx = await internalTransfer.transferToProcess({
        issueFrom: 'Department',
        toProcess: LOT_PROCESS,
        stockEntity: entity.stockEntity,
        transactionType: entity.transactionType,
        rowText: inwardNo,
      });
      expect(JSON.stringify(tx)).toMatch(/success|saved|1001/i);
      const transferNo = tx && tx.data && tx.data.receiptNo;
      state.writeState({ lotTransferNo: transferNo });
      const acc = await internalTransfer.acceptTransfer({
        toProcess: LOT_PROCESS,
        receivedFrom: 'Department',
        stockEntity: entity.stockEntity,
        stockIdentity: 'Stock',
        rowText: transferNo,
      });
      expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
      console.log('Inward stock moved to Lot process and accepted');
    });

    test(`${tc}-03 lot generation from the Lot-process stock`, async ({ loginPage, lotGeneration, page }) => {
      test.setTimeout(600_000);
      const { inwardNo } = state.readState();
      expect(inwardNo, `run ${tc}-01/02 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const lotNo = await lotGeneration.generateLotFromProcess({
        itemType: entity.itemType,
        employee: 'Sioniquser1',
        businessUnit: 'Kakkanad',
      });
      expect(lotNo, 'generated lot number').toBeTruthy();
      state.writeState({ lotNo });
      console.log(`Lot generated at Kakkanad: ${lotNo}`);
    });

    test(`${tc}-04 barcode generation (Sioniquser1) -> tag`, async ({ loginPage, barcodeGeneration, page }) => {
      test.setTimeout(600_000);
      const { lotNo } = state.readState();
      expect(lotNo, `run ${tc}-01..03 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD_BARCODE);

      const tag = await barcodeGeneration.generate({
        itemType: entity.itemType,
        lotNo,
        groupCategory: entity.groupCategory,
        brand: entity.brand, // undefined for Metal/Stone
        amount: entity.barcodeAmount, // undefined for Metal/Stone
        stone: entity.barcodeStone, // undefined for Metal/Brand
        grossWeight: 10,
      });
      // Metal tags are dd/mm/nnnnnnn; Brand tags are alphanumeric (e.g. CBJ00002SB)
      expect(tag, 'generated tag number').toBeTruthy();
      expect(String(tag).length, 'tag looks valid').toBeGreaterThan(4);
      state.writeState({ tag });
      console.log(`Barcode tag generated at Kakkanad: ${tag}`);
    });

    test(`${tc}-05 internal transfer: barcoded stock -> Transfer process + accept (Tagwise)`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { tag } = state.readState();
      expect(tag, `run ${tc}-01..04 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const tx = await internalTransfer.transferToProcess({
        issueFrom: 'Process',
        fromProcess: LOT_PROCESS,
        toProcess: TRANSFER_PROCESS,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Tag Number',
        tag,
      });
      expect(JSON.stringify(tx)).toMatch(/success|saved|1001/i);
      const acc = await internalTransfer.acceptTransfer({
        toProcess: TRANSFER_PROCESS,
        receivedFrom: 'Process',
        fromProcess: LOT_PROCESS,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Tag Number',
        tag,
      });
      expect(acc, 'tagwise transfer accepted (not skipped)').not.toBe('skipped');
      console.log('Barcoded stock moved to Transfer process and accepted (Tagwise)');
    });

    // cfg.stopAfterTransferProcess: only seed the tag into the Transfer process
    // (steps 01-05); the caller registers its own transfer-out variant(s)
    if (cfg.stopAfterTransferProcess) return;

    test(`${tc}-06 transfer out to ${destLabel} (Tag Number)`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag } = state.readState();
      expect(tag, `run ${tc}-01..05 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const out = await transfers.transferOut({
        destination: destinationBU,
        transactionMode: 'Stock',
        itemType: entity.itemType,
        groupCategory: entity.groupCategory,
        fromProcess: LOT_PROCESS,
        fromTransactionType: 'Internal Stock Transfer',
        tag,
      });
      expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
      const transferOutNo = out && out.data && out.data.receiptNo;
      state.writeState({ transferOutNo });
      console.log(`Transfer Out to ${destLabel} submitted for tag ${tag} (${transferOutNo})`);
    });

    // cfg.stopAfterTransferOut: leave the transfer PENDING at the destination
    // (used by the return-tag scenario, which handles the Transfer In itself)
    if (cfg.stopAfterTransferOut) return;

    test(`${tc}-07 transfer in at ${destLabel} (from Kakkanad)`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, transferOutNo } = state.readState();
      expect(tag, `run ${tc}-01..06 first`).toBeTruthy();
      await loginAs(loginPage, page, DEST);

      const inn = await transfers.transferIn({
        fromBU: 'Kakkanad',
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: entity.itemType,
        groupCategory: entity.groupCategory,
        transferOutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
      // where the tag now physically is - the linked reverse flows
      // (branch-ho / branch-branch) read this to know they may move it on
      state.writeState({ location: destinationBU, transferInNo: inn && inn.data && inn.data.receiptNo });
      console.log(`Transfer In accepted at ${destLabel} for tag ${tag} - chain complete (tag now at ${destinationBU})`);
    });
  });
}

module.exports = { registerTagTransferSuite, ENTITIES };
