const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { ENTITIES } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — METAL INWARD -> LOCKER -> LOCKER -> LOT PROCESS, all
 * through Internal Stock Transfer + Accept at the Kakkanad HO (QA lead,
 * 25-09-2026):
 *
 *   TC-MILT-01  Metal Inward (gross weight 100, vendor Celestia Jewels P)
 *   TC-MILT-02  Internal transfer Department -> Locker (To Employee
 *               Sioniquser2, To Locker auto) + Accept at the locker
 *   TC-MILT-03  Internal transfer Locker -> Locker (Sioniquser2 -> Sioniquser3)
 *               + Accept at Sioniquser3's locker
 *   TC-MILT-04  Internal transfer Locker (Sioniquser3) -> Process "Lot FVHK"
 *               + Accept at the Lot process
 *   TC-MILT-05  Lot Generation from the Lot-process stock (Sioniquser1)
 *   TC-MILT-06  Barcode generation (login Sioniquser1) -> tag
 *   TC-MILT-07  Internal transfer Process "Lot FVHK" -> Process "Transfer FVHK"
 *               by Tag Number + Accept at the Transfer process
 *               (05-07 added 25-09-2026; a Process source offers only
 *               "RC Number" / "Tag Number" as Stock Identity Type)
 *
 * Form facts (probed 25-09-2026): Issue To = Locker shows "To Employee"
 * (Sioniquser2..5) and back-fills "To Locker" ("Sioniquser2 Locker"); Issue
 * From = Locker shows "From Employee" and Stock Identity Type (default
 * "Stock"); Stock Entity Type for metal inward stock is "Material". The
 * Accept form takes Received At = Locker + Employee, Received From = Locker
 * + From Employee. State: e2e-qap-metal-inward-locker-transfer-state.json;
 * a transfer+accept step whose transfer already saved resumes at the accept.
 * Run the WHOLE file in order (one worker): every step reads the previous
 * step's numbers from the state file - a single test picked in VS Code
 * fails on its "run TC-MILT-0N first" guard. MUST run headed.
 */
const state = makeState('e2e-qap-metal-inward-locker-transfer-state.json');
const KAKKANAD = { bu: 'Kakkanad' };
const KAKKANAD_BARCODE = { user: 'Sioniquser1', bu: 'Kakkanad' }; // barcode runs as Sioniquser1
const METAL = ENTITIES.Metal; // vendor Celestia Jewels P, Tendulkar, gross 100, Material

const LOCKER_USER_1 = 'Sioniquser2'; // "user 2"
const LOCKER_USER_2 = 'Sioniquser3'; // another employee with a locker
const LOT_PROCESS = 'Lot FVHK';
const TRANSFER_PROCESS = 'Transfer FVHK';
// Locker stock grids list "Gold Metal setting Gold Ornaments ... G-CB-NK-Tendulkar
// 91.60 1 100.000" with no inward number, so the locker legs pick the row by
// the article code (the inward no keys the Department grid only).
const LOCKER_ROW_KEY = 'G-CB-NK-Tendulkar';

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

const okSave = (body) => expect(JSON.stringify(body)).toMatch(/success|saved|1001/i);
const receiptOf = (body) => (body && body.data && body.data.receiptNo) || '';

test.describe('Metal Inward -> Locker -> Locker -> Lot process (Kakkanad) [qap]', () => {
  test('TC-MILT-01 metal inward at Kakkanad HO (gross weight 100)', async ({ loginPage, metalInward, brandInward, stoneInward, page }) => {
    test.setTimeout(600_000);
    state.reset();
    await loginAs(loginPage, page, KAKKANAD);
    const { inwardNo, invoiceNo } = await METAL.doInward({ metalInward, brandInward, stoneInward, page });
    expect(inwardNo, 'metal inward receipt no').toBeTruthy();
    state.writeState({ inwardNo, invoiceNo });
    console.log(`Metal inward created at Kakkanad: ${inwardNo}`);
  });

  test(`TC-MILT-02 internal transfer Department -> Locker (${LOCKER_USER_1}) + accept`, async ({ loginPage, internalTransfer, page }) => {
    test.setTimeout(600_000);
    const { inwardNo, lockerTransferNo: done } = state.readState();
    expect(inwardNo, 'run TC-MILT-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    // resume: the transfer already saved on a previous run -> accept only
    const tx = done ? { data: { receiptNo: done }, resumed: true } : await internalTransfer.transfer({
      issueFrom: 'Department',
      issueTo: 'Locker',
      toEmployee: LOCKER_USER_1,
      stockEntity: METAL.stockEntity,
      transactionType: METAL.transactionType,
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
      stockEntity: METAL.stockEntity,
      stockIdentity: 'Stock',
      rowText: lockerTransferNo,
    });
    expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
    okSave(acc);
    state.writeState({ lockerAcceptNo: receiptOf(acc) });
    console.log(`Stock moved Department -> ${LOCKER_USER_1} locker (${lockerTransferNo}) and accepted`);
  });

  test(`TC-MILT-03 internal transfer Locker -> Locker (${LOCKER_USER_1} -> ${LOCKER_USER_2}) + accept`, async ({ loginPage, internalTransfer, page }) => {
    test.setTimeout(600_000);
    const { lockerAcceptNo, lockerToLockerNo: done } = state.readState();
    expect(lockerAcceptNo, 'run TC-MILT-02 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const tx = done ? { data: { receiptNo: done }, resumed: true } : await internalTransfer.transfer({
      issueFrom: 'Locker',
      fromEmployee: LOCKER_USER_1,
      issueTo: 'Locker',
      toEmployee: LOCKER_USER_2,
      stockEntity: METAL.stockEntity,
      stockIdentity: 'Stock',
      rowText: LOCKER_ROW_KEY, // locker grids show article/weight, not the inward no
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
      stockEntity: METAL.stockEntity,
      stockIdentity: 'Stock',
      rowText: lockerToLockerNo,
    });
    expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
    okSave(acc);
    state.writeState({ lockerToLockerAcceptNo: receiptOf(acc) });
    console.log(`Stock moved ${LOCKER_USER_1} locker -> ${LOCKER_USER_2} locker (${lockerToLockerNo}) and accepted`);
  });

  test(`TC-MILT-04 internal transfer Locker (${LOCKER_USER_2}) -> ${LOT_PROCESS} + accept`, async ({ loginPage, internalTransfer, page }) => {
    test.setTimeout(600_000);
    const { lockerToLockerAcceptNo, lotTransferNo: done } = state.readState();
    expect(lockerToLockerAcceptNo, 'run TC-MILT-03 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const tx = done ? { data: { receiptNo: done }, resumed: true } : await internalTransfer.transfer({
      issueFrom: 'Locker',
      fromEmployee: LOCKER_USER_2,
      issueTo: 'Process',
      toProcess: LOT_PROCESS,
      stockEntity: METAL.stockEntity,
      stockIdentity: 'Stock',
      rowText: LOCKER_ROW_KEY,
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
      stockEntity: METAL.stockEntity,
      stockIdentity: 'Stock',
      rowText: lotTransferNo,
    });
    expect(acc, 'transfer accepted (not skipped)').not.toBe('skipped');
    okSave(acc);
    state.writeState({ lotAcceptNo: receiptOf(acc) });
    console.log(`Stock moved ${LOCKER_USER_2} locker -> ${LOT_PROCESS} (${lotTransferNo}) and accepted`);
  });

  test('TC-MILT-05 lot generation from the Lot-process stock', async ({ loginPage, lotGeneration, page }) => {
    test.setTimeout(600_000);
    const { lotAcceptNo } = state.readState();
    expect(lotAcceptNo, 'run TC-MILT-04 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const lotNo = await lotGeneration.generateLotFromProcess({
      itemType: METAL.itemType,
      employee: 'Sioniquser1',
      businessUnit: 'Kakkanad',
    });
    expect(lotNo, 'generated lot number').toBeTruthy();
    state.writeState({ lotNo });
    console.log(`Lot generated at Kakkanad: ${lotNo}`);
  });

  test('TC-MILT-06 barcode generation (Sioniquser1) -> tag', async ({ loginPage, barcodeGeneration, page }) => {
    test.setTimeout(600_000);
    const { lotNo } = state.readState();
    expect(lotNo, 'run TC-MILT-05 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD_BARCODE);

    const tag = await barcodeGeneration.generate({
      itemType: METAL.itemType,
      lotNo,
      groupCategory: METAL.groupCategory,
      grossWeight: 10,
    });
    expect(tag, 'generated tag number').toBeTruthy();
    expect(String(tag).length, 'tag looks valid').toBeGreaterThan(4);
    state.writeState({ tag });
    console.log(`Barcode tag generated at Kakkanad: ${tag}`);
  });

  test(`TC-MILT-07 internal transfer Process (${LOT_PROCESS}) -> Process (${TRANSFER_PROCESS}) by Tag Number + accept`, async ({ loginPage, internalTransfer, page }) => {
    test.setTimeout(600_000);
    const { tag, processTransferNo: done } = state.readState();
    expect(tag, 'run TC-MILT-06 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const tx = done ? { data: { receiptNo: done }, resumed: true } : await internalTransfer.transfer({
      issueFrom: 'Process',
      fromProcess: LOT_PROCESS,
      issueTo: 'Process',
      toProcess: TRANSFER_PROCESS,
      stockEntity: METAL.stockEntity,
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
      stockEntity: METAL.stockEntity,
      stockIdentity: 'Tag Number',
      tag,
    });
    expect(acc, 'tagwise transfer accepted (not skipped)').not.toBe('skipped');
    okSave(acc);
    state.writeState({ processAcceptNo: receiptOf(acc) });
    console.log(`Tag ${tag} moved ${LOT_PROCESS} -> ${TRANSFER_PROCESS} (${processTransferNo}) and accepted - chain complete`);
  });
});
