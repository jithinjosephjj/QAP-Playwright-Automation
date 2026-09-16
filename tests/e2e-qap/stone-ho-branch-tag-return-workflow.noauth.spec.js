const { registerTagReturnSuite } = require('./_tag-return-suite');

/**
 * E2E WORKFLOW (qap) — STONE HO-to-BRANCH TAG TRANSFER, RETURNED AT THE BRANCH
 * (Kakkanad HO -> Cochin branch). Stone item (Stock Inward > Stone tab,
 * article DND-Drop, Assorted Stock). TC-SHBRT-SEED-01..06 + TC-SHBRT-01..03.
 * Steps in _tag-return-suite.js. MUST run headed.
 */
registerTagReturnSuite({
  title: 'Stone HO-Branch Tag RETURN (Cochin returns the Stone tag to Kakkanad) [qap]',
  tc: 'TC-SHBRT',
  stateFile: 'e2e-stone-ho-branch-tag-return-state.json',
  entity: 'Stone',
  branchBU: 'Cochin',
  branchLabel: 'Cochin branch',
});
