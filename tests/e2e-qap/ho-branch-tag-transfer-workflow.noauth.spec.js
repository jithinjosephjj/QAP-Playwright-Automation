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
 * Identical to the HO-to-HO variant except the destination is the Palakkad
 * branch. Shared implementation in ./_tag-transfer-suite.js. MUST run headed.
 */
registerTagTransferSuite({
  title: 'HO-Branch Tag Transfer (Kakkanad -> Palakkad) [qap]',
  tc: 'TC-HBT',
  stateFile: 'e2e-ho-branch-tag-transfer-state.json',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});
