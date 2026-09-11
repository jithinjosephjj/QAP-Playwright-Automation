const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { uniqueInvoiceNo } = require('../../utils/unique');

const state = makeState('e2e-ho-ho-tag-transfer-state.json');

/**
 * E2E WORKFLOW (qap / "process wise" client) — HO-to-HO TAG TRANSFER
 * (Kakkanad HO -> Aluva HO), by Tag Number.
 *
 * Steps (QA lead, 11-09-2026):
 *   1  Login Kakkanad HO (Admin/123/Kakkanad) -> Metal Inward
 *   2  Internal Stock Transfer: change the INWARD stock to LOT process + accept
 *   3  Lot Generation
 *   4  Login Barcode user (Sioniquser1/123/Kakkanad) -> Barcode (generate tag, copy)
 *   5  Login Kakkanad HO -> Internal Stock Transfer: change the BARCODED stock
 *      to TRANSFER process + accept (Tagwise)
 *   6  Transfer OUT to Aluva HO (Scan type = Tag Number, From Transaction Type
 *      = Process Accept)
 *   7  Login Aluva HO (Admin/123/Aluva) -> Transfer IN the stock from Kakkanad
 *
 * Each step logs in fresh with the BU/user it needs. env resolves qap URL +
 * user "Admin" (SIONIQ_CLIENT=qap); only the BU / barcode-user are overridden.
 *
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 */

const KAKKANAD = { bu: 'Kakkanad' };
const KAKKANAD_BARCODE = { user: 'Sioniquser1', bu: 'Kakkanad' };
const ALUVA = { bu: 'Aluva' };

const DATA = {
  inward: {
    subTransactionType: 'Invoice',
    businessUnit: 'Kakkanad',
    inwardType: 'Stock',
    purchaseType: 'Direct',
    vendor: 'Celestia Jewels P', // qap-Kakkanad vendor (probed 11-09-2026)
    purchaser: 'Sioniquser1', // qap-Kakkanad purchaser (probed 11-09-2026)
    item: {
      entryMode: 'SINGLE TAG',
      referenceType: 'Combination',
      article: 'Tendulkar',
      purity: '91.60',
      noOfPcs: 1,
      grossWeightWithTare: 100,
      rate: 6000,
    },
  },
  lotProcess: 'Lot FVHK', // the "Lot process" target (qap, probed 11-09-2026)
  transferProcess: 'Transfer FVHK', // the "Transfer process" target (probed 11-09-2026)
};

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

test.describe('HO-HO Tag Transfer (Kakkanad -> Aluva) [qap]', () => {
  test('TC-HHT-01 metal inward at Kakkanad HO', async ({ loginPage, metalInward, page }) => {
    test.setTimeout(600_000);
    await loginAs(loginPage, page, KAKKANAD);

    await metalInward.open();
    await metalInward.selectTab();
    await metalInward.openAddWizard();

    const invoiceNo = uniqueInvoiceNo();
    await metalInward.fillBasicDetails({
      subTransactionType: DATA.inward.subTransactionType,
      businessUnit: DATA.inward.businessUnit,
      inwardType: DATA.inward.inwardType,
      purchaseType: DATA.inward.purchaseType,
      vendor: DATA.inward.vendor,
      purchaser: DATA.inward.purchaser,
      invoiceNo,
    });
    await metalInward.nextBtn.click();
    await metalInward.waitForIdle();

    await metalInward.fillItem(DATA.inward.item);
    await metalInward.addItemBtn.click();
    await metalInward.waitForIdle();
    await metalInward.nextBtn.click();
    await metalInward.waitForIdle();
    await expect(metalInward.gridRows.filter({ hasText: DATA.inward.item.article })).toHaveCount(1, { timeout: 30_000 });

    const saved = await metalInward.submit();
    expect(saved, 'metal inward save response').toBeTruthy();
    const inwardNo = await metalInward.voucherNumber().catch(() => '');
    state.writeState({ inwardNo, invoiceNo });
    console.log(`Metal inward created at Kakkanad (qap): ${inwardNo}`);
  });

  test('TC-HHT-02 internal transfer: inward stock -> Lot process + accept', async ({ loginPage, internalTransfer, page }) => {
    test.setTimeout(600_000);
    const { inwardNo } = state.readState();
    expect(inwardNo, 'run TC-HHT-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    // Transfer the fresh inward stock (Department) into the Lot process...
    const tx = await internalTransfer.transferToProcess({
      issueFrom: 'Department',
      toProcess: DATA.lotProcess,
      stockEntity: 'Metal',
      transactionType: 'Metal Inward',
      rowText: inwardNo,
    });
    expect(JSON.stringify(tx)).toMatch(/success|saved|1001/i);
    const transferNo = tx && tx.data && tx.data.receiptNo;
    state.writeState({ lotTransferNo: transferNo });
    // ...then accept it into the Lot process (so it's available for Lot gen)
    const acc = await internalTransfer.acceptTransfer({
      toProcess: DATA.lotProcess,
      receivedFrom: 'Department',
      stockEntity: 'Metal',
      stockIdentity: 'Stock',
      rowText: transferNo,
    });
    expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
    console.log('Inward stock moved to Lot process and accepted');
  });

  test('TC-HHT-03 lot generation from the Lot-process stock', async ({ loginPage, lotGeneration, page }) => {
    test.setTimeout(600_000);
    const { inwardNo } = state.readState();
    expect(inwardNo, 'run TC-HHT-01/02 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    // qap lot form shows the "Pending Non-Barcoded Stock" grid on Item Type;
    // pick the latest row (our transferred stock), Employee + BU, Add To Lot.
    const lotNo = await lotGeneration.generateLotFromProcess({
      itemType: 'Metal',
      employee: 'Sioniquser1',
      businessUnit: 'Kakkanad',
    });
    expect(lotNo, 'generated lot number').toBeTruthy();
    state.writeState({ lotNo });
    console.log(`Lot generated at Kakkanad: ${lotNo}`);
  });

  test('TC-HHT-04 barcode generation (Sioniquser1) -> tag', async ({ loginPage, barcodeGeneration, page }) => {
    test.setTimeout(600_000);
    const { lotNo } = state.readState();
    expect(lotNo, 'run TC-HHT-01..03 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD_BARCODE);

    const tag = await barcodeGeneration.generate({
      itemType: 'Metal',
      lotNo, // consume the lot we just generated (LLLxx); falls back to latest
      groupCategory: 'Gold',
      grossWeight: 10,
    });
    expect(tag, 'generated tag number').toMatch(/\d{2}\/\d{2}\/\d{6,7}/);
    state.writeState({ tag });
    console.log(`Barcode tag generated at Kakkanad: ${tag}`);
  });

  test('TC-HHT-05 internal transfer: barcoded stock -> Transfer process + accept (Tagwise)', async ({ loginPage, internalTransfer, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-HHT-01..04 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    // Barcoded stock sits in the Lot process -> transfer it (by Tag Number) into
    // the Transfer process...
    const tx = await internalTransfer.transferToProcess({
      issueFrom: 'Process',
      fromProcess: DATA.lotProcess, // Lot FVHK
      toProcess: DATA.transferProcess, // Transfer FVHK
      stockEntity: 'Metal',
      stockIdentity: 'Tag Number',
      tag,
    });
    expect(JSON.stringify(tx)).toMatch(/success|saved|1001/i);
    // ...then accept it into the Transfer process (Tagwise)
    const acc = await internalTransfer.acceptTransfer({
      toProcess: DATA.transferProcess, // Transfer FVHK
      receivedFrom: 'Process',
      fromProcess: DATA.lotProcess, // Lot FVHK
      stockEntity: 'Metal',
      stockIdentity: 'Tag Number',
      tag,
    });
    expect(acc, 'tagwise transfer accepted (not skipped)').not.toBe('skipped');
    console.log('Barcoded stock moved to Transfer process and accepted (Tagwise)');
  });

  test('TC-HHT-06 transfer out to Aluva HO (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-HHT-01..05 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const out = await transfers.transferOut({
      destination: 'Aluva',
      transactionMode: 'Stock',
      itemType: 'Metal',
      groupCategory: 'Gold',
      fromProcess: DATA.lotProcess, // Lot FVHK (only From Process offered)
      fromTransactionType: 'Internal Stock Transfer',
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const transferOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ transferOutNo });
    console.log(`Transfer Out to Aluva submitted for tag ${tag} (${transferOutNo})`);
  });

  test('TC-HHT-07 transfer in at Aluva HO (from Kakkanad)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, transferOutNo } = state.readState();
    expect(tag, 'run TC-HHT-01..06 first').toBeTruthy();
    await loginAs(loginPage, page, ALUVA);

    const inn = await transfers.transferIn({
      fromBU: 'Kakkanad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Metal',
      groupCategory: 'Gold',
      transferOutNo, // the OOO-series Transfer Out receipt from TC-HHT-06
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Transfer In accepted at Aluva for tag ${tag} - HO-HO chain complete`);
  });
});
