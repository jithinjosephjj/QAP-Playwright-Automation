const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — BRAND HO-to-BRANCH TAG TRANSFER
 * (Kakkanad HO -> Palakkad branch). Brand item (Stock Inward > Brand tab, Brand
 * Name "SIO Brand"). TC-BHBR-01..07. MUST run headed.
 */
registerTagTransferSuite({
  title: 'Brand HO-Branch Tag Transfer (Kakkanad -> Palakkad) [qap]',
  tc: 'TC-BHBR',
  stateFile: 'e2e-brand-ho-branch-tag-transfer-state.json',
  entity: 'Brand',
  destinationBU: 'Palakkad',
  destinationLabel: 'Palakkad branch',
});
