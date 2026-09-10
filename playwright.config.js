// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');
const env = require('./utils/env');

// e2e transaction workflows are client-specific (masters are shared), so the
// e2e folders of every client other than SIONIQ_CLIENT are excluded here.
const otherClientE2e = env.OTHER_E2E_DIRS.map(
  // Match both separators: Playwright compares against absolute paths.
  (dir) => new RegExp(dir.replace('tests/', '') + String.raw`[\\/]`)
);

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: otherClientE2e,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // Serial by default: Sioniq shares voucher/reference series across the BU,
  // so parallel workers collide on document numbering.
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  use: {
    baseURL: env.URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // Full-screen (maximized) window: viewport null lets the page use the
    // real window size, and --start-maximized maximizes it. Both are needed;
    // a fixed viewport would clamp the page regardless of the window.
    viewport: null,
    ignoreHTTPSErrors: true,
    launchOptions: {
      // --start-maximized: run the browser maximized (full screen).
      // --disable-features=LocalNetworkAccessChecks: Chrome's Local Network
      // Access permission prompt ("wants to access other apps and services on
      // this device") otherwise blocks the app's Device Radar check on
      // http://127.0.0.1:5151 - nobody can click Allow in a fresh automation
      // profile, so login never proceeds.
      args: ['--start-maximized', '--disable-features=LocalNetworkAccessChecks'],
    },
  },

  projects: [
    // Specs that must NOT start from a saved session: the login screen itself,
    // credential-validation cases, permission checks. No dependency on setup,
    // so these still run when authentication is broken.
    {
      name: 'no-auth',
      testMatch: /.*\.noauth\.spec\.js/,
      // viewport: null overrides the fixed viewport that devices['Desktop
      // Chrome'] sets, so --start-maximized takes effect. deviceScaleFactor
      // must be cleared too - it cannot coexist with a null viewport.
      use: { ...devices['Desktop Chrome'], viewport: null, deviceScaleFactor: undefined, storageState: { cookies: [], origins: [] } },
    },

    // Logs in once and writes the client's auth state file (env.AUTH_FILE)
    { name: 'setup', testMatch: /global\.setup\.js/ },

    {
      name: 'chromium',
      testIgnore: /.*\.noauth\.spec\.js/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: null, // maximized window (overrides the device's fixed viewport)
        deviceScaleFactor: undefined, // cannot coexist with a null viewport
        storageState: env.AUTH_FILE,
      },
    },

    // Enable when cross-browser coverage is needed:
    // { name: 'firefox', dependencies: ['setup'],
    //   use: { ...devices['Desktop Firefox'], storageState: 'auth/admin-cochin.json' } },
  ],

  // JSON output is what maps spec titles (TC IDs) into the 5-sheet Excel workbook.
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
  ],
});
