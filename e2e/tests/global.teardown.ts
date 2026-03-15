import { test } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";
import * as fs from "fs";

test("Teardown", () => {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
});
