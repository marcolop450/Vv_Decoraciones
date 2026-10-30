import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:3000',
    channel: 'chrome',
    headless: true,
  },
  webServer: {
    command: 'npm run preview -- --port 3000',
    port: 3000,
    reuseExistingServer: true,
  },
})
