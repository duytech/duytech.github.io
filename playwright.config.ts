import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  // .e2e.ts keeps these files out of vitest's default *.test / *.spec glob
  testMatch: '*.e2e.ts',
  forbidOnly: !!process.env.CI,
  use: { baseURL: 'http://localhost:4173' },
  projects: [{ name: 'mobile', use: { ...devices['iPhone SE'], defaultBrowserType: 'chromium' } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
