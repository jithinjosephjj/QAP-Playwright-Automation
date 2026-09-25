const { registerLockerTransferSuite } = require('./_locker-transfer-suite');

/**
 * E2E WORKFLOW (qap) — METAL INWARD -> LOCKER -> LOCKER -> LOT PROCESS -> LOT
 * -> BARCODE -> TRANSFER PROCESS, all through Internal Stock Transfer +
 * Accept at the Kakkanad HO (QA lead, 25-09-2026). TC-MILT-01..07:
 * metal inward (Tendulkar, gross 100) -> Department -> Sioniquser2 locker ->
 * Sioniquser3 locker -> Lot FVHK -> lot -> tag -> Transfer FVHK (Tag Number).
 * Steps live in ./_locker-transfer-suite.js. Run the whole file in order
 * (one worker): npm run test:locker-transfer. MUST run headed.
 */
registerLockerTransferSuite({
  title: 'Metal Inward -> Locker -> Locker -> Lot process -> tag -> Transfer process (Kakkanad) [qap]',
  tc: 'TC-MILT',
  stateFile: 'e2e-qap-metal-inward-locker-transfer-state.json',
  entity: 'Metal',
});
