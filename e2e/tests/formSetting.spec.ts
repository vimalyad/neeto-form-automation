import { getNewPageWithCleanContext } from "@utils/pageCreation";

import { test } from "@fixtures";
import FormPage from "../poms/form/form";
import { generatePassword, getMockData } from "@utils/testData";

test.describe("Form Features", () => {
  let mockUser: ReturnType<typeof getMockData> = getMockData();
  let password: ReturnType<typeof generatePassword> = generatePassword();
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

  test("Access control the form with password protection", async ({
    formCreationPage,
    page,
    browser,
  }) => {
    test.setTimeout(60000);
    await test.step("Publish form", () => formCreationPage.publishForm());

    await test.step("Open settings tab", () =>
      formCreationPage.openSettingsTab());

    await test.step("Open Access control card", () =>
      formCreationPage.openAccessControlCard());

    await test.step("Select 'Secure with password' option", () =>
      formCreationPage.setSecurePasswordToForm());

    await test.step("Verify password field validations", () =>
      formCreationPage.verifySecurePasswordField());

    await test.step("Enter password and save changes", () =>
      formCreationPage.setSecurePasswordAndSave(password));

    await test.step("Verify form is password protected in a clean session", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
      const formUrl = formPage.page.url();

      await formPage.page.close();
      const newPage = await getNewPageWithCleanContext(browser);

      await newPage.goto(formUrl);

      await newPage.waitForLoadState("domcontentloaded");

      const newFormPage = new FormPage(newPage);

      await newFormPage.verifyFormIsPasswordProtectedAndFillForm({
        email: mockUser.email,
        password: password,
      });
    });

    await test.step("Verify form response", async () => {
      await formCreationPage.openSubmissionsTab();
      await formCreationPage.verifyResponse(mockUser.email);
    });
  });

  test("Unique submisions", async ({ formCreationPage, page }) => {
    test.setTimeout(60000);
    await test.step("Publish form", () => formCreationPage.publishForm());

    await test.step("Open settings tab", () =>
      formCreationPage.openSettingsTab());

    await test.step("Unqiue submission Card", () =>
      formCreationPage.openUniqueSubmissionCard());

    await test.step("Check unique cookies", () =>
      formCreationPage.allowUniqueSubmission());

    await test.step("Open form button", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Fill form with email and submit and verify submission", () =>
      formPage.fillFormWithEmailAndVerify(mockUser.email));

    await test.step("Close the form", () => formPage.page.close());

    await test.step("Close form and open new one", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Verify duplicate submission not allowed", () =>
      formPage.verifyDuplicateSubmissionNotAllowed());

    await test.step("Close the form", () => formPage.page.close());

    await test.step("Allow duplicate submission", () =>
      formCreationPage.allowDuplicateSubmission());

    await test.step("open new one form", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Fill form with email and submit", () =>
      formPage.fillFormWithEmailAndVerify(mockUser.email));

    await test.step("Close the form", () => formPage.page.close());
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
