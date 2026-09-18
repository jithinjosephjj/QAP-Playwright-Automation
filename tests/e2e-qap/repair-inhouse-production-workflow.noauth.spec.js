const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { businessDate } = require('../../utils/unique');
const { DEMO_FILES } = require('../../utils/demo-files');

/**
 * E2E WORKFLOW (qap) — REPAIR / INHOUSE PRODUCTION AT COCHIN / DELIVERY.
 * qap port of tests/e2e/b2b-repair-inhouse-production-workflow (QA lead,
 * 18-09-2026): same chain, qap process names ("XM2N" suffix, single Casting
 * round), qap masters (customer Celestia Jewels P, SM code EEEE1, worker
 * Sioniquser1) and the qap location split used by the sample chain:
 *
 *   Kakkanad HO   TC-QRPI-01  Repair Registration (customer item, Add Files image)
 *                 TC-QRPI-02  Repair Issue INHOUSE -> Production Unit Cochin
 *   Cochin (PU)   TC-QRPI-03  Job Assignment (source "Repair", Business Type filter B2B)
 *                             -> Casting Process XM2N / Casting Inspection XM2N
 *                 TC-QRPI-04  Process Movement accept
 *                 TC-QRPI-05  Worker Issue + Receipt (Sioniquser1) - the receipt
 *                             ticks REPAIR FINALIZE (repairs never reach Job
 *                             Finalize; the finalize releases them to Repair Receipt)
 *                 TC-QRPI-06  Repair Receipt (Receipt page, Repair tab, Inhouse)
 *                 TC-QRPI-07  Transfer Out Cochin -> Kakkanad, Transaction Mode
 *                             "Repair" (Repair Items grid, keep only our row)
 *   Kakkanad HO   TC-QRPI-08  Transfer In from Cochin (Transaction Mode Repair)
 *                 TC-QRPI-09  Repair Delivery to the customer
 *
 * Grids key repair rows by the repair-number CORE (save returns a prefixed
 * number while grids display "REP-<core>.1"). State:
 * e2e-qap-repair-inhouse-state.json. MUST run headed.
 *
 * RUN 18-09-2026 (repair GGGG4): 01-06 green (registration GGGG4, issue
 * HHHH4, assignment BBB50, movement DDD21, worker issue RRR18 / receipt
 * RRR22 with Repair Finalize, repair receipt SSSS2 at Cochin). Process
 * Movement Accept saves without a success toast (guard BUG, TC-04 red for
 * that alone). The received repair is pending at Cochin, so the QA lead
 * added the Repair-mode transfer back to Kakkanad (TC-07/08) before the
 * delivery (TC-09).
 */
const state = makeState('e2e-qap-repair-inhouse-state.json');
const KAKKANAD = { bu: 'Kakkanad' };
const COCHIN = { bu: 'Cochin' };

const DATA = {
  registration: {
    customer: 'Celestia Jewels P',
    smCode: 'EEEE1',
    referrer: 'Messi', // QA lead, 18-09-2026
    itemSource: 'Customer Item',
    repairType: 'Polishing QAP',
    description: 'repair inhouse automation (qap)',
    item: {
      groupCategory: 'Gold',
      category: 'Gold Ornaments',
      article: 'G-CB-NK-Tendulkar',
      purity: '91.6',
      expectedAddWeight: 5,
      expectedLossWeight: 5,
      pieces: 1,
      grossWeight: 20,
    },
  },
  productionUnit: 'Cochin',
  issue: { submissionMethod: 'In Person', givenBy: 'JJ', contactNumber: '5545654587' },
  round: { process: 'Casting Process XM2N', subProcess: 'Casting Inspection XM2N', worker: 'Sioniquser1' },
  receipt: { subTransactionType: 'Invoice' },
};

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

function rowKey() {
  const { repairNo } = state.readState();
  return repairNo ? String(repairNo).replace(/^[A-Za-z]+-/, '') : '';
}

test.describe('Repair - Inhouse Production at Cochin PU - Delivery at Kakkanad [qap]', () => {
  test('TC-QRPI-01 Kakkanad: register the repair for the customer', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    state.reset(); // a new registration starts a new chain
    await loginAs(loginPage, page, KAKKANAD);

    const repairNo = await repairWorkflow.registerRepair({
      customer: DATA.registration.customer,
      smCode: DATA.registration.smCode,
      referrer: DATA.registration.referrer,
      itemSource: DATA.registration.itemSource,
      repairType: DATA.registration.repairType,
      deliveryDate: businessDate(15).replace(/-/g, '/'),
      description: DATA.registration.description,
      item: DATA.registration.item,
      image: DEMO_FILES.image1, // Add Files on the registration item step
    });
    expect(repairNo, 'registered repair number').toBeTruthy();
    state.writeState({ repairNo });
    console.log(`Repair registered at Kakkanad: ${repairNo}`);
  });

  test('TC-QRPI-02 Kakkanad: repair issue inhouse to production unit Cochin', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPI-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const issueNo = await repairWorkflow.repairIssueInhouse({
      repairNo,
      productionUnit: DATA.productionUnit,
      submissionMethod: DATA.issue.submissionMethod,
      givenBy: DATA.issue.givenBy,
      contactNumber: DATA.issue.contactNumber,
    });
    state.writeState({ issueNo });
    console.log(`Repair ${repairNo} issued inhouse to ${DATA.productionUnit} (doc: ${issueNo || 'keyed by repair no'})`);
  });

  test('TC-QRPI-03 Cochin: assign the repair job to Casting Process XM2N', async ({ loginPage, production, page }) => {
    test.setTimeout(420_000);
    expect(rowKey(), 'run TC-QRPI-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);
    // the Repair assignment form has NO Item Type select (filters are
    // Business Type / Repair Type / Business Unit / Repair No)
    await production.assignJob({
      sourceType: 'Repair',
      businessType: 'B2B',
      process: DATA.round.process,
      subProcess: DATA.round.subProcess,
      rowText: rowKey(),
    });
    console.log(`Repair job assigned to ${DATA.round.process} / ${DATA.round.subProcess}`);
  });

  test('TC-QRPI-04 Cochin: process movement accept (Casting Process XM2N)', async ({ loginPage, production, page }) => {
    test.setTimeout(420_000);
    await loginAs(loginPage, page, COCHIN);
    await production.processMovementAccept({
      process: DATA.round.process,
      sourceType: 'Repair',
      itemType: 'Metal',
      rowText: rowKey(),
    });
    console.log('Process movement accepted at Casting Process XM2N');
  });

  test('TC-QRPI-05 Cochin: worker issue + receipt with Repair Finalize (Sioniquser1)', async ({ loginPage, production, page }) => {
    test.setTimeout(900_000);
    await loginAs(loginPage, page, COCHIN);
    const header = { ...DATA.round, productionSource: 'Repair', itemType: 'Metal', rowText: rowKey() };
    await production.workerIssue(header);
    // the FINAL receipt is the settlement-wise ITEM FORM: select the offered
    // Production No (item auto-fills from it), tick Repair Finalize, Add
    // Items, Submit - releases the repair to Repair Receipt
    await production.workerReceipt({ ...header, finalizeRepair: true, item: {} });
    console.log('Worker issue + receipt (repair finalized) done at Cochin');
  });

  test('TC-QRPI-06 Cochin: repair receipt (Receipt page, Repair tab, inhouse)', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPI-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    const receiptNo = await repairWorkflow.repairReceiptInhouse({
      repairNo,
      productionUnit: DATA.productionUnit,
      subTransactionType: DATA.receipt.subTransactionType,
    });
    state.writeState({ receiptNo });
    console.log(`Repair ${repairNo} received at Cochin (doc: ${receiptNo || 'keyed by repair no'})`);
  });

  // After the receipt the repaired item sits at the Cochin production unit -
  // it travels back to the head office through a Repair-mode transfer
  // (QA lead, 18-09-2026): Transfer Out Cochin -> Kakkanad, Transfer In at
  // Kakkanad, then the Repair Delivery at Kakkanad.
  test('TC-QRPI-07 Cochin: transfer out the repaired item to Kakkanad (Transaction Mode Repair)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPI-06 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    const out = await transfers.transferOutRepair({ destination: 'Kakkanad', rowText: rowKey() });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const repairTransferOutNo = out && out.data && out.data.receiptNo;
    expect(repairTransferOutNo, 'repair transfer out receipt no').toBeTruthy();
    state.writeState({ repairTransferOutNo });
    console.log(`Repair ${repairNo} transferred out Cochin -> Kakkanad (${repairTransferOutNo})`);
  });

  test('TC-QRPI-08 Kakkanad: transfer in the repaired item from Cochin', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { repairNo, repairTransferOutNo } = state.readState();
    expect(repairTransferOutNo, 'run TC-QRPI-07 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const inn = await transfers.transferInRepair({ fromBU: 'Cochin', transferOutNo: repairTransferOutNo, rowText: rowKey(), receiver: 'JJ' });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Repair ${repairNo} transferred in at Kakkanad (${repairTransferOutNo})`);
  });

  test('TC-QRPI-09 Kakkanad: repair delivery to the customer', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPI-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const deliveryNo = await repairWorkflow.repairDelivery({
      customer: DATA.registration.customer,
      repairNo,
    });
    state.writeState({ deliveryNo });
    console.log(`Repair ${repairNo} delivered from Kakkanad (doc: ${deliveryNo || 'keyed by repair no'}) - chain complete`);
  });
});
