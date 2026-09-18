const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap / "process wise" client) — HO-to-BRANCH TAG TRANSFER
 * (Kakkanad HO -> Palakkad branch), by Tag Number.
 *
 * Steps (QA lead, 14-09-2026):
 *   1  Login Kakkanad HO (Admin/123/Kakkanad) -> Metal Inward
 *   2  Internal Stock Transfer: change the INWARD stock to LOT process + accept
 *   3  Lot Generation
 *   4  Login Barcode user (Sioniquser1/123/Kakkanad) -> Barcode (generate tag, copy)
 *   5  Login Kakkanad HO -> Internal Stock Transfer: change the BARCODED stock
 *      to TRANSFER process + accept (Tagwise)
 *   6  Transfer OUT to Palakkad branch (Scan type = Tag Number)
 *   7  Login Palakkad branch (Admin/123/Palakkad) -> Transfer IN from Kakkanad
 *
 * LINKED STATE (QA lead, 18-09-2026): this flow is the SEED of one tag journey.
 * Its state file e2e-metal-tag-journey-state.json is shared with
 *   branch-ho-tag-transfer-workflow     (Palakkad -> Kakkanad) and
 *   branch-branch-tag-transfer-workflow (Palakkad -> Cochin),
 * which move THIS tag on instead of seeding their own. The state's
 * `location` says where the tag is (Palakkad after TC-HBT-07); only one of
 * the two reverse legs can run per tag - run this flow again for a new tag.
 * Shared implementation in ./_tag-transfer-suite.js. MUST run headed.
 */
registerTagTransferSuite({
  title: 'HO-Branch Tag Transfer (Kakkanad -> Palakkad) [qap]',
  tc: 'TC-HBT',
  stateFile: 'e2e-metal-tag-journey-state.json',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});
