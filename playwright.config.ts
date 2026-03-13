import { defineConfig, devices } from "@playwright/test";

// file to store the session details
export const STORAGE_STATE = "./auth/user.json";

export default defineConfig({
  testDir: "./e2e",
  // folder containing all tests

  fullyParallel: true,
  // by default playwright runs different test files in parallel but tests inside the same file sequentially
  // setting this it to true so that Playwright run every single test block simultaneously , regardless of what file it is in

  forbidOnly: !!process.env.CI,
  // if false it allows us to use test.only() annotation

  retries: process.env.CI ? 2 : 0,
  // the number of times Playwright will retry test if it fails

  workers: process.env.CI ? 1 : undefined,
  // if undefined , Playwright uses half of CPU cores , but it is recommended to keep it 1 so that server doesn't get overloaded

  reporter: "html",
  // generates clickable HTML report after the test finishes

  use: {
    // traces are heavy files containing screenshots , network logs , DOM snapshots
    // by keeping it on-first-retry , Playwright will only record heavy-data if the test fails the first time and has to run again
    trace: "on-first-retry",
    // baseURL we will be using for our testing
    baseURL: "https://neeto-form-web-playwright.neetodeployapp.com/",
  },

  // mainly used to test different browsers
  projects: [
    // here it is for execution pipeline
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ]
})