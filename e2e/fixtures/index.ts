import { test as base, Page } from "@playwright/test";
import FormPage from "@poms/form";

interface ExtendedFixtures {
    formPage: FormPage
}

// Add baseURL to the destructured arguments
export const test = base.extend<ExtendedFixtures>({
    formPage: async ({ page }, use) => {
        await use(new FormPage(page))
    },

    page: async ({ page }, use) => {
        await page.goto("/");
        await use(page)
    }
});