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

  // clear the created forms
  test.afterEach(async ({ formCreationPage }) => {
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.deleteForm());
  });

  test("Conditional logic", async ({ formCreationPage, page }) => {
    test.setTimeout(60000);

    await test.step("Delete Email Element", () =>
      formCreationPage.deleteEmailElement());

    await test.step("Add single choice with element only two options", () =>
      formCreationPage.addSingleChoiceElementWithOnlyTwoOptions());

    await test.step("Add Email Element", () =>
      formCreationPage.addEmailElement());

    await test.step("Open settings tab", () =>
      formCreationPage.openSettingsTab());

    await test.step("Open conditional logic card", () =>
      formCreationPage.openConditionalLogicCard());

    await test.step("Add email dependency over option 1 of single choice", async () => {
      await formCreationPage.addConditionalLogicOfEmailDependencyOnOptionOne();
    });

    await test.step("Publish form", () => formCreationPage.publishForm());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Check email dependency of Email on Option 1 of single choice", () =>
      formPage.verifyEmailDependencyOnOptionOneOfSingleChoice());

    await test.step("Close form page", () => formPage.page.close());

    await test.step("Remove email dependency", () =>
      formCreationPage.removeEmailDependency());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Check email has no dependency", () =>
      formPage.verifyEmailHasNoDependency());

    await test.step("Close form page", () => formPage.page.close());
  });
});
