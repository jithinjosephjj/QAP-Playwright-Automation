const { registerTagReturnSuite } = require('./_tag-return-suite');

/**
 * E2E WORKFLOW (qap) — HO-to-BRANCH TAG TRANSFER, RETURNED AT THE BRANCH
 * (Kakkanad HO -> Cochin branch), METAL tag. TC-HBRT-SEED-01..06 seed the
 * pending transfer; TC-HBRT-01..03 return it at Cochin and receive it back at
 * Kakkanad (TC-HBRT-03 hits the known From-BU-empty defect).
 * Steps in _tag-return-suite.js. MUST run headed.
 */
registerTagReturnSuite({
  title: 'HO-Branch Tag RETURN (Cochin returns the Metal tag to Kakkanad) [qap]',
  tc: 'TC-HBRT',
  stateFile: 'e2e-ho-branch-tag-return-state.json',
  entity: 'Metal',
  branchBU: 'Cochin',
  branchLabel: 'Cochin branch',
});
