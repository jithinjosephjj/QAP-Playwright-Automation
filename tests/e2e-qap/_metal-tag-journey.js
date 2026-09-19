const { test, expect } = require('../../fixtures/test-fixtures');
const { makeState } = require('../../utils/e2e-state');
const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * METAL TAG JOURNEY (qap, QA lead 18/19-09-2026) — ONE tag, ONE shared state
 * file (e2e-metal-tag-journey-state.json), four legs in this order:
 *
 *   leg 1  HO -> HO          Kakkanad -> Aluva      registerLeg1  (TC-HHT-01..07, creates the tag)
 *   leg 2  HO -> Branch      Aluva -> Cochin        registerLeg2  (TC-HBT-01..02)
 *   leg 3  Branch -> Branch  Cochin -> Palakkad     registerLeg3  (TC-BB-01..02)
 *   leg 4  Branch -> HO      Palakkad -> Kakkanad   registerLeg4  (TC-BH-01..02)
 *
 * Every leg checks the state's `location` before moving the tag on, and
 * writes the new location after its Transfer In. The per-direction spec
 * files register one leg each (run a single leg); metal-tag-journey.noauth.spec
 * registers all four in order (run the whole loop). Playwright forbids a test
 * file importing another test file, hence this helper module.
 *
 * Form facts (probed):
 *   - A head office is "process wise": its Transfer Out only offers Stock
 *     Source Type = Process; a tag received through Transfer In sits in the
 *     Transfer FVHK process under From Transaction Type "InterStockAccept".
 *   - A branch Transfer Out has no From Process / From Transaction Type.
 *   - Cochin-origin transfers were not offered to the receiver's Transfer In
 *     until 19-09-2026 (Palakkad listed only Kakkanad); the full loop went
 *     green that afternoon (tag 26/06/0100009: TTT18/AAAA5, TTTT5/AAAA7,
 *     TTTT8/AAAA4, TTTT5/AAAA5).
 */

const STATE = 'e2e-metal-tag-journey-state.json';
const state = makeState(STATE);
const TRANSFER_PROCESS = 'Transfer FVHK';
const BU = { kakkanad: { bu: 'Kakkanad' }, aluva: { bu: 'Aluva' }, cochin: { bu: 'Cochin' }, palakkad: { bu: 'Palakkad' } };

async function loginAs(loginPage, page, creds) {
  await loginPage.open();
  await loginPage.login(creds);
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

function expectTagAt(where, hint) {
  const { tag, location } = state.readState();
  expect(tag, `no tag in ${STATE} - run the journey from HO-HO (TC-HHT) first`).toBeTruthy();
  expect(location, `tag ${tag} is at "${location || 'unknown'}", not ${where} - ${hint}`).toBe(where);
  return tag;
}

/** Leg 1: Kakkanad HO -> Aluva HO (full 7-step seed, creates the tag). */
function registerLeg1() {
  registerTagTransferSuite({
    title: 'HO-HO Tag Transfer (Kakkanad -> Aluva) [qap] — journey leg 1',
    tc: 'TC-HHT',
    stateFile: STATE,
    destinationBU: 'Aluva',
    destinationLabel: 'Aluva HO',
  });
}

/** Leg 2: Aluva HO -> Cochin branch. */
function registerLeg2() {
  test.describe('HO-Branch Tag Transfer (Aluva -> Cochin) [qap] — journey leg 2', () => {
    test('TC-HBT-01 Aluva: transfer out to Cochin branch (Tag Number)', async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const tag = expectTagAt('Aluva', 'run HO-HO (TC-HHT-01..07) first');
      await loginAs(loginPage, page, BU.aluva);

      const out = await transfers.transferOut({
        destination: 'Cochin',
        transactionMode: 'Stock',
        itemType: 'Metal',
        groupCategory: 'Gold',
        fromProcess: TRANSFER_PROCESS,
        fromTransactionType: 'InterStockAccept', // received-by-Transfer-In stock at an HO
        tag,
      });
      expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
      const leg2OutNo = out && out.data && out.data.receiptNo;
      expect(leg2OutNo, 'transfer out receipt no').toBeTruthy();
      state.writeState({ leg2OutNo, location: 'in transit Aluva -> Cochin' });
      console.log(`Transfer Out from Aluva to Cochin submitted for tag ${tag} (${leg2OutNo})`);
    });

    test('TC-HBT-02 Cochin: transfer in from Aluva HO', async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, leg2OutNo } = state.readState();
      expect(leg2OutNo, 'run TC-HBT-01 first').toBeTruthy();
      await loginAs(loginPage, page, BU.cochin);

      const inn = await transfers.transferIn({
        fromBU: 'Aluva',
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: 'Metal',
        groupCategory: 'Gold',
        transferOutNo: leg2OutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
      state.writeState({ location: 'Cochin', leg2InNo: inn && inn.data && inn.data.receiptNo });
      console.log(`Transfer In accepted at Cochin for tag ${tag} - leg 2 complete (tag now at Cochin)`);
    });
  });
}

/** Leg 3: Cochin branch -> Palakkad branch. */
function registerLeg3() {
  test.describe('Branch-Branch Tag Transfer (Cochin -> Palakkad) [qap] — journey leg 3', () => {
    test('TC-BB-01 transfer out from Cochin branch to Palakkad branch (Tag Number)', async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const tag = expectTagAt('Cochin', 'run HO-Branch (TC-HBT-01..02) first');
      await loginAs(loginPage, page, BU.cochin);

      const out = await transfers.transferOut({
        destination: 'Palakkad',
        transactionMode: 'Stock',
        itemType: 'Metal',
        groupCategory: 'Gold',
        fromProcess: null, // branch stock - not in a process
        fromTransactionType: null,
        tag,
      });
      expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
      const leg3OutNo = out && out.data && out.data.receiptNo;
      expect(leg3OutNo, 'transfer out receipt no').toBeTruthy();
      state.writeState({ leg3OutNo, location: 'in transit Cochin -> Palakkad' });
      console.log(`Transfer Out from Cochin to Palakkad submitted for tag ${tag} (${leg3OutNo})`);
    });

    // History: on 14-09 and the morning of 19-09-2026 transfers originating at
    // Cochin were not offered to the receiving unit (Palakkad's From Business
    // Unit listed only Kakkanad). On the 19-09 afternoon run this step went
    // GREEN (TTTT8 received at Palakkad), so the defect appears fixed on qap.
    test('TC-BB-02 transfer in at Palakkad branch (from Cochin branch)', async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, leg3OutNo } = state.readState();
      expect(leg3OutNo, 'run TC-BB-01 first').toBeTruthy();
      await loginAs(loginPage, page, BU.palakkad);

      const inn = await transfers.transferIn({
        fromBU: 'Cochin',
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: 'Metal',
        groupCategory: 'Gold',
        transferOutNo: leg3OutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
      state.writeState({ location: 'Palakkad', leg3InNo: inn && inn.data && inn.data.receiptNo });
      console.log(`Transfer In accepted at Palakkad for tag ${tag} - leg 3 complete (tag now at Palakkad)`);
    });
  });
}

/** Leg 4: Palakkad branch -> Kakkanad HO (closes the loop). */
function registerLeg4() {
  test.describe('Branch-HO Tag Transfer (Palakkad -> Kakkanad) [qap] — journey leg 4', () => {
    test('TC-BH-01 transfer out from Palakkad branch to Kakkanad HO (Tag Number)', async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const tag = expectTagAt('Palakkad', 'run Branch-Branch (TC-BB-01..02) first');
      await loginAs(loginPage, page, BU.palakkad);

      const out = await transfers.transferOut({
        destination: 'Kakkanad',
        transactionMode: 'Stock',
        itemType: 'Metal',
        groupCategory: 'Gold',
        fromProcess: null, // branch stock - not in a process
        fromTransactionType: null,
        tag,
      });
      expect(JSON.stringify(out)).toMatch(/success|saved|1001/i);
      const reverseOutNo = out && out.data && out.data.receiptNo;
      expect(reverseOutNo, 'transfer out receipt no').toBeTruthy();
      state.writeState({ reverseOutNo, location: 'in transit Palakkad -> Kakkanad' });
      console.log(`Transfer Out from Palakkad to Kakkanad submitted for tag ${tag} (${reverseOutNo})`);
    });

    test('TC-BH-02 transfer in at Kakkanad HO (from Palakkad branch)', async ({ loginPage, transfers, page }) => {
      test.setTimeout(600_000);
      const { tag, reverseOutNo } = state.readState();
      expect(reverseOutNo, 'run TC-BH-01 first').toBeTruthy();
      await loginAs(loginPage, page, BU.kakkanad);

      const inn = await transfers.transferIn({
        fromBU: 'Palakkad',
        transactionMode: 'Stock',
        stockSourceType: 'TagWise',
        itemType: 'Metal',
        groupCategory: 'Gold',
        transferOutNo: reverseOutNo,
        receiver: 'JJ',
      });
      expect(JSON.stringify(inn)).toMatch(/success|saved|1001|accept/i);
      state.writeState({ location: 'Kakkanad', reverseInNo: inn && inn.data && inn.data.receiptNo });
      console.log(`Transfer In accepted at Kakkanad for tag ${tag} - leg 4 complete, journey closed (tag back at Kakkanad)`);
    });
  });
}

module.exports = { registerLeg1, registerLeg2, registerLeg3, registerLeg4, STATE };
