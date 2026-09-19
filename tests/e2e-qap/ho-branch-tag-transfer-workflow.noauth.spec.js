const { registerLeg2 } = require('./_metal-tag-journey');

/**
 * E2E WORKFLOW (qap) — HO-to-BRANCH TAG TRANSFER (Aluva HO -> Cochin branch),
 * by Tag Number. LEG 2 of the Metal tag journey (TC-HBT-01..02):
 *   1  Login Aluva HO -> Transfers: Transfer OUT to Cochin (From Process
 *      Transfer FVHK, From Transaction Type InterStockAccept, Tag Number)
 *   2  Login Cochin branch -> Transfers: Transfer IN from Aluva
 * Needs the tag at Aluva (leg 1). Steps live in ./_metal-tag-journey.js.
 * Whole loop: npm run test:tag-transfer-suite. MUST run headed.
 */
registerLeg2();
