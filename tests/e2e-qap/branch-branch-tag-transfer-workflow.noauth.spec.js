const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');

/**
 * E2E WORKFLOW (qap / "process wise" client) — BRANCH-to-BRANCH TAG TRANSFER
 * (Palakkad branch -> Cochin branch), by Tag Number.
 *
 * User flow (QA lead, 14-09-2026):
 *   1  Login Palakkad branch (Admin/123/Palakkad) -> Transfers: Transfer OUT to Cochin
 *   2  Login Cochin branch   (Admin/123/Cochin)   -> Transfers: Transfer IN from Palakkad
 *
 * LINKED STATE (QA lead, 18-09-2026): no seed of its own any more - this flow
 * moves the tag that ho-branch-tag-transfer-workflow (TC-HBT-01..07) landed
 * at Palakkad, read from the shared e2e-metal-tag-journey-state.json. It runs
 * only while that state says the tag is at Palakkad (i.e. the Branch-HO flow
 * has not already taken it); run HO-Branch again for a new tag.
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
const COCHIN = { bu: 'Cochin' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

test.describe('Branch-Branch Tag Transfer (Palakkad -> Cochin) [qap] — linked to HO-Branch', () => {
  test('TC-BB-01 transfer out from Palakkad branch to Cochin branch (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, location } = state.readState();
    expect(tag, 'no tag in e2e-metal-tag-journey-state.json - run HO-Branch (TC-HBT-01..07) first').toBeTruthy();
    expect(location, `tag ${tag} is at "${location || 'unknown'}", not Palakkad - run HO-Branch (TC-HBT-01..07) to land a tag at Palakkad first`).toBe('Palakkad');
    await loginAs(loginPage, page, PALAKKAD);

    // Branch stock is not in a process - omit From Process / From Transaction Type.
    const out = await transfers.transferOut({
      destination: 'Cochin',
      transactionMode: 'Stock',
      itemType: 'Metal',
      groupCategory: 'Gold',
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const branchOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ branchOutNo, location: 'in transit Palakkad -> Cochin' });
    console.log(`Transfer Out from Palakkad to Cochin submitted for tag ${tag} (${branchOutNo})`);
  });

  // KNOWN APP BUG (14-09-2026): the flow is correct, but the Transfer In page at
  // Cochin lists "No items found" for From Business Unit even though the confirmed
  // Palakkad -> Cochin Transfer Out exists - so the incoming transfer cannot be
  // received. The same Transfer In form works when receiving at Kakkanad, Aluva
  // and Palakkad. Left asserting (hard fail) so it turns green once fixed.
  test('TC-BB-02 transfer in at Cochin branch (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, branchOutNo } = state.readState();
    expect(branchOutNo, 'run TC-BB-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Metal',
      groupCategory: 'Gold',
      transferOutNo: branchOutNo, // the receipt from TC-BB-01
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    state.writeState({ location: 'Cochin', branchInNo: inn && inn.data && inn.data.receiptNo });
    console.log(`Transfer In accepted at Cochin for tag ${tag} - Branch-Branch chain complete (tag now at Cochin)`);
  });
});
