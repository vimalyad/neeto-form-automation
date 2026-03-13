import { test } from "@fixtures";

import { STORAGE_STATE } from "../../playwright.config";
import { expect } from "@playwright/test";
import { LOGIN_TEXTS } from "@texts/login";
import { DASHBOARD_SELECTORS } from "@selectors";

test.describe("Login page", () => {
    test("should login as oliver", async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('button', { name: LOGIN_TEXTS.loginOption }).click();
        await expect(page.getByTestId(DASHBOARD_SELECTORS.header)).toHaveText(LOGIN_TEXTS.headerText);

        await page.context().storageState({ path: STORAGE_STATE });
    })
});