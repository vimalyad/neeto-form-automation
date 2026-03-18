import { test } from "@fixtures";
import { faker } from "@faker-js/faker";
import FormPage from "@poms/form/form";
import FormCreationPage from "@poms/form/createForm";
import { getWaitForRecordSaved } from "@utils/waitForResponses";

test.describe("Form Features", () => {
  let formPage: FormPage;
  let starRatingQuestion: string;
  let opinionScaleQuestion: string;
  let matrixRow1: string;
  let matrixRow2: string;
  let matrixCol1: string;
  let matrixCol2: string;
  let matrixText: string;
  let email: string;
  let starRating: string;
  let opinionScaleRating: string;

  let identifierOfEmail: string;
  let identifierOfStarRating: string;
  let identifierOfOpinionScale: string;
  let identifierOfMatrix: string;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    await dashboardPage.goToFormCreationPage();
    await formCreationPage.createForm();

    starRatingQuestion = faker.lorem.sentence({ min: 3, max: 8 });
    opinionScaleQuestion = faker.lorem.sentence({ min: 3, max: 8 });
    matrixText = faker.lorem.sentence({ min: 3, max: 8 });
    email = faker.internet.email();

    [matrixRow1, matrixRow2] = faker.helpers.uniqueArray(
      () => faker.lorem.word(),
      2,
    );
    [matrixCol1, matrixCol2] = faker.helpers.uniqueArray(
      () => faker.lorem.word(),
      2,
    );

    opinionScaleRating = faker.number.int({ min: 1, max: 10 }).toString();
    starRating = faker.number.int({ min: 1, max: 5 }).toString();
  });

  test.afterEach(async ({ formCreationPage }) => {
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.deleteForm());
  });

  test("Pre-fill form using URL parameters", async ({
    formCreationPage,
    page,
    browser,
  }) => {

    await test.step("Add a star rating, opinion scale and matrix fields", async () => {
      await formCreationPage.openEmailSetting();
      await formCreationPage.openAdvanceProperties();
      identifierOfEmail = await formCreationPage.getEmailIdentifier();
    });

    await test.step("Click add element button", () =>
      formCreationPage.clickAddElementButton());

    await test.step("Add star rating element", () =>
      formCreationPage.addStarRatingElement());

    await test.step("Fill question in Star Rating element", async () => {
      await formCreationPage.openElementContextField();
      await formCreationPage.fillTextInStarElement(starRatingQuestion);
    });

    await test.step("Get star element identifier", async () => {
      await formCreationPage.openQuestionsSettingWindow(2);
      await formCreationPage.openAdvanceProperties();
      identifierOfStarRating = await formCreationPage.getStarRatingIdentifier();
    });

    await test.step("Add opinion scale element", () =>
      formCreationPage.addOpinionScaleElement());

    await test.step("Fill question in opinion scale element", async () => {
      await formCreationPage.openElementContextField();
      await formCreationPage.fillTextInOpinionScaleElement(
        opinionScaleQuestion,
      );
    });

    await test.step("Get opinion scale element identifier", async () => {
      await formCreationPage.openQuestionsSettingWindow(3);
      await formCreationPage.openAdvanceProperties();
      identifierOfOpinionScale =
        await formCreationPage.getOpinionScaleIdentifier();
    });

    await test.step("Add matrix element", () =>
      formCreationPage.addMatrixElement());

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

    await test.step("Get matrix element identifier", async () => {
      await formCreationPage.openAdvanceProperties();
      identifierOfMatrix = await formCreationPage.getMatrixIdentifier();
    });

    await test.step("Publish the form", () => formCreationPage.publishForm());

    await test.step("Open form page", async () => {
      formPage = await new FormCreationPage(page).openFormPage();
    });

    let formUrl: string;

    await test.step("get Url and close form page", async () => {
      formUrl = formPage.page.url();
      await formPage.page.close()
    });

    const params = new URLSearchParams();

    params.append(identifierOfEmail, email);
    params.append(identifierOfOpinionScale, opinionScaleRating);
    params.append(identifierOfStarRating, starRating);
    params.append(`${identifierOfMatrix}.${matrixRow1}`, matrixCol2);
    params.append(`${identifierOfMatrix}.${matrixRow2}`, matrixCol1);

    const url = `${formUrl}?${params.toString()}`;

    const newPage = await browser.newPage();
    await newPage.goto(url);

    formPage = new FormPage(newPage);

    await test.step("verify email", () => formPage.checkEmailValueMatch(email));

    await test.step("verify star", () =>
      formPage.checkStarValueMatch(starRating));

    await test.step("verify opinion scale", () =>
      formPage.checkOpinionScaleMatch(opinionScaleRating));

    await test.step("verify matrix values", async () => {
      await formPage.verifyMatrixSelection(matrixRow1, matrixCol2);
      await formPage.verifyMatrixSelection(matrixRow2, matrixCol1);
    });

    await test.step("Close the page", () => formPage.page.close());
  });
});
