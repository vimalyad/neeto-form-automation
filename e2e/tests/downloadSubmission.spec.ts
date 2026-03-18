import { test } from "@fixtures";
import { faker } from "@faker-js/faker";
import { expect, Page } from "@playwright/test";
import { getPdfTextAndDeletePdf } from "@utils/pdfParser";
import { SUBMISSION_PREVIEW_SELECTORS } from "@selectors/submissionPreview";
import FormCreationPage from "@poms/form/createForm";
import FormPage from "@poms/form/form";
import { getExportPagePromise, getSubmissionsLoaded, getWaitForRecordSaved } from "@utils/waitForResponses";

test.describe("Form Features", () => {
  let formPage: FormPage;
  let email: string;
  let starRating: string;
  let opinionScaleRating: string;
  let downloadPage: Page;
  let starRatingQuestion: string;
  let opinionScaleQuestion: string;
  let matrixRow1: string;
  let matrixRow2: string;
  let matrixCol1: string;
  let matrixCol2: string;
  let matrixText: string;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    // from dashboard go to formCreation page
    await dashboardPage.goToFormCreationPage();

    // now click on create form
    await formCreationPage.createForm();

    email = faker.internet.email();
    opinionScaleRating = faker.number.int({ min: 1, max: 10 }).toString();
    starRating = faker.number.int({ min: 1, max: 5 }).toString();

    starRatingQuestion = faker.lorem.sentence({ min: 3, max: 8 });
    opinionScaleQuestion = faker.lorem.sentence({ min: 3, max: 8 });
    matrixText = faker.lorem.sentence({ min: 3, max: 8 });

    [matrixRow1, matrixRow2] = faker.helpers.uniqueArray(
      () => faker.lorem.word(),
      2,
    );
    [matrixCol1, matrixCol2] = faker.helpers.uniqueArray(
      () => faker.lorem.word(),
      2,
    );
  });

  // clear the created forms
  test.afterEach(async ({ formCreationPage }) => {
    if (await formCreationPage.paneCloseButtonVisibility()) {
      await formCreationPage.closePane();
    }
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.deleteForm());
  });

  test("Download submissions", async ({ page, formCreationPage }) => {
    await test.step("Click add element button", () =>
      formCreationPage.clickAddElementButton());

    await test.step("Add star rating element", () =>
      formCreationPage.addStarRatingElement());

    await test.step("Fill question in Star Rating element", async () => {
      await formCreationPage.openElementContextField();
      await formCreationPage.fillTextInStarElement(starRatingQuestion);
    });

    await test.step("Add opinion scale element", () =>
      formCreationPage.addOpinionScaleElement());

    await test.step("Open opinion scale question's setting window", () =>
      formCreationPage.openQuestionsSettingWindow(3));

    await test.step("Fill question in opinion scale element", async () => {
      await formCreationPage.openElementContextField();
      await formCreationPage.fillTextInOpinionScaleElement(
        opinionScaleQuestion,
      );
    });

    await test.step("Add matrix element", () =>
      formCreationPage.addMatrixElement());

    await test.step("Open matrix's setting window", () =>
      formCreationPage.openQuestionsSettingWindow(4));

    await test.step("Fill text in Matrix element", () =>
      formCreationPage.fillQuestionInMatrix(matrixText));

    await test.step("Fill rows and columns in Matrix element", async () => {

      await formCreationPage.openInputFieldOfRowInMatrix(1);
      let waitForRecords = getWaitForRecordSaved(formCreationPage);
      await formCreationPage.fillInputFieldOfRowContainer(1, matrixRow1);
      await waitForRecords;

      await formCreationPage.openInputFieldOfRowInMatrix(2);
      waitForRecords = getWaitForRecordSaved(formCreationPage);
      await formCreationPage.fillInputFieldOfRowContainer(2, matrixRow2);
      await waitForRecords;

      await formCreationPage.openInputFieldOfColInMatrix(1);
      waitForRecords = getWaitForRecordSaved(formCreationPage);
      await formCreationPage.fillInputFieldOfColContainer(1, matrixCol1);
      await waitForRecords;

      await formCreationPage.openInputFieldOfColInMatrix(2);
      waitForRecords = getWaitForRecordSaved(formCreationPage);
      await formCreationPage.fillInputFieldOfColContainer(2, matrixCol2);
      await waitForRecords;
    });

    await test.step("Publish the form", () => formCreationPage.publishForm());

    await test.step("Open form page", async () => {
      formPage = await new FormCreationPage(page).openFormPage();
    });

    await test.step("Fill email", () => formPage.fillEmail(email));

    await test.step("Fill star rating", () =>
      formPage.fillStarRating(starRating));

    await test.step("Fill opinion scale rating", () =>
      formPage.fillOpinionScale(opinionScaleRating));

    await test.step("Fill matrix", async () => {
      await formPage.checkMatrixLabel(1);
      await formPage.checkMatrixLabel(4);
    });

    await test.step("Submit form", () => formPage.submitForm());

    await test.step("Verify and close page", async () => {
      await formPage.verifyThankYouOnPage();
      await formPage.page.close();
    });

    await test.step("reload form creation page", async () => {
      await formCreationPage.openSubmissionsTab()
      await getSubmissionsLoaded(formCreationPage);
    });

    await test.step("Open submitted response", () =>
      formCreationPage.openSubmittedResponse(1));

    await test.step("Open dropdown and select pdf", async () => {
      await formCreationPage.openDropdownForDownloadType();
      await formCreationPage.checkDownloadAsPdf();
    });

    await test.step("Download and verify PDF", async () => {
      const requestPromise = getExportPagePromise(formCreationPage);

      const popupPromise = formCreationPage.page.waitForEvent("popup");

      await formCreationPage.downloadSubmissions();

      downloadPage = await popupPromise;
      const request = await requestPromise;

      const pdfUrl = request.url();

      const response = await downloadPage.context().request.get(pdfUrl);
      expect(response.ok()).toBeTruthy();

      const pdfText = await getPdfTextAndDeletePdf(await response.body());

      expect(pdfText).toMatch(new RegExp(email, "i"));
      expect(pdfText).toContain(starRating);
      expect(pdfText).toContain(opinionScaleRating);
      expect(pdfText).toContain(`${matrixRow1}: ${matrixCol1}`);
      expect(pdfText).toContain(`${matrixRow2}: ${matrixCol2}`);

      await downloadPage.close();
    });
  });
});