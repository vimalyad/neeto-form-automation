import { test } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";
import * as fs from "fs";

test("Teardown", () => {
  fs.unlink(STORAGE_STATE, (err) => {
    if (err) {
      console.log("File deletion failed: ", err);
      return;
    }
  });
});
