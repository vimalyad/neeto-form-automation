import { test } from "@fixtures";
import FormPage from "@poms/form/form";
import { getMockData } from "@utils/testData";
import { openFormPageWithAttempts, reloadAndWaitForInsights } from "@utils/waitForResponses";

test.describe("Form Features", () => {
  let mockUser: ReturnType<typeof getMockData> = getMockData();
  let formPage: FormPage;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    // from dashboard go to formCreation page
    await dashboardPage.goToFormCreationPage();

    // now click on create form
    await formCreationPage.buildTab.createForm();
  });

  // clear the created forms
  test.afterEach(async ({ formCreationPage }) => {
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.buildTab.deleteForm());
  });

  test("Verify form insights", async ({ formCreationPage }) => {

    await test.step("Publish form", () => formCreationPage.buildTab.publishForm());

    await test.step("Open Analytics tab", () =>
      formCreationPage.openAnalyticsTab());

    await test.step("Verify initial insights to be zero", async () => {
      await formCreationPage.analyticsTab.verifyVisitCount(0);
      await formCreationPage.analyticsTab.verifyStartCount(0);
      await formCreationPage.analyticsTab.verifySubmissionCount(0);
      await formCreationPage.analyticsTab.verifyCompletionPercentage(0);
    });

    await test.step("Open form page", async () => {
      formPage = await openFormPageWithAttempts(formCreationPage);
    });

    await test.step("reload form creation page", () => reloadAndWaitForInsights(formCreationPage));

    await test.step("Verify visit count increased by one", () =>
      formCreationPage.analyticsTab.verifyVisitCount(1));

    await test.step("Close the page", () => formPage.page.close());

    await test.step("Open form page", async () => {
      formPage = await openFormPageWithAttempts(formCreationPage);
    });

    await test.step("Fill email", () => formPage.fillEmail(mockUser.email));

    await test.step("reload form creation page", () => reloadAndWaitForInsights(formCreationPage));

    await test.step("Verify visit count increased by one and start count increased by one", async () => {
      await formCreationPage.analyticsTab.verifyVisitCount(2);
      await formCreationPage.analyticsTab.verifyStartCount(1);
    });

    await test.step("Close the page", () => formPage.page.close());

    await test.step("Open form page", async () => {
      formPage = await openFormPageWithAttempts(formCreationPage);
    });

    await test.step("Fill email", () => formPage.fillEmail(mockUser.email));

    await test.step("Submit the form", () => formPage.submitForm());

    await test.step("Verify submission", () => formPage.verifyThankYouOnPage());

    await test.step("reload form creation page", () => reloadAndWaitForInsights(formCreationPage));

    await test.step("Verify visit count increased by one and start count increased by one and completionPercentage changed", async () => {
      await formCreationPage.analyticsTab.verifyVisitCount(3);
      await formCreationPage.analyticsTab.verifyStartCount(1);
      await formCreationPage.analyticsTab.verifySubmissionCount(1);
      await formCreationPage.analyticsTab.verifyCompletionPercentage(100);
    });

    await test.step("Close the page", () => formPage.page.close());
  });
});