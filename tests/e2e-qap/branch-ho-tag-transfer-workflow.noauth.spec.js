const { registerLeg4 } = require('./_metal-tag-journey');

/**
 * E2E WORKFLOW (qap) — BRANCH-to-HO TAG TRANSFER (Palakkad -> Kakkanad HO), by
 * Tag Number. LEG 4 of the Metal tag journey (TC-BH-01..02):
 *   1  Login Palakkad branch -> Transfers: Transfer OUT to Kakkanad HO (Tag Number)
 *   2  Login Kakkanad HO -> Transfers: Transfer IN from Palakkad
 * Needs the tag at Palakkad (leg 3); closes the loop (tag back at Kakkanad).
 * Steps live in ./_metal-tag-journey.js. Whole loop: npm run test:tag-transfer-suite.
 * MUST run headed.
 */
registerLeg4();
