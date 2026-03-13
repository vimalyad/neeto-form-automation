import { test } from "@fixtures";

test.describe("Create and submit a form", () => {
    test("Add a new form", async ({ formPage }) => {
        await formPage.createForm();
    })
})