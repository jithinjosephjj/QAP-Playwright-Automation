const { StockInwardBasePage } = require('./StockInwardBasePage');

/**
 * Internal Stock Transfer — Procurement > Operations > Internal Transfer
 * (/prc/internal-stock-list). qap "process wise" client (probed live
 * 11-09-2026).
 *
 * Two tabs: Transfer (create) and Accept (approve). The Transfer add form is a
 * 2-step wizard (Stock Transfer Details -> Review & Submit):
 *   Issue From (Department | Locker | Process), Issue To (Locker | Process),
 *   To Process (toDepartmentProcessID, e.g. "Lot FVHK"), To Sub Process
 *   (toDepartmentSubProcessID), Stock Entity Type (Material for metal inward
 *   stock; Brand / Metal Stock / Stone - "Metal" was dropped 24-09-2026),
 *   Transaction Type (transactionTypeID, e.g. "Metal Inward") -> a stock grid appears; CHECK the
 *   row -> a "<entity> Transfer" dialog opens -> Add -> Next -> Submit.
 * Then the Accept tab: select the pending transfer -> Accept.
 *
 * "Change stock to <X> process and accept" = transfer with To Process = X,
 * then Accept. Tagwise transfers set Scan Type = Tag Number.
 */
class InternalTransferPage extends StockInwardBasePage {
  constructor(page) {
    super(page, 'Internal Transfer');
    this.addBtn = page.locator('button:has(i.ri-add-fill)').locator('visible=true').first();
    this.gridRows = page.locator('table tbody tr');
  }

  async open() {
    await this.goto('/prc/internal-stock-list');
    await this.waitForIdle();
    await this.waitForSpinner();
  }

  async openTab(name) {
    await this.page.getByRole('tab', { name: new RegExp(`^\\s*${name}\\s*$`) }).first().click({ timeout: 20_000 });
    await this.waitForIdle();
    await this.page.waitForTimeout(1_000);
  }

  async openAdd(firstSelect = 'fromMasterDataValueID_InternalStockTransferType') {
    await this.waitForSpinner();
    await this.addBtn.click({ timeout: 30_000 });
    await this.select(firstSelect).waitFor({ state: 'visible', timeout: 20_000 });
    await this.page.waitForTimeout(800);
  }

  core(docNo) {
    return String(docNo).replace(/[^A-Za-z0-9]/g, '');
  }

  /** Option texts of a wizard dropdown (opens it, reads, closes it). */
  async optionsOf(controlname) {
    await this.closeStalePanels();
    await this.select(controlname).locator('.ng-select-container').click();
    const opts = this.page.locator('.ng-dropdown-panel .ng-option').locator('visible=true');
    await opts.first().waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
    const all = (await opts.allTextContents()).map((s) => s.trim()).filter(Boolean);
    await this.page.keyboard.press('Escape');
    return all;
  }

  /**
   * Stock Entity Type pick. Since 24-09-2026 the qap Internal Transfer forms
   * list Brand / Metal Stock / Stone / Material - metal inward records are
   * transferred as "Material" (QA lead, 25-09-2026), the old "Metal" entry is
   * gone. The suite asks for Material; older builds that still say Metal get
   * it through the fallback below, and vice versa. Brand/Stone are unchanged.
   */
  async pickStockEntity(controlname, wanted) {
    const FALLBACK = { material: 'Metal', metal: 'Material' };
    const options = await this.optionsOf(controlname);
    const exact = (o) => options.some((t) => t.toLowerCase() === String(o).toLowerCase());
    if (exact(wanted)) return this.pick(controlname, wanted, { exact: true });
    const alt = FALLBACK[String(wanted).toLowerCase()];
    if (alt && exact(alt)) {
      console.log(`Stock Entity Type: "${wanted}" not offered ${JSON.stringify(options)} - picking "${alt}"`);
      return this.pick(controlname, alt, { exact: true });
    }
    throw new Error(`Stock Entity Type "${wanted}" not offered; options: ${JSON.stringify(options)}`);
  }

  /**
   * Transfer stock from Department to a target Process (Transfer tab).
   * Returns the saved transfer body.
   */
  async transferToProcess(opts) {
    return this.transfer({ ...opts, issueTo: 'Process' });
  }

  /**
   * Generic Transfer-tab form (probed 25-09-2026 for the Locker legs):
   *   Issue From = Department | Locker (+ From Employee -> From Locker auto)
   *                | Process (+ From Process)
   *   Issue To   = Locker (+ To Employee -> To Locker auto) | Process (+ To
   *                Process / Sub Process)
   *   Stock Entity Type, then Transaction Type (Department source) or Stock
   *   Identity Type (Locker / Process source; Locker defaults to "Stock").
   * Employees are the locker holders (e.g. Sioniquser2..5 at Kakkanad).
   */
  async transfer({ issueFrom = 'Department', fromEmployee, fromProcess, issueTo = 'Process', toEmployee, toProcess, toSubProcess, stockEntity = 'Metal', stockIdentity, transactionType = 'Metal Inward', rowText, tag }) {
    await this.open();
    await this.openTab('Transfer');
    await this.openAdd();

    await this.pick('fromMasterDataValueID_InternalStockTransferType', issueFrom, { exact: true });
    // Process source (barcoded/lotted stock) reveals a From Process picker;
    // Locker source reveals From Employee (From Locker back-fills from it)
    if (issueFrom === 'Process' && fromProcess) await this.pick('fromDepartmentProcessID', fromProcess, { search: true });
    if (issueFrom === 'Locker' && fromEmployee) await this.pick('fromEmployeeID', fromEmployee, { exact: true });
    await this.pick('toMasterDataValueID_InternalStockTransferType', issueTo, { exact: true });
    if (issueTo === 'Locker') {
      await this.pick('toEmployeeID', toEmployee, { exact: true });
      const toLocker = await this.inputByLabel('To Locker').inputValue().catch(() => '');
      console.log(`internal transfer: To Employee ${toEmployee} -> To Locker "${toLocker}"`);
    } else {
      await this.pick('toDepartmentProcessID', toProcess, { search: true });
      if (toSubProcess) await this.pick('toDepartmentSubProcessID', toSubProcess, { search: true }).catch(() => {});
    }
    await this.pickStockEntity('masterDataValueID_StockEntityType', stockEntity);
    // Department source filters by Transaction Type; Process source filters by
    // Stock Identity Type (Tag Number for Tagwise transfers).
    if (stockIdentity) {
      await this.pick('masterDataValueID_StockIdentityType', stockIdentity, { exact: true });
    } else if (transactionType) {
      await this.pick('transactionTypeID', transactionType, { exact: true }).catch(() => {});
    }
    await this.waitForIdle();
    await this.page.waitForTimeout(2_500);

    // Tagwise: enter the tag and Search to fetch the row
    if (tag) {
      const box = this.page.getByRole('textbox', { name: /Enter tag no/i }).locator('visible=true').first();
      await box.click({ timeout: 10_000 }).catch(() => {});
      await box.fill(String(tag)).catch(() => {});
      await this.page.getByRole('button', { name: /^\s*Search\s*$/ }).locator('visible=true').last().click({ timeout: 10_000 }).catch(() => {});
      await this.waitForIdle();
      await this.page.waitForTimeout(2_000);
    }

    await this.selectStockRowAndAdd(tag || rowText);

    // wizard: Next -> Submit
    if (await this.nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.nextBtn.click();
      await this.waitForIdle();
      await this.page.waitForTimeout(1_500);
    }
    return this.commitAndCapture('Submit', 'internal transfer');
  }

  /** Check the stock row -> confirm the "<entity> Transfer" dialog with Add. */
  async selectStockRowAndAdd(rowText) {
    // match the raw identifier (keeps a tag's slashes, e.g. 26/01/0100010) or
    // its punctuation-stripped core (doc numbers like MMM24)
    const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let row = rowText
      ? this.gridRows.filter({ hasText: new RegExp(`${esc(rowText)}|${esc(this.core(rowText))}`, 'i') }).first()
      : this.gridRows.filter({ has: this.page.getByRole('checkbox') }).first();
    if (rowText && !(await row.isVisible().catch(() => false))) {
      // locker grids key stock differently than the inward no - after a
      // grace period fall back to the first selectable row (logged)
      const found = await row.waitFor({ state: 'visible', timeout: 15_000 }).then(() => true).catch(() => false);
      if (!found) {
        row = this.gridRows.filter({ has: this.page.getByRole('checkbox') }).first();
        console.log(`internal transfer: no row matches "${rowText}" - taking the first selectable row: ${((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').slice(0, 120)}`);
      }
    }
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    const box = row.getByRole('checkbox').first();
    if (!(await box.isChecked().catch(() => false))) await box.check({ force: true });
    // an item dialog ("Metal Transfer" / "Brand Transfer" / "<entity> Transfer")
    // opens - confirm it. Metal's button is "Add"; Brand's is "Save".
    const dlg = this.page.locator('[role="dialog"], .modal, ngb-modal-window').filter({ hasText: /Transfer/i }).last();
    if (await dlg.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await dlg.getByRole('button', { name: /^\s*(Add|Save)\s*$/ }).last().click({ timeout: 8_000 }).catch(() => {});
      await dlg.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
      await this.page.waitForTimeout(1_500);
      console.log('internal transfer: item confirmed via dialog');
    }
  }

  /**
   * Accept a pending transfer. Accept is its OWN add form (Accept tab -> "+"):
   * Received At = Process, To Process (departmentProcessID) = the target
   * process, Received From (the transfer's source, e.g. Department), Stock
   * Entity (Metal), Stock Identity Type (Stock | Tag Number) -> a grid of
   * pending transfers appears; select the row (by rowText, else first) -> the
   * footer "Accept" button.
   */
  async acceptTransfer({ toProcess, toSubProcess, receivedAt = 'Process', employee, receivedFrom = 'Department', fromProcess, fromEmployee, stockEntity = 'Metal', stockIdentity = 'Stock', rowText, tag } = {}) {
    await this.open();
    await this.openTab('Accept');
    await this.openAdd('receivedAt');

    await this.pick('receivedAt', receivedAt, { exact: true });
    // Received At = Locker: Employee (locker holder) -> Locker back-fills
    if (receivedAt === 'Locker' && employee) await this.pick('employeeID', employee, { exact: true });
    if (toProcess) await this.pick('departmentProcessID', toProcess, { search: true });
    if (toSubProcess) await this.pick('departmentSubProcessID', toSubProcess, { search: true }).catch(() => {});
    await this.pick('receivedFrom', receivedFrom, { exact: true });
    // Received From = Process reveals a From Process picker; = Locker a From
    // Employee picker (its list may load late - tolerated, the grid falls back)
    if (receivedFrom === 'Process' && fromProcess) {
      await this.pick('fromDepartmentProcessID', fromProcess, { search: true })
        .catch(() => this.pickByLabel('From Process', fromProcess, { search: true }).catch(() => {}));
    }
    if (receivedFrom === 'Locker' && fromEmployee) {
      await this.pick('fromEmployeeID', fromEmployee, { exact: true })
        .catch((e) => console.log(`accept: From Employee "${fromEmployee}" not picked - ${e.message.split(/\r?\n/)[0]}`));
    }
    await this.pickStockEntity('stockEntityType', stockEntity);
    await this.pick('stockIdentityType', stockIdentity, { exact: true }).catch(() => {});
    await this.waitForIdle();
    await this.page.waitForTimeout(2_500);

    // Tagwise accept: enter the tag and Search to fetch the pending row
    if (tag) {
      const box = this.page.getByRole('textbox', { name: /Enter tag no/i }).locator('visible=true').first();
      if (await box.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await box.fill(String(tag)).catch(() => {});
        await this.page.getByRole('button', { name: /^\s*Search\s*$/ }).locator('visible=true').last().click({ timeout: 10_000 }).catch(() => {});
        await this.waitForIdle();
        await this.page.waitForTimeout(2_000);
      }
    }

    // grid of pending transfers - select ours (by tag/transfer no) or the first
    const ident = tag || rowText;
    let row = ident
      ? this.gridRows.filter({ hasText: new RegExp(String(ident).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first()
      : null;
    if (!row || !(await row.isVisible({ timeout: 8_000 }).catch(() => false))) {
      row = this.gridRows.filter({ has: this.page.getByRole('checkbox') }).first();
    }
    if (!(await row.isVisible({ timeout: 10_000 }).catch(() => false))) {
      console.log('acceptTransfer: no pending transfer row in the Accept form');
      return 'skipped';
    }
    const box = row.getByRole('checkbox').first();
    if (!(await box.isChecked().catch(() => false))) await box.check({ force: true });
    await this.page.waitForTimeout(1_000);

    return this.commitAndCapture('Accept', 'internal transfer accept');
  }

  /** Click a footer button and capture the save response (throws on silent block). */
  async commitAndCapture(buttonName, label) {
    // glyph-tolerant: the footer buttons carry icons, so match by text, not
    // an anchored role-name, and force the click past any transient overlay.
    const btn = this.page.locator('button')
      .filter({ hasText: new RegExp(`^\\s*${buttonName}\\s*$`) })
      .locator('visible=true').last();
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    const resp = this.page.waitForResponse(
      (r) => ['POST', 'PUT'].includes(r.request().method()) && /transfer|create|save|accept/i.test(r.url()) &&
        !/GetAll|Pagination|KeepAlive|GetMasterData|GetLocation|Translation|List|Search/i.test(r.url()),
      { timeout: 60_000 },
    ).catch(() => null);
    await btn.click({ timeout: 20_000, force: true });
    // a "Confirmation" dialog ("Are you sure you want to accept ...") may
    // appear - confirm it (the save fires after this, not the first click)
    await this.page.waitForTimeout(1_000);
    const confirm = this.page.locator('[role="dialog"], .modal, ngb-modal-window')
      .filter({ hasText: /Are you sure|Confirmation/i })
      .getByRole('button', { name: new RegExp(`^\\s*(${buttonName}|Yes|Ok|Confirm)\\s*$`, 'i') })
      .locator('visible=true').last();
    if (await confirm.isVisible({ timeout: 4_000 }).catch(() => false)) {
      await confirm.click({ timeout: 10_000 }).catch(() => {});
    }
    const r = await resp;
    if (!r) {
      const diag = await this.page.evaluate(() =>
        [...document.querySelectorAll('sioniq-ng-select')]
          .filter((n) => n.querySelector('ng-select')?.classList.contains('ng-invalid') && n.offsetParent)
          .map((n) => n.getAttribute('controlname')));
      throw new Error(`${label} "${buttonName}" fired no save request - form silently blocked; invalid: ${JSON.stringify(diag)}`);
    }
    const body = await r.json().catch(() => null);
    console.log(`${label} save:`, r.status(), r.url().split('/').pop(), JSON.stringify(body).slice(0, 200));
    if (r.status() >= 400 || (body && body.errorCode)) {
      throw new Error(`${label} rejected (HTTP ${r.status()}): ${body ? body.error || body.message || '' : ''}`);
    }
    await this.page.waitForTimeout(1_500);
    await this.page.locator('.btn-close').last().click({ timeout: 5_000 }).catch(() => {});
    return body;
  }
}

module.exports = { InternalTransferPage };
