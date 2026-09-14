const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — BRAND BRANCH-to-HO TAG TRANSFER
 * (Palakkad branch -> Kakkanad HO), Brand item, by Tag Number.
 *
 * Seeds a fresh BRAND tag into Palakkad via the Kakkanad -> Palakkad chain
 * (TC-BBH-SEED-01..07, entity=Brand), then reverses it - Transfer Out
 * Palakkad -> Kakkanad (TC-BBH-01) and Transfer In at Kakkanad (TC-BBH-02).
 * Self-contained. Branch Transfer Out has no From Process / From Transaction
 * Type. MUST run headed.
 */

const STATE = 'e2e-brand-branch-ho-tag-transfer-state.json';
const state = makeState(STATE);
const PALAKKAD = { bu: 'Palakkad' };
const KAKKANAD = { bu: 'Kakkanad' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

registerTagTransferSuite({
  title: 'Brand Branch-HO Tag Transfer [qap] — seed: Kakkanad -> Palakkad',
  tc: 'TC-BBH-SEED',
  stateFile: STATE,
  entity: 'Brand',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});

test.describe('Brand Branch-HO Tag Transfer (Palakkad -> Kakkanad) [qap]', () => {
  test('TC-BBH-01 transfer out from Palakkad branch to Kakkanad HO (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-BBH-SEED-01..07 first (brand tag must be at Palakkad)').toBeTruthy();
    await loginAs(loginPage, page, PALAKKAD);

    const out = await transfers.transferOut({
      destination: 'Kakkanad',
      transactionMode: 'Stock',
      itemType: 'Brand',
      groupCategory: 'Gold',
      tag, // branch stock: no From Process / From Transaction Type
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const reverseOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ reverseOutNo });
    console.log(`Brand Transfer Out from Palakkad to Kakkanad submitted for tag ${tag} (${reverseOutNo})`);
  });

  test('TC-BBH-02 transfer in at Kakkanad HO (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, reverseOutNo } = state.readState();
    expect(tag, 'run TC-BBH-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Brand',
      groupCategory: 'Gold',
      transferOutNo: reverseOutNo,
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Brand Transfer In accepted at Kakkanad for tag ${tag} - Branch-HO chain complete`);
  });
});
