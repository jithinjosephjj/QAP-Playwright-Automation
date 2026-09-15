require('dotenv').config();

// Per-client environments. Master screens (and their page objects) are the
// same across clients; the e2e TRANSACTION workflows differ, so each client
// has its own e2e spec folder (see e2eDir) and the other clients' folders are
// ignored by playwright.config.js.
const CLIENTS = {
  qa: {
    url: 'https://qa.sioniq.com',
    user: 'admin',
    pwd: '123',
    bu: 'Cochin',
    authFile: 'auth/admin-cochin.json',
    e2eDir: 'tests/e2e',
    // Master-data values that differ between clients (screens are identical).
    master: {
      legalEntity: 'Sioniq QA',
      department: 'Production',
      designation: 'Supervisor',
      level: 'L2',
      process: 'Casting Process',
      subprocess: 'Casting Inspection',
      floor: 'Floor 4',
      zip: '500016TS',
    },
  },
  // "Process wise" client - different e2e transaction workflows.
  qap: {
    url: 'https://qap.sioniq.com',
    user: 'Admin',
    pwd: '123',
    bu: 'Kakkanad', // head office - the default login location for qap
    authFile: 'auth/qap-admin-kakkanad.json',
    e2eDir: 'tests/e2e-qap',
    // Probed live 2026-09-09: legalEntity list is ONLY "Gold & Diamonds";
    // designations are QA Designation PENL / QA Level Desig Q92D / S1KL;
    // level list is ONLY L1; processes carry an "XM2N" suffix.
    master: {
      legalEntity: 'Gold & Diamonds',
      department: 'Production',
      designation: 'QA Level Desig S1KL',
      level: 'L1',
      process: 'Casting Process XM2N',
      subprocess: 'Casting Inspection XM2N',
      floor: 'Floor 1',
      zip: '500016TS',
    },
  },
};

const CLIENT = process.env.SIONIQ_CLIENT || 'qa';
const client = CLIENTS[CLIENT];
if (!client) {
  throw new Error(
    `Unknown SIONIQ_CLIENT "${CLIENT}". Valid clients: ${Object.keys(CLIENTS).join(', ')}`
  );
}

// Explicit SIONIQ_* vars in .env still override the client defaults.
module.exports = {
  CLIENT,
  CLIENTS,
  URL: process.env.SIONIQ_URL || client.url,
  USER: process.env.SIONIQ_USER || client.user,
  PWD: process.env.SIONIQ_PWD || client.pwd,
  BU: process.env.SIONIQ_BU || client.bu,
  AUTH_FILE: client.authFile,
  E2E_DIR: client.e2eDir,
  MASTER: client.master,
  // e2e folders belonging to the OTHER clients - fed to testIgnore.
  OTHER_E2E_DIRS: Object.entries(CLIENTS)
    .filter(([name]) => name !== CLIENT)
    .map(([, c]) => c.e2eDir),
};
