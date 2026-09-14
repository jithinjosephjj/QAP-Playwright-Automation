const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap / "process wise" client) — BRANCH-to-BRANCH TAG TRANSFER
 * (Palakkad branch -> Cochin branch), by Tag Number.
 *
 * User flow (QA lead, 14-09-2026):
 *   1  Login Palakkad branch (Admin/123/Palakkad) -> Transfers: Transfer OUT to Cochin
 *   2  Login Cochin branch   (Admin/123/Cochin)   -> Transfers: Transfer IN from Palakkad
 *
 * A branch can only send stock it already holds, so this spec first SEEDS a tag
 * into Palakkad by running the Kakkanad -> Palakkad chain (TC-BB-SEED-01..07,
 * shared builder), then moves it branch-to-branch (TC-BB-01..02). Self-contained
 * and repeatable rather than depending on leftover stock.
 *
 * Branch-side note (probed 14-09-2026): a branch transferring received stock has
 * NO From Process / From Transaction Type on the Transfer Out form - the tag is
 * plain branch stock. Only Transfer Mode / Destination / Transaction Mode / Item
 * Type / Group / Scan Type=Tag Number are needed.
 *
 * MUST run headed - see README (Device Radar gate + Local Network Access).
 */

const STATE = 'e2e-branch-branch-tag-transfer-state.json';
const state = makeState(STATE);
const PALAKKAD = { bu: 'Palakkad' };
const COCHIN = { bu: 'Cochin' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

// --- Seed: land a fresh tag at Palakkad (Kakkanad HO -> Palakkad branch) ---
registerTagTransferSuite({
  title: 'Branch-Branch Tag Transfer [qap] — seed: Kakkanad -> Palakkad',
  tc: 'TC-BB-SEED',
  stateFile: STATE,
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});

// --- Move: Palakkad branch -> Cochin branch ---
test.describe('Branch-Branch Tag Transfer (Palakkad -> Cochin) [qap]', () => {
  test('TC-BB-01 transfer out from Palakkad branch to Cochin branch (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-BB-SEED-01..07 first (tag must be at Palakkad)').toBeTruthy();
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
    const transferOutNo = out && out.data && out.data.receiptNo;
    state.writeState({ transferOutNo });
    console.log(`Transfer Out from Palakkad to Cochin submitted for tag ${tag} (${transferOutNo})`);
  });

  // KNOWN APP BUG (14-09-2026): the flow is correct, but the Transfer In page at
  // Cochin lists "No items found" for From Business Unit even though the confirmed
  // Palakkad -> Cochin Transfer Out (OOO series) exists - so the incoming transfer
  // cannot be received. The same Transfer In form works when receiving at Kakkanad,
  // Aluva and Palakkad. This step is left asserting (hard fail) so it turns green
  // automatically once the defect is fixed.
  test('TC-BB-02 transfer in at Cochin branch (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, transferOutNo } = state.readState();
    expect(tag, 'run TC-BB-01 first').toBeTruthy();
    await loginAs(loginPage, page, COCHIN);

    const inn = await transfers.transferIn({
      fromBU: 'Palakkad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Metal',
      groupCategory: 'Gold',
      transferOutNo, // the OOO-series receipt from TC-BB-01
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Transfer In accepted at Cochin for tag ${tag} - Branch-Branch chain complete`);
  });
});
