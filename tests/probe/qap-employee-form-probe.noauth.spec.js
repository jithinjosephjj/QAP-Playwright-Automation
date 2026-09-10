const { test, expect } = require('../../fixtures/test-fixtures');
const fs = require('fs');

/**
 * PROBE — qap client Employee add form (/hrm/employee-setup).
 * Dumps every sioniq-ng-select controlname and its option list, picking the
 * values seen on the qap form (Legal Entity "Gold & Diamonds", designation
 * "QA Level Desig S1KL", process "Casting Process XM2N") so the dependent
 * dropdowns (Level, Sub Process) populate and can be dumped too.
 * Output: probe-out.txt. Throwaway - not part of the regression set.
 */

async function login(loginPage, page) {
  await loginPage.open();
  await loginPage.login();
  await loginPage.throwIfGated();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 60_000 });
}

test('PROBE qap employee form dropdowns', async ({ loginPage, employeePage, page }) => {
  test.setTimeout(420_000);
  const out = [];
  const log = (s) => { out.push(s); console.log(s); };

  await login(loginPage, page);
  await employeePage.open();
  await employeePage.openAddWizard();

  const controls = await page
    .locator('sioniq-ng-select[controlname]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('controlname')));
  log(`controlnames: ${JSON.stringify(controls)}`);

  // open a dropdown, dump its options, optionally pick one
  async function dump(name, pickText, opts = {}) {
    try {
      if (pickText) {
        const all = await employeePage.pick(name, pickText, opts);
        log(`${name} (picked "${pickText}"): ${JSON.stringify(all)}`);
      } else {
        await page.keyboard.press('Escape');
        await employeePage.select(name).locator('.ng-select-container').click();
        await page.waitForTimeout(2500);
        const all = (await page.locator('.ng-dropdown-panel .ng-option').allTextContents()).map((s) => s.trim());
        await page.keyboard.press('Escape');
        log(`${name}: ${JSON.stringify(all)}`);
      }
    } catch (e) {
      log(`${name}: ERROR ${e.message.split('\n')[0]}`);
    }
  }

  await dump('gender', 'Male');
  await dump('empIdGeneration');
  await dump('legalEntity', 'Gold & Diamonds', { exact: true });
  await dump('bUnit', 'Cochin', { search: true, closePanel: true });
  await dump('department', 'Production', { exact: true });
  await dump('designation', 'QA Level Desig S1KL');
  await dump('designationlevel');
  await dump('process', 'Casting Process XM2N');
  await dump('subprocess');
  await dump('salesCodeGeneration');
  await dump('employmentType');

  fs.writeFileSync('probe-out.txt', out.join('\n'));
});
