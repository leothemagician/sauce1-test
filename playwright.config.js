// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './', // vendndodhja e testëve, mund ta ndryshosh në ./tests nëse i zhvendos atje
  timeout: 30 * 1000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
   // { name: 'firefox', use: { browserName: 'firefox' } },
   // { name: 'webkit', use: { browserName: 'webkit' } }
  ],
});
