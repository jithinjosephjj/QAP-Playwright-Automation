const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap / "process wise" client) — HO-to-HO TAG TRANSFER
 * (Kakkanad HO -> Aluva HO), by Tag Number.
 *
 * Steps (QA lead, 11-09-2026):
 *   1  Login Kakkanad HO (Admin/123/Kakkanad) -> Metal Inward
 *   2  Internal Stock Transfer: change the INWARD stock to LOT process + accept
 *   3  Lot Generation
 *   4  Login Barcode user (Sioniquser1/123/Kakkanad) -> Barcode (generate tag, copy)
 *   5  Login Kakkanad HO -> Internal Stock Transfer: change the BARCODED stock
 *      to TRANSFER process + accept (Tagwise)
 *   6  Transfer OUT to Aluva HO (Scan type = Tag Number)
 *   7  Login Aluva HO (Admin/123/Aluva) -> Transfer IN the stock from Kakkanad
 *
 * The 7 steps live in ./_tag-transfer-suite.js (shared with the HO-to-Branch
 * variant); only the destination business unit differs. MUST run headed.
 */
registerTagTransferSuite({
  title: 'HO-HO Tag Transfer (Kakkanad -> Aluva) [qap]',
  tc: 'TC-HHT',
  stateFile: 'e2e-ho-ho-tag-transfer-state.json',
  destinationBU: 'Aluva',
  destinationLabel: 'Aluva HO',
});
