const { registerTagTransferSuite } = require('./_tag-transfer-suite');

/**
 * E2E WORKFLOW (qap) — STONE HO-to-HO TAG TRANSFER (Kakkanad HO -> Aluva HO).
 * Same 7-step chain as Metal, but the item is a STONE (Stock Inward > Stone tab,
 * article "DND-Drop", Diamond). TC-SHHT-01..07. MUST run headed.
 */
registerTagTransferSuite({
  title: 'Stone HO-HO Tag Transfer (Kakkanad -> Aluva) [qap]',
  tc: 'TC-SHHT',
  stateFile: 'e2e-stone-ho-ho-tag-transfer-state.json',
  entity: 'Stone',
  destinationBU: 'Aluva',
  destinationLabel: 'Aluva HO',
});
