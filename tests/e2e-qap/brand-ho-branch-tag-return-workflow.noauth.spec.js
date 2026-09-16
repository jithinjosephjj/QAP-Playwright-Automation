const { registerTagReturnSuite } = require('./_tag-return-suite');

/**
 * E2E WORKFLOW (qap) — BRAND HO-to-BRANCH TAG TRANSFER, RETURNED AT THE BRANCH
 * (Kakkanad HO -> Cochin branch). Brand item (Stock Inward > Brand tab, Brand
 * Name "SIO Brand"). TC-BHBRT-SEED-01..06 + TC-BHBRT-01..03.
 * Steps in _tag-return-suite.js. MUST run headed.
 */
registerTagReturnSuite({
  title: 'Brand HO-Branch Tag RETURN (Cochin returns the Brand tag to Kakkanad) [qap]',
  tc: 'TC-BHBRT',
  stateFile: 'e2e-brand-ho-branch-tag-return-state.json',
  entity: 'Brand',
  branchBU: 'Cochin',
  branchLabel: 'Cochin branch',
});
