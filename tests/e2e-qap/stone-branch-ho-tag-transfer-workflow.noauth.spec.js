const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — STONE BRANCH-to-HO TAG TRANSFER
 * (Palakkad branch -> Kakkanad HO), Stone item, by Tag Number.
 * Seeds a Stone tag into Palakkad (Kakkanad -> Palakkad chain, TC-SBH-SEED),
 * then reverses it (TC-SBH-01/02). MUST run headed.
 */
const STATE = 'e2e-stone-branch-ho-tag-transfer-state.json';
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
  title: 'Stone Branch-HO Tag Transfer [qap] — seed: Kakkanad -> Palakkad',
  tc: 'TC-SBH-SEED',
  stateFile: STATE,
  entity: 'Stone',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});

test.describe('Stone Branch-HO Tag Transfer (Palakkad -> Kakkanad) [qap]', () => {
  // KNOWN BLOCKER (14-09-2026): a BRANCH Transfer Out requires "Group Category",
  // which auto-defaults to a metal group (Gold) and lists only metal groups - a
  // stone tag belongs to no such group, so it cannot be added/scanned and the
  // save is silently blocked. Stone HO->HO / HO->Branch work because they source
  // from a Process (From Process filter finds the tag without a group). Pending
  // guidance on how stone is transferred OUT of a branch.
  test('TC-SBH-01 transfer out from Palakkad branch to Kakkanad HO (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-SBH-SEED-01..07 first (stone tag must be at Palakkad)').toBeTruthy();
    await loginAs(loginPage, page, PALAKKAD);

    const out = await transfers.transferOut({
      destination: 'Kakkanad',
      transactionMode: 'Stock',
      itemType: 'Stone',
      // Group Category is a metal-only filter - omitted for stone
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const reverseOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ reverseOutNo });
    console.log(`Stone Transfer Out from Palakkad to Kakkanad submitted for tag ${tag} (${reverseOutNo})`);
  });

  test('TC-SBH-02 transfer in at Kakkanad HO (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, reverseOutNo } = state.readState();
    expect(tag, 'run TC-SBH-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Stone',
      transferOutNo: reverseOutNo,
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Stone Transfer In accepted at Kakkanad for tag ${tag} - Branch-HO chain complete`);
  });
});
