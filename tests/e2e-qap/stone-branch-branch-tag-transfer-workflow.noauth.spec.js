const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — STONE BRANCH-to-BRANCH TAG TRANSFER
 * (Palakkad branch -> Cochin branch), Stone item, by Tag Number.
 * Seeds a Stone tag into Palakkad (TC-SBB-SEED), then moves it Palakkad ->
 * Cochin (TC-SBB-01/02). MUST run headed.
 *
 * NOTE: TC-SBB-02 exercises the same Cochin Transfer In defect as the Metal/
 * Brand Branch-Branch flows (From Business Unit lists "No items found"). Left
 * asserting so it turns green once the app defect is fixed.
 */
const STATE = 'e2e-stone-branch-branch-tag-transfer-state.json';
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
  title: 'Stone Branch-Branch Tag Transfer [qap] — seed: Kakkanad -> Palakkad',
  tc: 'TC-SBB-SEED',
  stateFile: STATE,
  entity: 'Stone',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});

test.describe('Stone Branch-Branch Tag Transfer (Palakkad -> Cochin) [qap]', () => {
  // KNOWN BLOCKER (14-09-2026): a BRANCH Transfer Out requires "Group Category",
  // which auto-defaults to a metal group (Gold) and lists only metal groups - a
  // stone tag belongs to no such group, so it cannot be added and the save is
  // silently blocked. Pending guidance on how stone is transferred OUT of a
  // branch (TC-SBB-02 additionally hits the known Cochin From-BU defect).
  test('TC-SBB-01 transfer out from Palakkad branch to Cochin branch (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-SBB-SEED-01..07 first (stone tag must be at Palakkad)').toBeTruthy();
    await loginAs(loginPage, page, PALAKKAD);

    const out = await transfers.transferOut({
      destination: 'Cochin',
      transactionMode: 'Stock',
      itemType: 'Stone',
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const transferOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ transferOutNo });
    console.log(`Stone Transfer Out from Palakkad to Cochin submitted for tag ${tag} (${transferOutNo})`);
  });

  // KNOWN APP BUG: Cochin Transfer In lists "No items found" for From Business
  // Unit despite the confirmed incoming transfer (same defect as Metal/Brand).
  test('TC-SBB-02 transfer in at Cochin branch (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, transferOutNo } = state.readState();
    expect(tag, 'run TC-SBB-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Stone',
      transferOutNo,
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Stone Transfer In accepted at Cochin for tag ${tag} - Branch-Branch chain complete`);
  });
});
