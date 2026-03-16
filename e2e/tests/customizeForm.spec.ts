import { test } from "@fixtures";
import FormPage from "../poms/form/form";

test.describe("Form Features", () => {
  let formPage: FormPage;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    // from dashboard go to formCreation page
    await dashboardPage.goToFormCreationPage();

    // now click on create form
    await formCreationPage.createForm();
  });

  test("Customize form's field elements", async ({
    formCreationPage,
    page,
  }) => {
    test.setTimeout(60000);
    await test.step("Add single choice element with 6 additional options", () =>
      formCreationPage.addSingleChoiceQuestionWithSixExtraOptions());

    await test.step("Randomize the options of single element", () =>
      formCreationPage.randomizeSingleChoiceQuestionOptions());

    await test.step("Add multi choice element with 6 additional options", () =>
      formCreationPage.addMultiChoiceQuestionWithSixExtraOptions());

    await test.step("Hide the multi choice question", () =>
      formCreationPage.toggleMultiChoiceQuestionVisibility(false));

    await test.step("Publish the form", async () => {
      await formCreationPage.publishForm();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Open published version of form", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
      await page.waitForLoadState("networkidle");
    });

    await test.step("Ensure options of single choice element are randomized", () =>
      formPage.verifySingleChoiceOptionsRandomized());

    await test.step("Verify multi choice element is hidden", () =>
      formPage.verifyMultiChoiceQuestionHidden());

    await test.step("Close opened form page", () => formPage.page.close());

    await test.step("Uncheck the hide option of multi choice element", () =>
      formCreationPage.toggleMultiChoiceQuestionVisibility(true));

    await test.step("Publish the form", async () => {
      await formCreationPage.publishForm();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Open published version of form", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Ensure the field is now visible on the published form.", () =>
      formPage.verifyMultiChoiceQuestionVisible());

    await test.step("Close opened form page", () => formPage.page.close());
  });
});
