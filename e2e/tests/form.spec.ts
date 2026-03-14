import { test } from "@fixtures";
import FormPage from "../poms/form/form";
import {
  generatePassword,
  getInvalidEmailAndPhoneNumber,
  getMockData,
  transformToFormDetails,
  transformToName,
  transformToSubmissionDetails,
} from "@utils/testData";
import { getNewPageWithCleanContext } from "@utils/pageCreation";

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

  test("Create and submit a form", async ({ formCreationPage, page }) => {
    await test.step("Add name and phone number fields", () =>
      formCreationPage.addNameAndPhoneNumberFields());

    await test.step("publish form page", () => formCreationPage.publishForm());

    await test.step("Open created form", async () => {
      // page.context() gives us the BrowserContext
      formPage = await formCreationPage.openFormPage(page.context());
    });

    await test.step("Verify fields", () => formPage.verifyFields());

    await test.step("filling empty fields and error assertion", () =>
      formPage.emptyFormSubmitValidation());

    await test.step("filling invalid email and phoneNumber and error assertion", () =>
      formPage.invalidEmailAndPhoneNumber(
        getInvalidEmailAndPhoneNumber(
          transformToName(mockUser.firstName, mockUser.lastName),
        ),
      ));

    await test.step("Valid credentials and successful submit", () =>
      formPage.validDetailsAndVerify(transformToFormDetails(mockUser)));

    await test.step("Verify Thank you and close form page", () =>
      formPage.verifyThankYouOnPage());

    await test.step("Close form page", () => formPage.page.close());

    await test.step("Verify submitted response", () =>
      formCreationPage.verifySubmission(
        transformToSubmissionDetails(mockUser),
      ));
  });

  test("Customize form's field elements", async ({
    formCreationPage,
    page,
  }) => {
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

  test("Verify form insights", async ({ page, formCreationPage }) => {
    test.setTimeout(60000);

    await test.step("Publish form", () => formCreationPage.publishForm());

    await test.step("Open Analytics tab", () =>
      formCreationPage.openAnalyticsTab());

    await test.step("Verify initial insights to be zero", () =>
      formCreationPage.verifyInitialFormInsightToBeZero());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
      // we are adding this so that page gets enough time to load everything and send the pings to database
      await formPage.page.waitForLoadState("networkidle");
    });

    await test.step("reload form creation page", () => page.reload());

    await test.step("Verify visit count increased by one", () =>
      formCreationPage.verifyVisitCount(1));

    await test.step("Close the page", () => formPage.page.close());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
      await formPage.page.waitForLoadState("networkidle");
    });

    await test.step("Fill email", () => formPage.fillEmail(mockUser.email));

    await test.step("reload form creation page", async () => {
      await page.waitForTimeout(2000);
      await page.reload();
    });

    await test.step("Verify visit count increased by one and start count increased by one", async () => {
      await formCreationPage.verifyVisitCount(2);
      await formCreationPage.verifyStartCount(1);
    });

    await test.step("Close the page", () => formPage.page.close());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(page.context());
      await formPage.page.waitForLoadState("networkidle");
    });

    await test.step("Fill email", () => formPage.fillEmail(mockUser.email));

    await test.step("Submit the form", () => formPage.submitForm());

    await test.step("Verify submission", () => formPage.verifyThankYouOnPage());

    await test.step("reload form creation page", async () => {
      await page.waitForTimeout(2000);
      await page.reload();
    });

    await test.step("Verify visit count increased by one and start count increased by one and completionPercentage changed", async () => {
      await formCreationPage.verifyVisitCount(3);
      await formCreationPage.verifyStartCount(1);
      await formCreationPage.verifySubmissionCount(1);
      await formCreationPage.verifyCompletionPercentage(100);
    });

    await test.step("Close the page", () => formPage.page.close());
  });

  // Medium level practice question

  test.only("Access control the form with password protection", async ({
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
