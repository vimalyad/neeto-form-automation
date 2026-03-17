import { test as base, Page } from "@playwright/test";
import DashboardPage from "@poms/dashboard";
import FormCreationPage from "@poms/form/createForm";

interface ExtendedFixtures {
  dashboardPage: DashboardPage;
  formCreationPage: FormCreationPage;
}

export const test = base.extend<ExtendedFixtures>({
  page: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  formCreationPage: async ({ page }, use) => {
    await use(new FormCreationPage(page));
  },
});
