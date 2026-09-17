const { StockInwardBasePage } = require('./StockInwardBasePage');
const env = require('../utils/env');

/**
 * Employee — HRMS > Setup > Employee. Route: /hrm/employee-setup.
 * Single-screen form with Submit at the bottom.
 *
 * Facts (verified live 23-08-2026):
 * - Legal Entity options include "Sioniq QA", "Sioniq QA1", "Sioniq QA2" -
 *   ALWAYS pick exact, or QA1 wins by substring and its BU list has no Cochin.
 * - Business Unit is a server-side typeahead, and it depends on Legal Entity.
 * - Designation / Level / Process / Sub Process are disabled until Department
 *   (then Designation) is picked - fill strictly in order.
 * - Employee ID generation: Auto. Sales Code Generation: Manual + a dynamic
 *   RT<N> code per iteration.
 * - Save endpoint: POST Employee/CreateEmployee -> { code: 1001,
 *   message: "Saved successfully!", data: { employeeID, employeeCode, ... } }.
 */
class EmployeePage extends StockInwardBasePage {
  constructor(page) {
    super(page, 'Employee');
    this.firstName = page.locator('#fName');
    this.lastName = page.locator('#lName');
    this.displayName = page.locator('#dName');
    this.dob = page.locator('#dob');
    this.doj = page.locator('#doj');
    this.submitApiPattern = /CreateEmployee/i;
  }

  async open() {
    await this.goto('/hrm/employee-setup');
    await this.addBtn.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async openAddWizard() {
    await this.addBtn.click();
    await this.firstName.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async fillDate(locator, value) {
    await locator.fill(value);
    await locator.blur();
    await this.page.keyboard.press('Escape'); // close the date-picker popup
  }

  /** Fill the whole employee form in dependency order. */
  async fillEmployee(u) {
    await this.firstName.fill(u.firstName);
    await this.lastName.fill(u.lastName);
    await this.displayName.fill(u.displayName);
    await this.pick('gender', 'Male');
    await this.fillDate(this.dob, '01/06/1996');

    // Client-specific master data (legal entity, designation, level, process
    // names differ per SIONIQ_CLIENT) comes from utils/env.js.
    const m = env.MASTER;
    await this.pick('empIdGeneration', 'Auto');
    await this.pick('legalEntity', m.legalEntity, { exact: true });
    await this.pick('bUnit', env.BU, { search: true, closePanel: true });
    await this.pick('department', m.department, { exact: true });
    await this.pick('designation', m.designation);
    await this.pick('designationlevel', m.level);
    await this.pick('process', m.process);
    await this.pick('subprocess', m.subprocess);

    await this.pick('salesCodeGeneration', 'Manual');
    const salesCode = this.page
      .locator('div.grid, div.form-group')
      .filter({ has: this.page.locator('label', { hasText: 'Sales Code' }) })
      .last()
      .locator('input:not([type=checkbox]):not([disabled])')
      .first();
    await salesCode.fill(u.salesCode);

    await this.pick('employmentType', 'Permanent');
    await this.fillDate(this.doj, '01/06/2026');
  }

  /**
   * Employee document block (qap 16-09-2026: "Document Type" + "Upload File"
   * + "Add Document"). Best-effort: picks the first document type, sets the
   * hidden file input directly (no native picker), clicks Add Document.
   * Returns false when the form has no upload control.
   */
  async addDocumentIfOffered(filePath) {
    const files = this.page.locator('input[type="file"]');
    if (!(await files.count())) {
      console.log('Employee: no document upload on this form - nothing attached');
      return false;
    }
    const docType = this.page
      .locator('xpath=//*[contains(normalize-space(text()),"Document Type")]/following::ng-select[1]')
      .locator('visible=true').first();
    if (await docType.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await docType.locator('.ng-select-container').click();
      const opt = this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasNotText: /No items found/i }).first();
      if (await opt.isVisible({ timeout: 5_000 }).catch(() => false)) await opt.click();
      else await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }
    await files.last().setInputFiles(filePath);
    await this.page.waitForTimeout(1_000);
    const add = this.page.getByRole('button', { name: /Add Document/i }).locator('visible=true').first();
    if (await add.isVisible({ timeout: 3_000 }).catch(() => false)) await add.click();
    await this.page.waitForTimeout(1_200);
    console.log('Employee: demo document attached (Add Document)');
    return true;
  }
}

module.exports = { EmployeePage };
