const { test, expect } = require('../../fixtures/test-fixtures');
const { DEMO_FILES } = require('../../utils/demo-files');

/**
 * TC-OB-001 — Order Booking: add a stock order through Order Details →
 * Build Order Items → Add Items → Next → Submit.
 *
 * Scenario data (QA lead screenshot, 23-08-2026; qap data 15-09-2026):
 *   Item Type: Metal        Supervisor: sagar
 *   SM Code:   EEEE1        Sales Executive: Sioniquser1 (auto from SM code)
 *   Delivery Note: Regular  Reference Type: Combination
 *   Article:   Tendulkar (auto-fills Gold / Gold Ornaments + sub-categories)
 *   Delivery Date: the process date, typed then clicked in the flatpickr
 *   calendar (the popup otherwise stays open over the item dropdowns)
 *   Purity:    91.60        No of Pcs: 1 (preset)   Gross Weight: 50
 *
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 *
 * HISTORY: on the QA client (28-08-2026) POST OrderBooking/CreateOrderBooking
 * returned HTTP 400 "One or more validation errors occurred" for fields the
 * app should populate itself (BaseUOM, ClientCurrencyName, per-item HSNCode,
 * GroupCategory/Category + ShortNames). The B2B sibling saves fine on qap
 * (15-09-2026); this spec asserts the save response either way.
 */
test.describe('Order Booking - add record', () => {
  test('TC-OB-001 add and submit a metal stock order', async ({ loginPage, orderBooking, page }) => {
    test.setTimeout(420_000);

    // ---- login ----
    await loginPage.open();
    await loginPage.login();
    await loginPage.throwIfGated();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });

    // ---- Sales & Distribution > B2B > Order, Order Booking tab ----
    await orderBooking.open();

    // delivery date = the app's PROCESS date (the header chip date, e.g.
    // "23/06/2026"), i.e. the login/business date - NOT the real system clock
    const deliveryDate = await orderBooking.processDate();
    expect(deliveryDate, 'process date read from the header').toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    console.log(`process (delivery) date: ${deliveryDate}`);

    await orderBooking.openAddWizard();

    // ---- General Order Information ----
    await orderBooking.fillOrderDetails({
      itemType: 'Metal',
      supervisor: 'sagar',
      smCode: 'EEEE1',
      deliveryNote: 'Regular',
      deliveryDate, // the process/login date
    });

    // Sales Executive auto-fills from the SM Executive Code
    await expect
      .poll(async () => orderBooking.selectValue('salesExecutive'), { timeout: 20_000 })
      .toBe('Sioniquser1');

    // ---- Build Order Items ----
    await orderBooking.fillItem({
      referenceType: 'Combination',
      groupCategory: 'Gold',
      category: 'Gold Ornaments',
      article: 'Tendulkar',
      purity: '91.60',
      grossWeight: 50,
    });

    // The article back-fills the whole hierarchy
    expect(await orderBooking.selectValue('groupCategory')).toBe('Gold');
    expect(await orderBooking.selectValue('category')).toBe('Gold Ornaments');

    // ---- attach one demo image via the Add Files control ----
    await orderBooking.attachFileViaAddFiles(DEMO_FILES.image1);

    // ---- Add Items (verified via the Stock Order Summary panel) ----
    await orderBooking.addItemsAndVerify(1);
    const summary = await orderBooking.summaryText();
    expect(summary).toContain('Gross Weight : 50.000');
    expect(summary).toContain('Net Weight : 50.000');
    expect(summary).toMatch(/Sales Executive\s*:\s*EEEE1 \/ Sioniquser1/);

    // ---- Next -> Submit ----
    if (!(await orderBooking.submitBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await orderBooking.nextBtn.click();
      await orderBooking.waitForIdle();
    }
    await expect(orderBooking.submitBtn).toBeVisible({ timeout: 30_000 });
    const { responses, diag } = await orderBooking.submitWithDiagnostics();
    const save = responses.find((r) => r.body);
    expect(save, `no save response captured; validation state: ${JSON.stringify(diag)}`).toBeTruthy();
    expect(save.status, `save rejected: ${JSON.stringify(save && save.body)}`).toBeLessThan(400);
    expect(JSON.stringify(save.body)).toMatch(/success/i);
    console.log(`Order saved: ${JSON.stringify(save.body.data || save.body).slice(0, 150)}`);

    await page.screenshot({ path: 'test-results/screens/tc-ob-001-after-save.png', fullPage: true });
  });
});
