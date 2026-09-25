const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { ENTITIES } = require('./_tag-transfer-suite');

/**
 * Shared builder for the qap INWARD -> LOCKER -> LOCKER -> LOT PROCESS -> LOT
 * -> BARCODE -> TRANSFER PROCESS chain, all through Internal Stock Transfer +
 * Accept at the Kakkanad HO (QA lead, 25-09-2026). One entity per spec:
 *
 *   <tc>-01  Inward (Metal tab: Tendulkar gross 100 / Stone tab: DND-Drop 25g)
 *   <tc>-02  Internal transfer Department -> Locker (To Employee lockerUser1,
 *            To Locker auto-fills) + Accept at that locker
 *   <tc>-03  Internal transfer Locker -> Locker (lockerUser1 -> lockerUser2)
 *            + Accept at lockerUser2's locker
 *   <tc>-04  Internal transfer Locker (lockerUser2) -> Process "Lot FVHK"
 *            + Accept at the Lot process
 *   <tc>-05  Lot Generation from the Lot-process stock (Sioniquser1)
 *   <tc>-06  Barcode generation (login Sioniquser1) -> tag
 *   <tc>-07  Internal transfer Process "Lot FVHK" -> Process "Transfer FVHK"
 *            by Tag Number + Accept at the Transfer process
 *
 * Form facts (probed 25-09-2026): Issue To = Locker shows "To Employee"
 * (Sioniquser2..5) and back-fills "To Locker" ("Sioniquser2 Locker"); Issue
 * From = Locker shows "From Employee" + Stock Identity Type (default
 * "Stock"); a Process source offers only "RC Number" / "Tag Number". Stock
 * Entity Type: Material (metal inward stock) / Stone / Brand. The Accept
 * form takes Received At = Locker + Employee, Received From = Locker + From
 * Employee. Locker stock grids show article + weight but no inward number,
 * so the locker legs pick the row by the entity's article code (rowKey).
 *
 * A transfer+accept step whose transfer already saved (state holds its
 * receipt no) resumes at the accept. Run the WHOLE spec in order with one
 * worker - every step reads the previous step's numbers from the state
 * file, so a single test picked in VS Code fails on its "run <tc>-0N first"
 * guard. MUST run headed.
 */

const KAKKANAD = { bu: 'Kakkanad' };
const KAKKANAD_BARCODE = { user: 'Sioniquser1', bu: 'Kakkanad' }; // barcode runs as Sioniquser1
const LOT_PROCESS = 'Lot FVHK';
const TRANSFER_PROCESS = 'Transfer FVHK';

/** Row key per entity for the locker stock grids (article code shown there). */
const LOCKER_ROW_KEYS = {
  Metal: 'G-CB-NK-Tendulkar',
  Stone: 'DND-Drop',
  Brand: 'Tendulkar',
};

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

const okSave = (body) => expect(JSON.stringify(body)).toMatch(/success|saved|1001/i);
const receiptOf = (body) => (body && body.data && body.data.receiptNo) || '';
/** A transfer already saved on a previous run resumes at its accept. */
const resumed = (receiptNo) => ({ data: { receiptNo }, resumed: true });

/**
 * @param {{title:string, tc:string, stateFile:string, entity:'Metal'|'Stone'|'Brand',
 *   lockerUser1?:string, lockerUser2?:string, rowKey?:string}} cfg
 */
function registerLockerTransferSuite(cfg) {
  const { title, tc, stateFile } = cfg;
  const entity = ENTITIES[cfg.entity];
  const state = makeState(stateFile);
  const LOCKER_USER_1 = cfg.lockerUser1 || 'Sioniquser2'; // "user 2"
  const LOCKER_USER_2 = cfg.lockerUser2 || 'Sioniquser3'; // another employee with a locker
  const ROW_KEY = cfg.rowKey || LOCKER_ROW_KEYS[cfg.entity];
  const name = entity.name.toLowerCase();

  test.describe(title, () => {
    test(`${tc}-01 ${name} inward at Kakkanad HO`, async ({ loginPage, metalInward, brandInward, stoneInward, page }) => {
      test.setTimeout(600_000);
      state.reset(); // a new inward starts a new chain
      await loginAs(loginPage, page, KAKKANAD);
      const { inwardNo, invoiceNo } = await entity.doInward({ metalInward, brandInward, stoneInward, page });
      expect(inwardNo, `${name} inward receipt no`).toBeTruthy();
      state.writeState({ inwardNo, invoiceNo });
      console.log(`${entity.name} inward created at Kakkanad: ${inwardNo}`);
    });

    test(`${tc}-02 internal transfer Department -> Locker (${LOCKER_USER_1}) + accept`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { inwardNo, lockerTransferNo: done } = state.readState();
      expect(inwardNo, `run ${tc}-01 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const tx = done ? resumed(done) : await internalTransfer.transfer({
        issueFrom: 'Department',
        issueTo: 'Locker',
        toEmployee: LOCKER_USER_1,
        stockEntity: entity.stockEntity,
        transactionType: entity.transactionType,
        rowText: inwardNo,
      });
      if (!tx.resumed) okSave(tx);
      const lockerTransferNo = receiptOf(tx);
      expect(lockerTransferNo, 'department -> locker transfer no').toBeTruthy();
      state.writeState({ lockerTransferNo });

      const acc = await internalTransfer.acceptTransfer({
        receivedAt: 'Locker',
        employee: LOCKER_USER_1,
        receivedFrom: 'Department',
        stockEntity: entity.stockEntity,
        stockIdentity: 'Stock',
        rowText: lockerTransferNo,
      });
      expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
      okSave(acc);
      state.writeState({ lockerAcceptNo: receiptOf(acc) });
      console.log(`${entity.name} stock moved Department -> ${LOCKER_USER_1} locker (${lockerTransferNo}) and accepted`);
    });

    test(`${tc}-03 internal transfer Locker -> Locker (${LOCKER_USER_1} -> ${LOCKER_USER_2}) + accept`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { lockerAcceptNo, lockerToLockerNo: done } = state.readState();
      expect(lockerAcceptNo, `run ${tc}-02 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const tx = done ? resumed(done) : await internalTransfer.transfer({
        issueFrom: 'Locker',
        fromEmployee: LOCKER_USER_1,
        issueTo: 'Locker',
        toEmployee: LOCKER_USER_2,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Stock',
        rowText: ROW_KEY, // locker grids show article/weight, not the inward no
      });
      if (!tx.resumed) okSave(tx);
      const lockerToLockerNo = receiptOf(tx);
      expect(lockerToLockerNo, 'locker -> locker transfer no').toBeTruthy();
      state.writeState({ lockerToLockerNo });

      const acc = await internalTransfer.acceptTransfer({
        receivedAt: 'Locker',
        employee: LOCKER_USER_2,
        receivedFrom: 'Locker',
        fromEmployee: LOCKER_USER_1,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Stock',
        rowText: lockerToLockerNo,
      });
      expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
      okSave(acc);
      state.writeState({ lockerToLockerAcceptNo: receiptOf(acc) });
      console.log(`${entity.name} stock moved ${LOCKER_USER_1} locker -> ${LOCKER_USER_2} locker (${lockerToLockerNo}) and accepted`);
    });

    test(`${tc}-04 internal transfer Locker (${LOCKER_USER_2}) -> ${LOT_PROCESS} + accept`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { lockerToLockerAcceptNo, lotTransferNo: done } = state.readState();
      expect(lockerToLockerAcceptNo, `run ${tc}-03 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const tx = done ? resumed(done) : await internalTransfer.transfer({
        issueFrom: 'Locker',
        fromEmployee: LOCKER_USER_2,
        issueTo: 'Process',
        toProcess: LOT_PROCESS,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Stock',
        rowText: ROW_KEY,
      });
      if (!tx.resumed) okSave(tx);
      const lotTransferNo = receiptOf(tx);
      expect(lotTransferNo, 'locker -> process transfer no').toBeTruthy();
      state.writeState({ lotTransferNo });

      const acc = await internalTransfer.acceptTransfer({
        receivedAt: 'Process',
        toProcess: LOT_PROCESS,
        receivedFrom: 'Locker',
        fromEmployee: LOCKER_USER_2,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Stock',
        rowText: lotTransferNo,
      });
      expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
      okSave(acc);
      state.writeState({ lotAcceptNo: receiptOf(acc) });
      console.log(`${entity.name} stock moved ${LOCKER_USER_2} locker -> ${LOT_PROCESS} (${lotTransferNo}) and accepted`);
    });

    test(`${tc}-05 lot generation from the Lot-process stock`, async ({ loginPage, lotGeneration, page }) => {
      test.setTimeout(600_000);
      const { lotAcceptNo } = state.readState();
      expect(lotAcceptNo, `run ${tc}-04 first`).toBeTruthy();
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

    test(`${tc}-06 barcode generation (Sioniquser1) -> tag`, async ({ loginPage, barcodeGeneration, page }) => {
      test.setTimeout(600_000);
      const { lotNo } = state.readState();
      expect(lotNo, `run ${tc}-05 first`).toBeTruthy();
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
      expect(tag, 'generated tag number').toBeTruthy();
      expect(String(tag).length, 'tag looks valid').toBeGreaterThan(4);
      state.writeState({ tag });
      console.log(`Barcode tag generated at Kakkanad: ${tag}`);
    });

    test(`${tc}-07 internal transfer Process (${LOT_PROCESS}) -> Process (${TRANSFER_PROCESS}) by Tag Number + accept`, async ({ loginPage, internalTransfer, page }) => {
      test.setTimeout(600_000);
      const { tag, processTransferNo: done } = state.readState();
      expect(tag, `run ${tc}-06 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const tx = done ? resumed(done) : await internalTransfer.transfer({
        issueFrom: 'Process',
        fromProcess: LOT_PROCESS,
        issueTo: 'Process',
        toProcess: TRANSFER_PROCESS,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Tag Number',
        tag,
      });
      if (!tx.resumed) okSave(tx);
      const processTransferNo = receiptOf(tx);
      expect(processTransferNo, 'process -> process transfer no').toBeTruthy();
      state.writeState({ processTransferNo });

      const acc = await internalTransfer.acceptTransfer({
        receivedAt: 'Process',
        toProcess: TRANSFER_PROCESS,
        receivedFrom: 'Process',
        fromProcess: LOT_PROCESS,
        stockEntity: entity.stockEntity,
        stockIdentity: 'Tag Number',
        tag,
      });
      expect(acc, 'tagwise transfer accepted (not skipped)').not.toBe('skipped');
      okSave(acc);
      state.writeState({ processAcceptNo: receiptOf(acc) });
      console.log(`Tag ${tag} moved ${LOT_PROCESS} -> ${TRANSFER_PROCESS} (${processTransferNo}) and accepted - chain complete`);
    });
  });
}

module.exports = { registerLockerTransferSuite, LOCKER_ROW_KEYS };
