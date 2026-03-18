import { getNewPageWithCleanContext } from "@utils/pageCreation";

import { test } from "@fixtures";
import { generatePassword, getMockData } from "@utils/testData";
import FormPage from "@poms/form/form";
import { getSubmissionsLoaded } from "@utils/waitForResponses";

test.describe("Form Features", () => {
  let mockUser: ReturnType<typeof getMockData>;
  let password: ReturnType<typeof generatePassword>;
  let formPage: FormPage;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    // from dashboard go to formCreation page
    await dashboardPage.goToFormCreationPage();

    // now click on create form
    await formCreationPage.createForm();

    // get the mock data
    mockUser = getMockData();
    // get password using faker
    password = generatePassword();
  });

  // clear the created forms
  test.afterEach(async ({ formCreationPage }) => {
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.deleteForm());
  });

  test("Access control the form with password protection", async ({
    formCreationPage,
    browser,
  }) => {
    // publish the form 
    await test.step("Publish form", () => formCreationPage.publishForm());

    // open settings tab
    await test.step("Open settings tab", () =>
      formCreationPage.openSettingsTab());

    // open the access control card
    await test.step("Open Access control card", () =>
      formCreationPage.openAccessControlCard());

    // select securing with password
    await test.step("Select 'Secure with password' option", () =>
      formCreationPage.setSecurePasswordToForm());

    await test.step("Verify password field validations", async () => {
      // try with no password
      await formCreationPage.setSecurePassword();  // save password
      await formCreationPage.saveFormChangesButton();
      // should get error
      await formCreationPage.gotSecurePasswordError();

      // try with password only numbers
      await formCreationPage.setSecurePassword("123");
      await formCreationPage.saveFormChangesButton();
      await formCreationPage.gotSecurePasswordError(); // should get error

      // try with password less than 3 length
      await formCreationPage.setSecurePassword("abc");
      await formCreationPage.saveFormChangesButton(); // should get error
      await formCreationPage.gotSecurePasswordError();
    });

    await test.step("Enter password and save changes", async () => {
      await formCreationPage.setSecurePassword(password); // set valid secure password and save
      await formCreationPage.saveFormChangesButton();
    });
    await test.step("Verify form is password protected in a clean session", async () => {
      // get the formPage
      formPage = await formCreationPage.openFormPage();

      // extract the url from formPage
      const formUrl = formPage.page.url();

      // close the opened formPage
      await formPage.page.close();

      // open the form in new window
      const newPage = await getNewPageWithCleanContext(browser);

      // visit formPage url
      await newPage.goto(formUrl);

      // to know about domcontentloaded read README
      await newPage.waitForLoadState("domcontentloaded");

      const newFormPage = new FormPage(newPage);

      await newFormPage.verifyFormPasswordProtected();
      // verify with wrong password
      await newFormPage.fillFormSecurePassword("123");
      await newFormPage.continueToFormPage();
      await newFormPage.verifyPasswordInputError(); // should get error

      // verify with correct password
      await newFormPage.fillFormSecurePassword(password);
      await newFormPage.continueToFormPage();
      await newFormPage.fillEmail(mockUser.email);
      await newFormPage.submitForm();
      await newFormPage.verifyThankYouOnPage();

      // close the form page
      await newFormPage.page.close();
    });

    await test.step("Verify form response", async () => {
      // open submissions tab
      await formCreationPage.openSubmissionsTab();
      // now instead of waiting for complete page to settle we want only the endpoint useful for us to bring back the response
      const submissionsLoaded = getSubmissionsLoaded(formCreationPage);
      await submissionsLoaded;
      // verify response
      await formCreationPage.verifyResponse(mockUser.email);
    });
  });
});
