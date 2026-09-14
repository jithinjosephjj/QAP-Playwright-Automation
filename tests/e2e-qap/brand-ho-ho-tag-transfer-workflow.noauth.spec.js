const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — BRAND HO-to-HO TAG TRANSFER (Kakkanad HO -> Aluva HO).
 * Same 7-step chain as the Metal HO-to-HO, but the item is a BRAND (Stock Inward
 * > Brand tab, Brand Name "SIO Brand"). TC-BHHT-01..07. MUST run headed.
 */
registerTagTransferSuite({
  title: 'Brand HO-HO Tag Transfer (Kakkanad -> Aluva) [qap]',
  tc: 'TC-BHHT',
  stateFile: 'e2e-brand-ho-ho-tag-transfer-state.json',
  entity: 'Brand',
  destinationBU: 'Aluva',
  destinationLabel: 'Aluva HO',
});
