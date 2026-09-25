const { registerLockerTransferSuite } = require('./_locker-transfer-suite');

/**
 * E2E WORKFLOW (qap) — BRAND INWARD -> LOCKER -> LOCKER -> LOT PROCESS -> LOT
 * -> BARCODE -> TRANSFER PROCESS. Same 7-step chain as the Metal variant, but
 * the item is a BRAND item (Stock Inward > Brand tab, Cost Center Kakkanad,
 * brand "SIO Brand", article Tendulkar 25g, MRP pricing; Stock Entity Type
 * "Brand"; the brand barcode needs a Pricing Amount). TC-BILT-01..07:
 * brand inward -> Department -> Sioniquser2 locker -> Sioniquser3 locker ->
 * Lot FVHK -> lot -> tag -> Transfer FVHK (Tag Number).
 * Steps live in ./_locker-transfer-suite.js. Run the whole file in order
 * (one worker): npm run test:locker-transfer:brand. MUST run headed.
 *
 * RUN 25-09-2026: TC-01 green (BBB24), TC-02 green (FF174 accepted EE170 at
 * Sioniquser2's locker), TC-03 transfer green (FF175, Locker Sioniquser2 ->
 * Locker Sioniquser3, entity Brand, identity Stock) but its ACCEPT is blocked.
 * KNOWN APP BUG: on Internal Stock Accept the brand locker->locker transfer
 * is never offered - Received At Locker / Employee Sioniquser3 / Received From
 * Locker lists no From Employee ("No items found";
 * GetAllLockerEmployeeFromInterStockTransfer returns []) and Transferred
 * Records stays empty for every field order, employee and Received From
 * (Department / Process too). The identical Metal and Stone transfers are
 * listed and accepted. TC-BILT-03 is left asserting; on re-run it resumes at
 * the accept of FF175 (state file) and turns green once the app is fixed.
 */
registerLockerTransferSuite({
  title: 'Brand Inward -> Locker -> Locker -> Lot process -> tag -> Transfer process (Kakkanad) [qap]',
  tc: 'TC-BILT',
  stateFile: 'e2e-qap-brand-inward-locker-transfer-state.json',
  entity: 'Brand',
});
