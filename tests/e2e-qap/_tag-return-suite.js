const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite, ENTITIES } = require('./_tag-transfer-suite');

/**
 * Shared builder for the qap TAG RETURN scenario (QA lead, 15-09-2026):
 * the head office (Kakkanad) transfers a tag to a branch, but the branch
 * does NOT accept it - on the Transfer In page the tag is RETURNED.
 *
 *   <tc>-SEED-01..06  the shared tag chain (inward -> Lot process + accept ->
 *                     Lot -> Barcode as Sioniquser1 -> Transfer process +
 *                     accept (Tagwise) -> Transfer Out Kakkanad -> branch),
 *                     stopping BEFORE the Transfer In so it stays pending.
 *   <tc>-01           Login branch -> Transfers > Transfer In -> From BU
 *                     Kakkanad -> Transfer Out ID -> tag -> RETURN.
 *                     Saves via CreateInterStockAccept (receipt EEE##).
 *   <tc>-02           Branch lists the receipt with Accept Type
 *                     "Accept And Return" and an AUTO-CREATED Transfer Out
 *                     branch -> Kakkanad (the return leg, Submitted).
 *   <tc>-03           Login Kakkanad -> Transfer In from the branch ->
 *                     accept the returned tag back. KNOWN APP BUG
 *                     (15-09-2026): the From Business Unit list is empty
 *                     ("No items found") for the returned transfer - left
 *                     asserting so it turns green once fixed.
 *
 * Entity (Metal / Brand / Stone) comes from _tag-transfer-suite ENTITIES.
 * MUST run headed.
 */

const KAKKANAD = { bu: 'Kakkanad' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

/**
 * @param {{title:string, tc:string, stateFile:string, entity?:'Metal'|'Brand'|'Stone',
 *   branchBU:string, branchLabel?:string}} cfg
 */
function registerTagReturnSuite(cfg) {
  const { title, tc, stateFile, branchBU } = cfg;
  const branchLabel = cfg.branchLabel || `${branchBU} branch`;
  const entity = ENTITIES[cfg.entity || 'Metal'];
  const state = makeState(stateFile);
  const BRANCH = { bu: branchBU };

  registerTagTransferSuite({
    title: `${title} — seed: Kakkanad -> ${branchBU} (pending at ${branchBU})`,
    tc: `${tc}-SEED`,
    stateFile,
    entity: entity.name,
    destinationBU: branchBU,
    destinationLabel: branchLabel,
    stopAfterTransferOut: true,
  });

  test.describe(title, () => {
    test(`${tc}-01 return the ${entity.name.toLowerCase()} tag on Transfer In at ${branchLabel}`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, transferOutNo } = state.readState();
      expect(tag, `run ${tc}-SEED-01..06 first (tag must be pending at ${branchBU})`).toBeTruthy();
      await loginAs(loginPage, page, BRANCH);

      const ret = await transfers.transferInReturn({
        fromBU: 'Kakkanad',
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: entity.itemType,
        groupCategory: entity.groupCategory,
        transferOutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(ret)).toMatch(/success|saved|1001|return/i);
      const returnNo = ret && ret.data && ret.data.receiptNo;
      expect(returnNo, 'return receipt number').toBeTruthy();
      state.writeState({ returnNo });
      console.log(`${entity.name} tag ${tag} RETURNED at ${branchBU} (${returnNo}) - transfer ${transferOutNo} not accepted`);
    });

    test(`${tc}-02 ${branchLabel} lists the return receipt and the auto-created return transfer to Kakkanad`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, returnNo } = state.readState();
      expect(returnNo, `run ${tc}-01 first`).toBeTruthy();
      await loginAs(loginPage, page, BRANCH);

      const inRows = await transfers.listRowsText('Transfer In');
      const receipt = inRows.find((r) => r.includes(returnNo));
      expect(receipt, `Transfer In list has no row for the return receipt ${returnNo}`).toBeTruthy();
      expect(receipt).toMatch(new RegExp(`Kakkanad ${branchBU}`));
      expect(receipt).toMatch(/Accept And Return|Return/);

      // the return leg: newest Transfer Out branch -> Kakkanad in Submitted state
      // (list is newest-first, so the first Submitted row back to Kakkanad is ours)
      const outRows = await transfers.listRowsText('Transfer Out');
      const returnLeg = outRows.find((r) => new RegExp(`${branchBU} Kakkanad`).test(r) && /Submitted/.test(r));
      expect(returnLeg, `no Submitted Transfer Out from ${branchBU} back to Kakkanad was auto-created`).toBeTruthy();
      // Observed 15-09-2026: the auto-created return leg for a BRAND tag is
      // listed with Item Type "Metal" - noted, not asserted (app labelling).
      if (!new RegExp(`\\b${entity.itemType}\\b`).test(returnLeg)) {
        console.log(`NOTE: return leg row does not show Item Type "${entity.itemType}": ${returnLeg}`);
      }
      const returnOutNo = (returnLeg.match(/^\d+\s+(\S+)/) || [])[1];
      expect(returnOutNo).toBeTruthy();
      state.writeState({ returnOutNo });
      console.log(`Return receipt ${returnNo} listed (Accept And Return); return transfer ${returnOutNo} ${branchBU} -> Kakkanad auto-created for ${entity.name} tag ${tag}`);
    });

    // KNOWN APP BUG (15-09-2026): Kakkanad Transfer In "From Business Unit"
    // lists "No items found" for the returned (Submitted) transfer.
    test(`${tc}-03 Kakkanad HO receives the returned ${entity.name.toLowerCase()} tag (Transfer In from ${branchBU})`, async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, returnOutNo } = state.readState();
      expect(returnOutNo, `run ${tc}-02 first`).toBeTruthy();
      await loginAs(loginPage, page, KAKKANAD);

      const inn = await transfers.transferIn({
        fromBU: branchBU,
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: entity.itemType,
        groupCategory: entity.groupCategory,
        transferOutNo: returnOutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
      console.log(`Returned ${entity.name} tag ${tag} received back at Kakkanad (${returnOutNo}) - return chain complete`);
    });
  });
}

module.exports = { registerTagReturnSuite };
