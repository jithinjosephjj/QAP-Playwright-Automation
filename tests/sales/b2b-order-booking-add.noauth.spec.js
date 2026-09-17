const { test, expect } = require('../../fixtures/test-fixtures');
const { businessDate } = require('../../utils/unique');
const { DEMO_FILES } = require('../../utils/demo-files');

/**
 * TC-B2B-001 — B2B Order Booking: add an order through Order Details →
 * Build B2B Order Items → Add Items → Next → Submit.
 *
 * Scenario data (QA lead screenshot, 28-08-2026; qap data 15-09-2026):
 *   Purpose Type: Order      Customer: Celestia Jewels P (address auto-fills)
 *   Customer Branch: (empty) Item Type: Metal      Making Type: Job Work
 *   Supervisor: sagar        SM Code: EEEE1 -> Sales Executive: Sioniquser1
 *   Order Given By: JJ       Contact Number: 9898989899
 *   Delivery Note: Urgent    Delivery Date: today + 30 (typed, then the day
 *                            is clicked in the calendar so the popup closes)
 *   Items: Combination / Gold / Gold Ornaments / Tendulkar / 91.60 / gross 50
 *
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 *
 * HISTORY: on the QA client (28-08-2026) POST OrderBooking/CreateOrderBooking
 * returned HTTP 400 listing app-derived fields as missing (bug report filed,
 * traceId 00-c91972f93d6e0db00bd477af252d6745). On qap (15-09-2026) the save
 * succeeds (code 1001, receipt BBBBx) - this spec asserts that response.
 *
 * Delivery Date: typing the date leaves the calendar popup OPEN over the
 * Build Order Items dropdowns (Escape/blur do not close it), so the page
 * object clicks the target day in the calendar - see setDeliveryDate().
 */
test.describe('B2B Order Booking - add record', () => {
  test('TC-B2B-001 add and submit a B2B metal order', async ({ loginPage, b2bOrderBooking, page }) => {
    test.setTimeout(420_000);

    // ---- login ----
    await loginPage.open();
    await loginPage.login();
    await loginPage.throwIfGated();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });

    // ---- Sales & Distribution > B2B > Order, B2B Order Booking tab ----
    await b2bOrderBooking.open();
    await b2bOrderBooking.openAddWizard();

    // ---- General Order Information ----
    await b2bOrderBooking.fillOrderDetails({
      purposeType: 'Order',
      customer: 'Celestia Jewels P',
      itemType: 'Metal',
      makingType: 'Job Work',
      supervisor: 'sagar',
      smCode: 'EEEE1',
      orderGivenBy: 'JJ',
      contactNumber: '9898989899',
      deliveryNote: 'Urgent',
      deliveryDate: businessDate(30).replace(/-/g, '/'), // DD/MM/YYYY
    });

    // Sales Executive auto-fills from the SM code; the summary panel carries
    // the customer picked above.
    await expect
      .poll(async () => b2bOrderBooking.selectValue('salesExecutive'), { timeout: 20_000 })
      .toBe('Sioniquser1');
    await expect
      .poll(async () => b2bOrderBooking.summaryText(), { timeout: 20_000 })
      .toMatch(/Customer Name\s*:\s*Celestia Jewels P/);

    // ---- Build B2B Order Items ----
    await b2bOrderBooking.fillItem({
      referenceType: 'Combination',
      groupCategory: 'Gold',
      category: 'Gold Ornaments',
      article: 'Tendulkar',
      purity: '91.60',
      grossWeight: 50,
    });

    // ---- demo image on the item block via Add Files (Demo files folder) ----
    await b2bOrderBooking.attachDemoImageIfOffered(DEMO_FILES.image1);

    // ---- Add Items (verified via the B2B Order Summary panel) ----
    await b2bOrderBooking.addItemsAndVerify(1);
    const summary = await b2bOrderBooking.summaryText();
    expect(summary).toContain('Gross Weight : 50.000');
    expect(summary).toContain('Net Weight : 50.000');

    // ---- Next -> Submit ----
    if (!(await b2bOrderBooking.submitBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await b2bOrderBooking.nextBtn.click();
      await b2bOrderBooking.waitForIdle();
    }
    await expect(b2bOrderBooking.submitBtn).toBeVisible({ timeout: 30_000 });
    const { responses, diag } = await b2bOrderBooking.submitWithDiagnostics();
    const save = responses.find((r) => r.body);
    expect(save, `no save response captured; validation state: ${JSON.stringify(diag)}`).toBeTruthy();
    expect(save.status, `save rejected: ${JSON.stringify(save && save.body)}`).toBeLessThan(400);
    expect(JSON.stringify(save.body)).toMatch(/success/i);
    console.log(`B2B order saved: ${JSON.stringify(save.body.data || save.body).slice(0, 150)}`);

    await page.screenshot({ path: 'test-results/screens/tc-b2b-001-after-save.png', fullPage: true });
  });
});
