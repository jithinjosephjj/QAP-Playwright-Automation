const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — HO-to-BRANCH TAG TRANSFER via PROVISIONAL RC
 * (Kakkanad HO -> Palakkad branch), Metal tag. QA lead's steps (17-09-2026):
 *
 *   TC-HBPR-SEED-01..05  Metal Inward -> Internal transfer to Lot process +
 *                        accept -> Lot Generation -> Barcode (Sioniquser1) ->
 *                        Internal transfer of the barcoded stock to the
 *                        Transfer process + accept (Tagwise).
 *   TC-HBPR-01  Kakkanad: Transfer Out to Palakkad, Transfer Mode
 *               = PROVISIONAL, tag number -> Submit (the provisional receipt).
 *   TC-HBPR-02  Kakkanad: Transfer Out to Palakkad, Transfer Mode = CONFIRMED,
 *               Transaction Mode = "Provisional RC", the same tag -> Submit
 *               (confirms the provisionally receipted item).
 *   TC-HBPR-03  Palakkad: Transfer In from Kakkanad HO -> Accept.
 *
 * RUN 17-09-2026 (tag 26/06/0100002): SEED 01-05 green, TC-01 green (TTT10,
 * status "Provisional"), TC-02 green (Transaction Mode option reads
 * "ProvisionalRC"; a "Provisional RC" select lists TTT10; save
 * CreateB2BTransferTagMetal -> TTT11, status "Submitted").
 * KNOWN APP BUG (confirmed by QA lead): at Palakkad the Transfer In
 * "Transfer Out ID" typeahead returns "No items found" for TTT11 (and for
 * every other ProvisionalRC transfer, e.g. the QA lead's TTTT8/TTTT6), and
 * Transaction Mode offers no ProvisionalRC - the confirmed item can not be
 * received. TC-HBPR-03 is left asserting so it turns green once fixed.
 * MUST run headed.
 */
const STATE = 'e2e-ho-branch-provisional-rc-state.json';
const state = makeState(STATE);
const KAKKANAD = { bu: 'Kakkanad' };
const PALAKKAD = { bu: 'Palakkad' };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

registerTagTransferSuite({
  title: 'HO-Branch PROVISIONAL RC transfer [qap] — seed: tag into the Transfer process at Kakkanad',
  tc: 'TC-HBPR-SEED',
  stateFile: STATE,
  entity: 'Metal',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
  stopAfterTransferProcess: true, // steps 01-05 only; the transfer outs are below
});

test.describe('HO-Branch PROVISIONAL RC transfer (Kakkanad -> Palakkad) [qap]', () => {
  test('TC-HBPR-01 Kakkanad: PROVISIONAL transfer out to Palakkad (Tag Number)', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag } = state.readState();
    expect(tag, 'run TC-HBPR-SEED-01..05 first (barcoded tag in the Transfer process)').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    const out = await transfers.transferOut({
      destination: 'Palakkad',
      transferMode: 'Provisional',
      transactionMode: 'Stock',
      itemType: 'Metal',
      groupCategory: 'Gold',
      fromProcess: 'Lot FVHK',
      fromTransactionType: 'Internal Stock Transfer',
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const provisionalNo = out && out.data && out.data.receiptNo;
    expect(provisionalNo, 'provisional transfer receipt no').toBeTruthy();
    state.writeState({ provisionalNo });
    console.log(`PROVISIONAL transfer out to Palakkad submitted for tag ${tag} (${provisionalNo})`);
  });

  test('TC-HBPR-02 Kakkanad: CONFIRMED transfer out via Transaction Mode "Provisional RC"', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, provisionalNo } = state.readState();
    expect(provisionalNo, 'run TC-HBPR-01 first').toBeTruthy();
    await loginAs(loginPage, page, KAKKANAD);

    // Transaction Mode "ProvisionalRC" replaces the scan box with a
    // "Provisional RC" select (the TTT## receipt) whose item(s) are submitted
    const out = await transfers.transferOutProvisionalRc({
      destination: 'Palakkad',
      itemType: 'Metal',
      provisionalNo,
      tag,
    });
    expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
    const transferOutNo = out && out.data && out.data.receiptNo;
    expect(transferOutNo, 'confirmed transfer receipt no').toBeTruthy();
    state.writeState({ transferOutNo });
    console.log(`CONFIRMED transfer out (Provisional RC ${provisionalNo}) submitted for tag ${tag} (${transferOutNo})`);
  });

  // KNOWN APP BUG (17-09-2026): the confirmed Provisional-RC transfer is not
  // offered on the Palakkad Transfer In (Transfer Out ID: "No items found").
  test('TC-HBPR-03 Palakkad: transfer in from Kakkanad HO', async ({ loginPage, transfers, page }) => {
    test.setTimeout(600_000);
    const { tag, transferOutNo } = state.readState();
    expect(transferOutNo, 'run TC-HBPR-02 first').toBeTruthy();
    await loginAs(loginPage, page, PALAKKAD);

    const inn = await transfers.transferIn({
      fromBU: 'Kakkanad',
      transactionMode: 'Stock',
      stockSourceType: 'TagWise',
      itemType: 'Metal',
      groupCategory: 'Gold',
      transferOutNo,
      receiver: 'JJ',
    });
    expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
    console.log(`Transfer In accepted at Palakkad for tag ${tag} (${transferOutNo}) - Provisional RC chain complete`);
  });
});
