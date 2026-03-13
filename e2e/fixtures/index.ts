import { test as base, Page } from "@playwright/test";
import DashboardPage from "@poms/dashboard";
import FormCreationPage from "@poms/form/createForm";

interface ExtendedFixtures {
    formCreationPage: FormCreationPage;
    dashboardPage: DashboardPage
}

// Add baseURL to the destructured arguments
export const test = base.extend<ExtendedFixtures>({

    formCreationPage: async ({ page }, use) => {
        await use(new FormCreationPage(page))
    },

    page: async ({ page }, use) => {
        await page.goto("/");
        await use(page)
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page))
    }
});