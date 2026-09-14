const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — BRAND BRANCH-to-BRANCH TAG TRANSFER
 * (Palakkad branch -> Cochin branch), Brand item, by Tag Number.
 *
 * Seeds a fresh BRAND tag into Palakkad via the Kakkanad -> Palakkad chain
 * (TC-BBB-SEED-01..07, entity=Brand), then moves it branch-to-branch -
 * Transfer Out Palakkad -> Cochin (TC-BBB-01) and Transfer In at Cochin
 * (TC-BBB-02). Self-contained. MUST run headed.
 *
 * NOTE: TC-BBB-02 exercises the same Cochin Transfer In defect seen in the Metal
 * Branch-Branch flow (From Business Unit lists "No items found" for a confirmed
 * incoming branch-to-branch transfer). The step is left asserting so it turns
 * green once the app defect is fixed.
 */

const STATE = 'e2e-brand-branch-branch-tag-transfer-state.json';
const state = makeState(STATE);
const PALAKKAD = { bu: 'Palakkad' };
const COCHIN = { bu: 'Cochin' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

registerTagTransferSuite({
  title: 'Brand Branch-Branch Tag Transfer [qap] — seed: Kakkanad -> Palakkad',
  tc: 'TC-BBB-SEED',
  stateFile: STATE,
  entity: 'Brand',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});

test.describe('Brand Branch-Branch Tag Transfer (Palakkad -> Cochin) [qap]', () => {
  test('TC-BBB-01 transfer out from Palakkad branch to Cochin branch (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-BBB-SEED-01..07 first (brand tag must be at Palakkad)').toBeTruthy();
    await loginAs(loginPage, page, PALAKKAD);

    const out = await transfers.transferOut({
      destination: 'Cochin',
      transactionMode: 'Stock',
      itemType: 'Brand',
      groupCategory: 'Gold',
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const transferOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ transferOutNo });
    console.log(`Brand Transfer Out from Palakkad to Cochin submitted for tag ${tag} (${transferOutNo})`);
  });

  // KNOWN APP BUG (14-09-2026): Cochin Transfer In lists "No items found" for
  // From Business Unit despite the confirmed incoming transfer (same defect as
  // the Metal Branch-Branch flow). Left asserting so it self-heals when fixed.
  test('TC-BBB-02 transfer in at Cochin branch (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, transferOutNo } = state.readState();
    expect(tag, 'run TC-BBB-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Brand',
      groupCategory: 'Gold',
      transferOutNo,
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Brand Transfer In accepted at Cochin for tag ${tag} - Branch-Branch chain complete`);
  });
});
