const { registerLeg1, registerLeg2, registerLeg3, registerLeg4 } = require('./_metal-tag-journey');

/**
 * METAL TAG JOURNEY (qap) — the four direction flows as ONE ordered chain:
 *   leg 1  Kakkanad -> Aluva      (TC-HHT-01..07, creates the tag)
 *   leg 2  Aluva -> Cochin        (TC-HBT-01..02)
 *   leg 3  Cochin -> Palakkad     (TC-BB-01..02)
 *   leg 4  Palakkad -> Kakkanad   (TC-BH-01..02)
 *
 * Playwright orders test FILES alphabetically, so the four leg files cannot be
 * run together in journey order - this file registers the legs in sequence.
 * Run:  npm run test:tag-transfer-suite   (alias: npm run test:tag-journey)
 * Folder runs exclude this file (--grep-invert metal-tag-journey) so the legs
 * are not registered twice. Shared state: e2e-metal-tag-journey-state.json.
 * MUST run headed.
 */
registerLeg1();
registerLeg2();
registerLeg3();
registerLeg4();
