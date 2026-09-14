const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap / "process wise" client) — BRANCH-to-HO TAG TRANSFER
 * (Palakkad branch -> Kakkanad HO), by Tag Number.
 *
 * User steps (QA lead, 14-09-2026):
 *   1  Login Palakkad branch (Admin/123/Palakkad) -> Transfers: Transfer OUT to Kakkanad HO
 *   2  Login Kakkanad HO (Admin/123/Kakkanad) -> Transfers: Transfer IN from Palakkad branch
 *
 * A branch can only send stock it already holds, so this spec first SEEDS a tag
 * into Palakkad by running the Kakkanad -> Palakkad chain (TC-BH-SEED-01..07,
 * shared builder), then reverses it (TC-BH-01..02). That keeps the case
 * self-contained and repeatable rather than depending on leftover stock.
 *
 * Branch-side note (probed 14-09-2026): a branch transferring received stock has
 * NO From Process / From Transaction Type on the Transfer Out form - the tag is
 * plain branch stock. Only Transfer Mode / Destination / Transaction Mode / Item
 * Type / Group / Scan Type=Tag Number are needed.
 *
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 */

const STATE = 'e2e-branch-ho-tag-transfer-state.json';
const state = makeState(STATE);
const PALAKKAD = { bu: 'Palakkad' };
const KAKKANAD = { bu: 'Kakkanad' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

// --- Seed: land a fresh tag at Palakkad (Kakkanad HO -> Palakkad branch) ---
registerTagTransferSuite({
  title: 'Branch-HO Tag Transfer [qap] — seed: Kakkanad -> Palakkad',
  tc: 'TC-BH-SEED',
  stateFile: STATE,
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});

// --- Reverse: Palakkad branch -> Kakkanad HO ---
test.describe('Branch-HO Tag Transfer (Palakkad -> Kakkanad) [qap]', () => {
  test('TC-BH-01 transfer out from Palakkad branch to Kakkanad HO (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-BH-SEED-01..07 first (tag must be at Palakkad)').toBeTruthy();
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
    state.writeState({ reverseOutNo });
    console.log(`Transfer Out from Palakkad to Kakkanad submitted for tag ${tag} (${reverseOutNo})`);
  });

  test('TC-BH-02 transfer in at Kakkanad HO (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, reverseOutNo } = state.readState();
    expect(tag, 'run TC-BH-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Metal',
      groupCategory: 'Gold',
      transferOutNo: reverseOutNo, // the OOO-series receipt from TC-BH-01
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Transfer In accepted at Kakkanad for tag ${tag} - Branch-HO chain complete`);
  });
});
