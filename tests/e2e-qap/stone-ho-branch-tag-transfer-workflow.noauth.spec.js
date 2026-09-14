const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — STONE HO-to-BRANCH TAG TRANSFER
 * (Kakkanad HO -> Palakkad branch). Stone item. TC-SHBR-01..07. MUST run headed.
 */
registerTagTransferSuite({
  title: 'Stone HO-Branch Tag Transfer (Kakkanad -> Palakkad) [qap]',
  tc: 'TC-SHBR',
  stateFile: 'e2e-stone-ho-branch-tag-transfer-state.json',
  entity: 'Stone',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});
