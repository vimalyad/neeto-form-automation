import { test } from "@fixtures";
import FormPage from "@poms/form/form";
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

  test("Verify form insights", async ({ formCreationPage }) => {
    test.setTimeout(60000);

    await test.step("Publish form", () => formCreationPage.publishForm());

    await test.step("Open Analytics tab", () =>
      formCreationPage.openAnalyticsTab());

    await test.step("Verify initial insights to be zero", async () => {
      await formCreationPage.verifyVisitCount(0);
      await formCreationPage.verifyStartCount(0);
      await formCreationPage.verifySubmissionCount(0);
      await formCreationPage.verifyCompletionPercentage(0);
    });

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(formCreationPage.page.context());
      // we are adding this so that page gets enough time to load everything and send the pings to database
      await formPage.page.waitForLoadState("networkidle");
    });

    await test.step("reload form creation page", () => formCreationPage.page.reload());

    await test.step("Verify visit count increased by one", () =>
      formCreationPage.verifyVisitCount(1));

    await test.step("Close the page", () => formPage.page.close());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(formCreationPage.page.context());
      await formPage.page.waitForLoadState("networkidle");
    });

    await test.step("Fill email", () => formPage.fillEmail(mockUser.email));

    await test.step("reload form creation page", async () => {
      await formCreationPage.page.waitForTimeout(2000);
      await formCreationPage.page.reload();
    });

    await test.step("Verify visit count increased by one and start count increased by one", async () => {
      await formCreationPage.verifyVisitCount(2);
      await formCreationPage.verifyStartCount(1);
    });

    await test.step("Close the page", () => formPage.page.close());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage(formCreationPage.page.context());
      await formPage.page.waitForLoadState("networkidle");
    });

    await test.step("Fill email", () => formPage.fillEmail(mockUser.email));

    await test.step("Submit the form", () => formPage.submitForm());

    await test.step("Verify submission", () => formPage.verifyThankYouOnPage());

    await test.step("reload form creation page", async () => {
      await formCreationPage.page.waitForTimeout(2000);
      await formCreationPage.page.reload();
    });

    await test.step("Verify visit count increased by one and start count increased by one and completionPercentage changed", async () => {
      await formCreationPage.verifyVisitCount(3);
      await formCreationPage.verifyStartCount(1);
      await formCreationPage.verifySubmissionCount(1);
      await formCreationPage.verifyCompletionPercentage(100);
    });

    await test.step("Close the page", () => formPage.page.close());
  });
});
