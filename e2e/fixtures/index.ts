import { test as base, Page } from "@playwright/test";

interface ExtendedFixtures {
    page: Page
}

export const test = base.extend<ExtendedFixtures>({
    page: async ({ page }, use) => {
        await test.step("Visiting Neeto form website ", () => page.goto("/"))
        await use(page);
    },
})