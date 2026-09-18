const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { businessDate } = require('../../utils/unique');
const { DEMO_FILES } = require('../../utils/demo-files');

/**
 * E2E WORKFLOW (qap) — REPAIR REGISTRATION / OUTSOURCE / RECEIPT / DELIVERY.
 * qap port of tests/e2e/b2b-repair-outsource-workflow (QA lead, 18-09-2026),
 * all at the Kakkanad HO (no production unit involved):
 *
 *   TC-QRPO-01  Repair Registration (customer item, Add Files image)
 *   TC-QRPO-02  Repair Issue OUTSOURCE (Issue page, Repair tab, vendor)
 *   TC-QRPO-03  Repair Receipt (Receipt page, Repair tab, Outsource + Invoice
 *               + vendor; repair-no item picks + Add)
 *   TC-QRPO-04  Repair Delivery to the customer
 *
 * qap masters: customer Celestia Jewels P, SM code EEEE1 (-> Sioniquser1),
 * Referrer Messi (mandatory), Repair Type Polishing QAP, article
 * G-CB-NK-Tendulkar; the only vendor on qap is Celestia Jewels P too.
 * Grids key repair rows by the repair-number core ("REP-<core>.1").
 * State: e2e-qap-repair-outsource-state.json. MUST run headed.
 */
const state = makeState('e2e-qap-repair-outsource-state.json');
const KAKKANAD = { bu: 'Kakkanad' };

const DATA = {
  registration: {
    customer: 'Celestia Jewels P',
    smCode: 'EEEE1',
    referrer: 'Messi',
    itemSource: 'Customer Item',
    repairType: 'Polishing QAP',
    description: 'repair outsource automation (qap)',
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
  issue: { vendor: 'Celestia Jewels P', submissionMethod: 'In Person', givenBy: 'JJ', contactNumber: '5545654587' },
  receipt: { subTransactionType: 'Invoice' },
};

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

test.describe('Repair - Outsource - Receipt - Delivery [qap]', () => {
  test('TC-QRPO-01 Kakkanad: register the repair for the customer', async ({ loginPage, repairWorkflow, page }) => {
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

  test('TC-QRPO-02 Kakkanad: repair issue outsource (Procurement > Issue, Repair tab)', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPO-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const issueNo = await repairWorkflow.repairIssueOutsource({
      repairNo,
      vendor: DATA.issue.vendor,
      submissionMethod: DATA.issue.submissionMethod,
      givenBy: DATA.issue.givenBy,
      contactNumber: DATA.issue.contactNumber,
    });
    state.writeState({ issueNo });
    console.log(`Repair ${repairNo} issued outsource to ${DATA.issue.vendor} (doc: ${issueNo || 'keyed by repair no'})`);
  });

  test('TC-QRPO-03 Kakkanad: repair receipt (Receipt page, Repair tab, Outsource + Invoice)', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPO-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const receiptNo = await repairWorkflow.repairReceiptOutsource({
      repairNo,
      vendor: DATA.issue.vendor,
      subTransactionType: DATA.receipt.subTransactionType,
    });
    state.writeState({ receiptNo });
    console.log(`Repair ${repairNo} received back from ${DATA.issue.vendor} (doc: ${receiptNo || 'keyed by repair no'})`);
  });

  test('TC-QRPO-04 Kakkanad: repair delivery to the customer', async ({ loginPage, repairWorkflow, page }) => {
    test.setTimeout(600_000);
    const { repairNo } = state.readState();
    expect(repairNo, 'run TC-QRPO-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const deliveryNo = await repairWorkflow.repairDelivery({
      customer: DATA.registration.customer,
      repairNo,
    });
    state.writeState({ deliveryNo });
    console.log(`Repair ${repairNo} delivered from Kakkanad (doc: ${deliveryNo || 'keyed by repair no'}) - chain complete`);
  });
});
