const { registerLeg1 } = require('./_metal-tag-journey');

/**
 * E2E WORKFLOW (qap) — HO-to-HO TAG TRANSFER (Kakkanad HO -> Aluva HO), by Tag
 * Number. LEG 1 of the Metal tag journey (creates the tag):
 *   1  Login Kakkanad HO -> Metal Inward
 *   2  Internal Stock Transfer: inward stock -> LOT process + accept
 *   3  Lot Generation
 *   4  Login Sioniquser1 -> Barcode (generate tag)
 *   5  Login Kakkanad HO -> Internal Stock Transfer: barcoded stock -> TRANSFER process + accept (Tagwise)
 *   6  Transfer OUT to Aluva HO (Scan type = Tag Number)
 *   7  Login Aluva HO -> Transfer IN from Kakkanad
 * Steps live in ./_tag-transfer-suite.js via ./_metal-tag-journey.js
 * (TC-HHT-01..07). Whole loop: npm run test:tag-transfer-suite. MUST run headed.
 */
registerLeg1();
