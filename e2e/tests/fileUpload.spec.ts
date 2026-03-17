import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("File Upload - practice.expandtesting.com", () => {
  let filePath: string;
  test.afterEach("Delete file", async () => {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
  test("should upload a file using file chooser", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("https://practice.expandtesting.com/upload");
    filePath = path.resolve(__dirname, "test-upload.txt");
    fs.writeFileSync(filePath, "This is a test file for upload.");

    await page.setInputFiles('input[type="file"]', filePath);

    await page.getByRole("button", { name: "Upload" }).click();
  });
});
