const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { uniqueInvoiceNo } = require('../../utils/unique');

/**
 * Shared builder for the qap "process wise" TAG TRANSFER family: a gold tag is
 * created at Kakkanad HO (inward -> lot -> barcode -> transfer process) and
 * transferred out, by Tag Number, to a destination business unit that receives
 * it via Transfer In. Only the destination differs between variants:
 *   - Kakkanad HO -> Aluva HO       (HO-to-HO)
 *   - Kakkanad HO -> Palakkad branch (HO-to-Branch)
 *
 * Each test logs in fresh with the BU/user it needs; env resolves the qap URL +
 * user "Admin" (SIONIQ_CLIENT=qap), only the BU / barcode-user are overridden.
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 */

const KAKKANAD = { bu: 'Kakkanad' };
const KAKKANAD_BARCODE = { user: 'Sioniquser1', bu: 'Kakkanad' };

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

/**
 * Register the 7-step tag-transfer suite for one destination.
 * @param {object} cfg
 * @param {string} cfg.title       describe() title
 * @param {string} cfg.tc          test-id prefix, e.g. "TC-HHT" or "TC-HBT"
 * @param {string} cfg.stateFile   per-variant state json filename
 * @param {string} cfg.destinationBU  the receiving business unit (login + Transfer Out target)
 * @param {string} [cfg.destinationLabel]  human label for logs (defaults to destinationBU)
 */
function registerTagTransferSuite(cfg) {
  const { title, tc, stateFile, destinationBU } = cfg;
  const destLabel = cfg.destinationLabel || destinationBU;
  const state = makeState(stateFile);
  const DEST = { bu: destinationBU };

  test.describe(title, () => {
    test(`${tc}-01 metal inward at Kakkanad HO`, async ({ loginPage, metalInward, page }) => {
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

    test(`${tc}-02 internal transfer: inward stock -> Lot process + accept`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { inwardNo } = state.readState();
      expect(inwardNo, `run ${tc}-01 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

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

    test(`${tc}-03 lot generation from the Lot-process stock`, async ({ loginPage, lotGeneration, page }) => {
      test.setTimeout(600_000);
      const { inwardNo } = state.readState();
      expect(inwardNo, `run ${tc}-01/02 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const lotNo = await lotGeneration.generateLotFromProcess({
        itemType: 'Metal',
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
        itemType: 'Metal',
        lotNo,
        groupCategory: 'Gold',
        grossWeight: 10,
      });
      expect(tag, 'generated tag number').toMatch(/\d{2}\/\d{2}\/\d{6,7}/);
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
        fromProcess: DATA.lotProcess,
        toProcess: DATA.transferProcess,
        stockEntity: 'Metal',
        stockIdentity: 'Tag Number',
        tag,
      });
      expect(JSON.stringify(tx)).toMatch(/success|saved|1001/i);
      const acc = await internalTransfer.acceptTransfer({
        toProcess: DATA.transferProcess,
        receivedFrom: 'Process',
        fromProcess: DATA.lotProcess,
        stockEntity: 'Metal',
        stockIdentity: 'Tag Number',
        tag,
      });
      expect(acc, 'tagwise transfer accepted (not skipped)').not.toBe('skipped');
      console.log('Barcoded stock moved to Transfer process and accepted (Tagwise)');
    });

    test(`${tc}-06 transfer out to ${destLabel} (Tag Number)`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag } = state.readState();
      expect(tag, `run ${tc}-01..05 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const out = await transfers.transferOut({
        destination: destinationBU,
        transactionMode: 'Stock',
        itemType: 'Metal',
        groupCategory: 'Gold',
        fromProcess: DATA.lotProcess,
        fromTransactionType: 'Internal Stock Transfer',
        tag,
      });
      expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
      const transferOutNo = out && out.data && out.data.receiptNo;
      state.writeState({ transferOutNo });
      console.log(`Transfer Out to ${destLabel} submitted for tag ${tag} (${transferOutNo})`);
    });

    test(`${tc}-07 transfer in at ${destLabel} (from Kakkanad)`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, transferOutNo } = state.readState();
      expect(tag, `run ${tc}-01..06 first`).toBeTruthy();
      await loginAs(loginPage, page, DEST);

      const inn = await transfers.transferIn({
        fromBU: 'Kakkanad',
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: 'Metal',
        groupCategory: 'Gold',
        transferOutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
      console.log(`Transfer In accepted at ${destLabel} for tag ${tag} - chain complete`);
    });
  });
}

module.exports = { registerTagTransferSuite, DATA };
