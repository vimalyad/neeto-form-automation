import { test } from "@fixtures";
import { expect } from "@playwright/test";
import FormPage from "@poms/form/form";
import { FORM_SELECTORS } from "@selectors";
import { FORM_ERRORS_TEXT } from "@texts/form";

test.describe("Form Features", () => {
  let formPage: FormPage;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    // from dashboard go to formCreation page
    await dashboardPage.goToFormCreationPage();

    // now click on create form
    await formCreationPage.createForm();
  });

  // clear the created forms
  test.afterEach(async ({ formCreationPage }) => {
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.deleteForm());
  });

  test("Customize form's field elements", async ({
    formCreationPage,
  }) => {
    await test.step("Add single choice element with 6 additional options", async () => {
      await formCreationPage.clickAddElementButton();
      await formCreationPage.addSingleChoiceElement();
      await formCreationPage.verifyAddOptionButtonVisible();
      for (let i = 0; i < 6; i++) {
        await formCreationPage.addOption();
      }
    });

    await test.step("Randomize the options of single element", () =>
      formCreationPage.randomizeSingleChoiceQuestionOptions());

    await test.step("Add multi choice element with 6 additional options", async () => {
      await formCreationPage.addMultiChoiceElement();
      await formCreationPage.openQuestionsSettingWindow(3);
      await formCreationPage.verifyAddOptionButtonVisible();
      for (let i = 0; i < 6; i++) {
        await formCreationPage.addOption();
      }
    });

    await test.step("Hide the multi choice question", () =>
      formCreationPage.toggleMultiChoiceQuestionVisibility(false));

    await test.step("Publish the form", async () => {
      // add pointer to wait for response of publishing form
      const publishComplete = formCreationPage.page.waitForResponse(
        (res) =>
          res.url().includes("/api/v1/forms/publish/") &&
          res.request().method() === "PUT" &&
          res.status() === 200
      );
      await formCreationPage.publishForm();
      await publishComplete;
    });

    await test.step("Open published version of form", async () => {
      // page.waitForEvent() listens only for that page
      // but page.context().waitForEvent() listens for complete browser context of that instance
      const attemptTracked = formCreationPage.page.context().waitForEvent(
        "response",
        (res) =>
          res.url().includes("/api/v1/forms/attempts/") &&
          res.request().method() === "PATCH"
      );
      formPage = await formCreationPage.openFormPage();
      await attemptTracked;
    });

    await test.step("Ensure options of single choice element are randomized", async () => {
      const optionsContainer = formPage.page.getByTestId(
        FORM_SELECTORS.singleChoiceOptionContainer,
      );
      // get the container storing all options of single-choice-question

      // playwright will wait upto 15 sec while it will be scanning dom every millisecond 
      // and as soon as it finds it , it will move to next
      await expect(optionsContainer).toBeVisible({ timeout: 15000 });

      // get all option's textContent
      const options = await optionsContainer.locator("label").allTextContents();
      let randomized = false;
      for (let i = 0; i < options.length; i++) {
        // if it is randomized then it will not follow i + 1 structure
        if (options[i] !== `Option ${i + 1}`) {
          randomized = true;
          break;
        }
      }
      expect(randomized, FORM_ERRORS_TEXT.optionsNotRandomized).toBe(true);
    });

    await test.step("Verify multi choice element is hidden", () =>
      formPage.verifyMultiChoiceQuestionHidden());

    await test.step("Close opened form page", () => formPage.page.close());

    await test.step("Uncheck the hide option of multi choice element", () =>
      formCreationPage.toggleMultiChoiceQuestionVisibility(true));

    await test.step("Publish the form", async () => {
      const publishComplete = formCreationPage.page.waitForResponse(
        (res) =>
          res.url().includes("/api/v1/forms/publish/") &&
          res.request().method() === "PUT" &&
          res.status() === 200
      );
      await formCreationPage.publishForm();
      await publishComplete;
    });

    await test.step("Open published version of form", async () => {
      const attemptTracked = formCreationPage.page.context().waitForEvent(
        "response",
        (res) =>
          res.url().includes("/api/v1/forms/attempts/") &&
          res.request().method() === "PATCH"
      );
      formPage = await formCreationPage.openFormPage();
      await attemptTracked;
    });

    await test.step("Ensure the field is now visible on the published form.", () =>
      formPage.verifyMultiChoiceQuestionVisible());

    await test.step("Close opened form page", () => formPage.page.close());
  });
});