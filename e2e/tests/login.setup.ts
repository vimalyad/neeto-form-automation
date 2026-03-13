import { test } from "@fixtures";

import { STORAGE_STATE } from "../../playwright.config";
import { expect } from "@playwright/test";

test.describe("Login page", () => {
    test("should login as oliver", async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('button', { name: 'Login as Oliver' }).click();
        await expect(page.getByTestId('main-header')).toHaveText("Active forms");


        await page.context().storageState({ path: STORAGE_STATE });
    })
});