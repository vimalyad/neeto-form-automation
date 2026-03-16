import { test } from "@fixtures";
import FormPage from "../poms/form/form";
import { getMockData } from "@utils/testData";

test.describe("Form Features", () => {
  let mockUser: ReturnType<typeof getMockData> = getMockData();
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
});
