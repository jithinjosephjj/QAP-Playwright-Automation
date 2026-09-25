const { registerLockerTransferSuite } = require('./_locker-transfer-suite');

/**
 * E2E WORKFLOW (qap) — STONE INWARD -> LOCKER -> LOCKER -> LOT PROCESS -> LOT
 * -> BARCODE -> TRANSFER PROCESS. Same 7-step chain as the Metal variant, but
 * the item is a STONE (Stock Inward > Stone tab, article "DND-Drop", Diamond,
 * 25g assorted stock; Stock Entity Type "Stone"). TC-SILT-01..07:
 * stone inward -> Department -> Sioniquser2 locker -> Sioniquser3 locker ->
 * Lot FVHK -> lot -> tag -> Transfer FVHK (Tag Number).
 * Steps live in ./_locker-transfer-suite.js. Run the whole file in order
 * (one worker): npm run test:locker-transfer:stone. MUST run headed.
 */
registerLockerTransferSuite({
  title: 'Stone Inward -> Locker -> Locker -> Lot process -> tag -> Transfer process (Kakkanad) [qap]',
  tc: 'TC-SILT',
  stateFile: 'e2e-qap-stone-inward-locker-transfer-state.json',
  entity: 'Stone',
});
