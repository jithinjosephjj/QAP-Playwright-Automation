const { registerLeg3 } = require('./_metal-tag-journey');

/**
 * E2E WORKFLOW (qap) — BRANCH-to-BRANCH TAG TRANSFER (Cochin -> Palakkad), by
 * Tag Number. LEG 3 of the Metal tag journey (TC-BB-01..02):
 *   1  Login Cochin branch -> Transfers: Transfer OUT to Palakkad (Tag Number)
 *   2  Login Palakkad branch -> Transfers: Transfer IN from Cochin
 *      (KNOWN APP BUG: Cochin-origin transfers are not offered to the receiver)
 * Needs the tag at Cochin (leg 2). Steps live in ./_metal-tag-journey.js.
 * Whole loop: npm run test:tag-transfer-suite. MUST run headed.
 */
registerLeg3();
