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
});
