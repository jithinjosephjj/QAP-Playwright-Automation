const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');

/**
 * E2E WORKFLOW (qap / "process wise" client) — BRANCH-to-HO TAG TRANSFER
 * (Palakkad branch -> Kakkanad HO), by Tag Number.
 *
 * User steps (QA lead, 14-09-2026):
 *   1  Login Palakkad branch (Admin/123/Palakkad) -> Transfers: Transfer OUT to Kakkanad HO
 *   2  Login Kakkanad HO (Admin/123/Kakkanad) -> Transfers: Transfer IN from Palakkad branch
 *
 * LINKED STATE (QA lead, 18-09-2026): no seed of its own any more - this flow
 * moves the tag that ho-branch-tag-transfer-workflow (TC-HBT-01..07) landed
 * at Palakkad, read from the shared e2e-metal-tag-journey-state.json. It runs
 * only while that state says the tag is at Palakkad; afterwards the tag is at
 * Kakkanad and a new HO-Branch run is needed for the next journey.
 *
 * Branch-side note (probed 14-09-2026): a branch transferring received stock has
 * NO From Process / From Transaction Type on the Transfer Out form - the tag is
 * plain branch stock. Only Transfer Mode / Destination / Transaction Mode / Item
 * Type / Group / Scan Type=Tag Number are needed.
 *
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 */

const STATE = 'e2e-metal-tag-journey-state.json';
const state = makeState(STATE);
const PALAKKAD = { bu: 'Palakkad' };
const KAKKANAD = { bu: 'Kakkanad' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

test.describe('Branch-HO Tag Transfer (Palakkad -> Kakkanad) [qap] — linked to HO-Branch', () => {
  test('TC-BH-01 transfer out from Palakkad branch to Kakkanad HO (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, location } = state.readState();
    expect(tag, 'no tag in e2e-metal-tag-journey-state.json - run HO-Branch (TC-HBT-01..07) first').toBeTruthy();
    expect(location, `tag ${tag} is at "${location || 'unknown'}", not Palakkad - run HO-Branch (TC-HBT-01..07) to land a tag at Palakkad first`).toBe('Palakkad');
    await loginAs(loginPage, page, PALAKKAD);

    // Branch stock is not in a process - omit From Process / From Transaction Type.
    const out = await transfers.transferOut({
      destination: 'Kakkanad',
      transactionMode: 'Stock',
      itemType: 'Metal',
      groupCategory: 'Gold',
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const reverseOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ reverseOutNo, location: 'in transit Palakkad -> Kakkanad' });
    console.log(`Transfer Out from Palakkad to Kakkanad submitted for tag ${tag} (${reverseOutNo})`);
  });

  test('TC-BH-02 transfer in at Kakkanad HO (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, reverseOutNo } = state.readState();
    expect(reverseOutNo, 'run TC-BH-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Metal',
      groupCategory: 'Gold',
      transferOutNo: reverseOutNo, // the receipt from TC-BH-01
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    state.writeState({ location: 'Kakkanad', reverseInNo: inn && inn.data && inn.data.receiptNo });
    console.log(`Transfer In accepted at Kakkanad for tag ${tag} - Branch-HO chain complete (tag now at Kakkanad)`);
  });
});
