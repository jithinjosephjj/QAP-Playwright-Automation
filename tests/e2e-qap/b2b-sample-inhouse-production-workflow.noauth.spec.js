const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { businessDate } = require('../../utils/unique');
const { DEMO_FILES } = require('../../utils/demo-files');

/**
 * E2E WORKFLOW (qap) — B2B ORDER WITH SAMPLE / INHOUSE JOB WORK AT THE
 * PRODUCTION UNIT / SAMPLE BACK TO THE HEAD OFFICE.
 *
 * Locations (QA lead, 16-09-2026): Kakkanad + Aluva are head offices;
 * Cochin + Palakkad are branches; Cochin is ALSO the production unit.
 *
 *   Kakkanad HO   TC-QSIP-01  B2B Order Booking WITH a sample (Add Sample panel)
 *                 TC-QSIP-02  Job Work from the order, INHOUSE, Production Unit Cochin
 *                 TC-QSIP-03  Sample Issue INHOUSE, Production Unit Cochin
 *   Cochin (PU)   TC-QSIP-04  Job Assignment - the job work  -> Casting Process XM2N
 *                 TC-QSIP-05  Job Assignment - the sample    -> Casting Process XM2N
 *                 TC-QSIP-06  Process Movement accept (job work + sample)
 *                 TC-QSIP-07  Worker Issue + Receipt for the JOB WORK (item form,
 *                             "Move to Job Finalize")
 *                 TC-QSIP-08  Worker Issue + Receipt for the SAMPLE ("Finalize Sample")
 *                 TC-QSIP-09  Job Finalize -> Generate Barcode (the job work)
 *                 TC-QSIP-10  Sample Receipt (Receipt page, Sample tab, Inhouse)
 *   Kakkanad HO   TC-QSIP-11  Sample Delivery to the customer - back where it started
 *
 * qap production masters (probed 16-09-2026): processes carry the "XM2N"
 * suffix (Casting Process XM2N / Casting Inspection XM2N); the only inhouse
 * worker at Cochin is Sioniquser1; Production Unit lists only Cochin.
 * Rows are keyed by the job work no (TTTT##) and the sample no.
 *
 * RUN 16-09-2026 (order BBB13, sample 9T14YB, job work TTTT8): 01-10 green.
 *   - Process Movement Accept saves ("Accepted", DDDD##) WITHOUT a success
 *     toast for both Job Work and Sample -> flagged as BUG by the save-toast
 *     guard (TC-QSIP-06 red for that reason only).
 *   - KNOWN APP BUG: after the Sample Receipt at the Cochin production unit
 *     (HHHH2) the sample is NOT listed under "Pending for Delivery" at
 *     Kakkanad (nor at Cochin) - Sample Delivery cannot find it, so
 *     TC-QSIP-11 fails. Left asserting so it turns green once fixed (or a
 *     return-transfer step is confirmed as required).
 * State: e2e-qap-b2b-sample-inhouse-state.json. MUST run headed.
 */
const state = makeState('e2e-qap-b2b-sample-inhouse-state.json');
const KAKKANAD = { bu: 'Kakkanad' };
const COCHIN = { bu: 'Cochin' };

const DATA = {
  order: {
    purposeType: 'Order',
    customer: 'Celestia Jewels P',
    itemType: 'Metal',
    makingType: 'Job Work',
    supervisor: 'sagar',
    smCode: 'EEEE1',
    salesExecutive: 'Sioniquser1',
    orderGivenBy: 'JJ',
    contactNumber: '9896564523',
    deliveryNote: 'Urgent',
    referenceType: 'Combination',
    groupCategory: 'Gold',
    category: 'Gold Ornaments',
    article: 'Tendulkar',
    purity: '91.60',
    grossWeight: 50,
    sample: { article: 'Tendulkar', purity: '91.6', pieces: 1, grossWeight: 12, rate: 25000 },
  },
  productionUnit: 'Cochin',
  issue: { itemType: 'Metal', submissionMethod: 'In Person', receivedFrom: 'Celestia', contactNumber: '6565455555' },
  round: { process: 'Casting Process XM2N', subProcess: 'Casting Inspection XM2N', worker: 'Sioniquser1' },
  item: {
    articleSearch: 'tendu',
    article: 'Tendulkar',
    puritySearch: '91.6',
    purity: '22 Karat', // qap caption (QA shows "(22 Karat Gold)")
    weight: '5.000',
    moveToJobFinalize: true,
    image: DEMO_FILES.image3, // the receipt item form offers Add Files
  },
  delivery: { customer: 'Celestia Jewels P', itemType: 'Metal', dispatchType: 'Our Employee', employee: 'Sioniquser1' },
};

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

test.describe('B2B Sample - Inhouse Job Work at Cochin PU - Sample back to Kakkanad [qap]', () => {
  test('TC-QSIP-01 Kakkanad: create the B2B order WITH a sample', async ({ loginPage, b2bOrderBooking, sampleWorkflow, page }) => {
    test.setTimeout(600_000);
    // a new order starts a NEW chain - drop every downstream document number
    // of the previous run (job work, receipts, ...) so later steps never
    // "verify" a document that belongs to an older sample
    state.reset();
    await loginAs(loginPage, page, KAKKANAD);

    await b2bOrderBooking.open();
    await b2bOrderBooking.openAddWizard();
    await b2bOrderBooking.fillOrderDetails({
      purposeType: DATA.order.purposeType,
      customer: DATA.order.customer,
      itemType: DATA.order.itemType,
      makingType: DATA.order.makingType,
      supervisor: DATA.order.supervisor,
      smCode: DATA.order.smCode,
      orderGivenBy: DATA.order.orderGivenBy,
      contactNumber: DATA.order.contactNumber,
      deliveryNote: DATA.order.deliveryNote,
      deliveryDate: businessDate(30).replace(/-/g, '/'),
    });
    await expect
      .poll(async () => b2bOrderBooking.selectValue('salesExecutive'), { timeout: 20_000 })
      .toBe(DATA.order.salesExecutive);

    await b2bOrderBooking.fillSampleItem({
      referenceType: DATA.order.referenceType,
      groupCategory: DATA.order.groupCategory,
      category: DATA.order.category,
      article: DATA.order.article,
      purity: DATA.order.purity,
      grossWeight: DATA.order.grossWeight,
      mainImage: DEMO_FILES.image1,
      sample: { ...DATA.order.sample, image: DEMO_FILES.image2 },
    });
    await b2bOrderBooking.addItemsAndVerify(1);

    if (!(await b2bOrderBooking.submitBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await b2bOrderBooking.nextBtn.click();
      await b2bOrderBooking.waitForIdle();
    }
    await expect(b2bOrderBooking.submitBtn).toBeVisible({ timeout: 30_000 });
    const confirmer = b2bOrderBooking.confirmYesIfAsked();
    const { responses, diag } = await b2bOrderBooking.submitWithDiagnostics();
    await confirmer;
    const save = responses.find((r) => r.body);
    expect(save, `no save response; validation: ${JSON.stringify(diag)}`).toBeTruthy();
    expect(save.status, `save rejected: ${JSON.stringify(save && save.body)}`).toBeLessThan(400);
    const orderNo = save.body.data && save.body.data.receiptNo;
    expect(orderNo, 'generated B2B sample order receipt no').toBeTruthy();
    state.writeState({ orderNo });
    console.log(`B2B sample order created at Kakkanad: ${orderNo}`);

    // the sample registers under its OWN sample no - newest registration row
    const sampleNo = await sampleWorkflow.latestSampleNo();
    expect(sampleNo, 'registered sample number').toBeTruthy();
    state.writeState({ sampleNo });
    console.log(`Sample registered as: ${sampleNo}`);
  });

  test('TC-QSIP-02 Kakkanad: inhouse job work from the order, production unit Cochin', async ({ loginPage, production, page }) => {
    test.setTimeout(600_000);
    const { orderNo } = state.readState();
    expect(orderNo, 'run TC-QSIP-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const jobWorkNo = await production.createInhouseJobWorkFromOrder({
      orderNo,
      productionUnit: DATA.productionUnit,
      itemType: DATA.order.itemType,
    });
    expect(jobWorkNo, 'generated job work number').toBeTruthy();
    state.writeState({ jobWorkNo });
    console.log(`Inhouse job work created for ${orderNo} -> production unit ${DATA.productionUnit}: ${jobWorkNo}`);
  });

  test('TC-QSIP-03 Kakkanad: sample issue inhouse to production unit Cochin', async ({ loginPage, sampleWorkflow, page }) => {
    test.setTimeout(600_000);
    const { sampleNo } = state.readState();
    expect(sampleNo, 'run TC-QSIP-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const issueNo = await sampleWorkflow.createSampleIssueInhouse({
      sampleNo,
      itemType: DATA.issue.itemType,
      productionUnit: DATA.productionUnit,
      submissionMethod: DATA.issue.submissionMethod,
      receivedFrom: DATA.issue.receivedFrom,
      contactNumber: DATA.issue.contactNumber,
      image: DEMO_FILES.image3,
    });
    state.writeState({ issueNo });
    console.log(`Sample ${sampleNo} issued inhouse to ${DATA.productionUnit} (doc: ${issueNo || 'keyed by sample no'})`);
  });

  test('TC-QSIP-04 Cochin: assign the JOB WORK to Casting Process XM2N', async ({ loginPage, production, page }) => {
    test.setTimeout(420_000);
    const { jobWorkNo } = state.readState();
    expect(jobWorkNo, 'run TC-QSIP-02 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);
    await production.assignJob({
      sourceType: 'Job Work',
      generationType: 'Order',
      itemType: DATA.order.itemType,
      process: DATA.round.process,
      subProcess: DATA.round.subProcess,
      rowText: jobWorkNo,
    });
    console.log(`Job work ${jobWorkNo} assigned to ${DATA.round.process} / ${DATA.round.subProcess}`);
  });

  test('TC-QSIP-05 Cochin: assign the SAMPLE to Casting Process XM2N', async ({ loginPage, production, page }) => {
    test.setTimeout(420_000);
    const { sampleNo } = state.readState();
    expect(sampleNo, 'run TC-QSIP-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);
    await production.assignJob({
      sourceType: 'Sample',
      itemType: DATA.order.itemType,
      businessUnit: DATA.productionUnit,
      process: DATA.round.process,
      subProcess: DATA.round.subProcess,
      rowText: sampleNo,
    });
    console.log(`Sample ${sampleNo} assigned to ${DATA.round.process} / ${DATA.round.subProcess}`);
  });

  test('TC-QSIP-06 Cochin: process movement accept for the job work and the sample', async ({ loginPage, production, page }) => {
    test.setTimeout(600_000);
    const { jobWorkNo, sampleNo } = state.readState();
    await loginAs(loginPage, page, COCHIN);
    // (the Job Work accept form has no Item Type filter - only the Sample one does)
    await production.processMovementAccept({ process: DATA.round.process, sourceType: 'Job Work', rowText: jobWorkNo });
    console.log(`Process movement accepted for job work ${jobWorkNo}`);
    await production.processMovementAccept({ process: DATA.round.process, sourceType: 'Sample', itemType: DATA.order.itemType, rowText: sampleNo });
    console.log(`Process movement accepted for sample ${sampleNo}`);
  });

  test('TC-QSIP-07 Cochin: worker issue + receipt for the JOB WORK (Sioniquser1, move to Job Finalize)', async ({ loginPage, production, page }) => {
    test.setTimeout(900_000);
    const { jobWorkNo } = state.readState();
    await loginAs(loginPage, page, COCHIN);
    const header = { ...DATA.round, productionSource: 'Job Work', rowText: jobWorkNo };
    await production.workerIssue(header);
    await production.workerReceipt({ ...header, jobNo: jobWorkNo, item: DATA.item });
    if (production.lastProductionNo) state.writeState({ productionNo: production.lastProductionNo });
    console.log(`Worker issue + receipt done for job work ${jobWorkNo} (moved to Job Finalize)`);
  });

  test('TC-QSIP-08 Cochin: worker issue + receipt for the SAMPLE (Sioniquser1, Finalize Sample)', async ({ loginPage, production, page }) => {
    test.setTimeout(900_000);
    const { sampleNo } = state.readState();
    await loginAs(loginPage, page, COCHIN);
    const header = { ...DATA.round, productionSource: 'Sample', itemType: DATA.order.itemType, rowText: sampleNo };
    await production.workerIssue(header);
    // the FINAL receipt checks "Finalize Sample" - releases the sample to
    // Sample Receipt (samples have no Job Finalize/barcode step)
    await production.workerReceipt({ ...header, finalizeSample: true });
    console.log(`Worker issue + receipt done for sample ${sampleNo} (finalized)`);
  });

  test('TC-QSIP-09 Cochin: job finalize -> generate barcode for the job work', async ({ loginPage, production, page }) => {
    test.setTimeout(600_000);
    const { jobWorkNo } = state.readState();
    await loginAs(loginPage, page, COCHIN);
    const result = await production.finalizeAndGenerateBarcode({ rowText: jobWorkNo });
    expect(JSON.stringify(result)).toMatch(/success|saved|1001/i);
    const tagReceiptNo = result && result.data && result.data.receiptNo;
    state.writeState({ tagReceiptNo });
    console.log(`Job work ${jobWorkNo} finalized, barcode generated (${tagReceiptNo})`);
  });

  test('TC-QSIP-10 Cochin: sample receipt (Receipt page, Sample tab, inhouse)', async ({ loginPage, sampleWorkflow, page }) => {
    test.setTimeout(600_000);
    const { sampleNo, receiptNo: already } = state.readState();
    expect(sampleNo, 'run TC-QSIP-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    // Idempotent re-run: once received, the sample is no longer pending and
    // the receipt form's Job Work Mode list is empty - verify the receipt in
    // the list instead of receiving again.
    if (already) {
      const rows = await sampleWorkflow.listRowsText('/prc/app-repair-setup', 'Sample');
      const row = rows.find((r) => r.includes(already));
      expect(row, `sample receipt ${already} (from an earlier run) not in the Sample Receipt list`).toBeTruthy();
      expect(row).toMatch(/Inhouse/);
      console.log(`Sample ${sampleNo} already received at Cochin as ${already} - verified in the list, skipping the receipt`);
      return;
    }

    const receiptNo = await sampleWorkflow.sampleReceiptInhouse({
      sampleNo,
      productionUnit: DATA.productionUnit,
      itemType: DATA.order.itemType,
    });
    state.writeState({ receiptNo });
    console.log(`Sample ${sampleNo} received at Cochin (doc: ${receiptNo || 'keyed by sample no'})`);
  });

  // KNOWN APP BUG (16-09-2026): the sample received at the Cochin production
  // unit never appears in Kakkanad's "Pending for Delivery" grid - see header.
  test('TC-QSIP-11 Kakkanad: sample delivery to the customer', async ({ loginPage, sampleWorkflow, page }) => {
    test.setTimeout(600_000);
    const { sampleNo } = state.readState();
    expect(sampleNo, 'run TC-QSIP-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);
    const deliveryNo = await sampleWorkflow.sampleDelivery({
      sampleNo,
      customer: DATA.delivery.customer,
      itemType: DATA.delivery.itemType,
      dispatchType: DATA.delivery.dispatchType,
      employee: DATA.delivery.employee,
    });
    state.writeState({ deliveryNo });
    console.log(`Sample ${sampleNo} delivered from Kakkanad (doc: ${deliveryNo || 'keyed by sample no'}) - chain complete`);
  });
});
