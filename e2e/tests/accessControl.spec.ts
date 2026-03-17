import { getNewPageWithCleanContext } from "@utils/pageCreation";

import { test } from "@fixtures";
import { generatePassword, getMockData } from "@utils/testData";
import FormPage from "@poms/form/form";

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

    await test.step("Verify password field validations", async () => {
      await formCreationPage.setSecurePassword();
      await formCreationPage.saveFormChangesButton();
      await formCreationPage.gotSecurePasswordError();
      await formCreationPage.setSecurePassword("123");
      await formCreationPage.saveFormChangesButton();
      await formCreationPage.gotSecurePasswordError();
      await formCreationPage.setSecurePassword("abc");
      await formCreationPage.saveFormChangesButton();
      await formCreationPage.gotSecurePasswordError();
    });

    await test.step("Enter password and save changes", async () => {
      await formCreationPage.setSecurePassword(password);
      await formCreationPage.saveFormChangesButton();
    });
    await test.step("Verify form is password protected in a clean session", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
      const formUrl = formPage.page.url();

      await formPage.page.close();
      const newPage = await getNewPageWithCleanContext(browser);

      await newPage.goto(formUrl);

      await newPage.waitForLoadState("domcontentloaded");

      const newFormPage = new FormPage(newPage);

      await newFormPage.verifyFormPasswordProtected();
      await newFormPage.fillFormSecurePassword("123");
      await newFormPage.continueToFormPage();
      await newFormPage.verifyPasswordInputError();
      await newFormPage.fillFormSecurePassword(password);
      await newFormPage.continueToFormPage();
      await newFormPage.fillEmail(mockUser.email);
      await newFormPage.submitForm();
      await newFormPage.verifyThankYouOnPage();
    });

    await test.step("Verify form response", async () => {
      await formCreationPage.openSubmissionsTab();
      await formCreationPage.verifyResponse(mockUser.email);
    });
  });
});
