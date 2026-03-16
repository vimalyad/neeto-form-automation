import { test } from "@fixtures";
import FormPage from "../poms/form/form";
import { faker } from "@faker-js/faker";
import FormCreationPage from "@poms/form/createForm";

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
    test.setTimeout(60000);
    await test.step("Add a star rating, opinion scale and matrix fields", async () => {
      identifierOfEmail = await formCreationPage.getEmailIdentifier();
    });

    await test.step("Click add element button", () =>
      formCreationPage.clickAddElementButton());

    await test.step("Add star rating element", () =>
      formCreationPage.addStarRatingElement());

    await test.step("Fill question in Star Rating element", () =>
      formCreationPage.fillQuestionInStarElement(starRatingQuestion));

    await test.step("Get star element identifier", async () => {
      identifierOfStarRating = await formCreationPage.getStarRatingIdentifier();
    });

    await test.step("Add opinion scale element", () =>
      formCreationPage.addOpinionScaleElement());

    await test.step("Fill question in opinion scale element", () =>
      formCreationPage.fillQuestionInOpinionScale(opinionScaleQuestion));

    await test.step("Get opinion scale element identifier", async () => {
      identifierOfOpinionScale =
        await formCreationPage.getOpinionScaleIdentifier();
    });

    await test.step("Add matrix element", () =>
      formCreationPage.addMatrixElement());

    await test.step("Fill text in Matrix element", () =>
      formCreationPage.fillQuestionInMatrix(matrixText));

    await test.step("Fill rows and columns in Matrix element", () =>
      formCreationPage.fillValuesInRowAndColumnInMatrix({
        rows: [matrixRow1, matrixRow2],
        cols: [matrixCol1, matrixCol2],
      }));

    await test.step("Get matrix element identifier", async () => {
      identifierOfMatrix = await formCreationPage.getMatrixIdentifier();
    });

    await test.step("Publish the form", () => formCreationPage.publishForm());

    await test.step("Open form page", async () => {
      formPage = await new FormCreationPage(page).openFormPage(page.context());
    });

    const formUrl = formPage.page.url();

    await test.step("close published form", () => formPage.page.close());

    const params = new URLSearchParams();

    params.append(identifierOfEmail, email);
    params.append(identifierOfOpinionScale, opinionScaleRating);
    params.append(identifierOfStarRating, starRating);
    params.append(`${identifierOfMatrix}.${matrixRow1}`, matrixCol2);
    params.append(`${identifierOfMatrix}.${matrixRow2}`, matrixCol1);

    const url = `${formUrl}?${params.toString()}`;

    const newPage = await browser.newPage();
    await newPage.goto(url);

    await newPage.waitForLoadState("networkidle");

    formPage = new FormPage(newPage);

    await test.step("verify email", () => formPage.checkEmailValueMatch(email));

    await test.step("verify star", () =>
      formPage.checkStarValueMatch(starRating));

    await test.step("verify opinion scale", () =>
      formPage.checkOpinionScaleMatch(opinionScaleRating));

    await test.step("verify matrix values", () =>
      formPage.checkMatrixValuesMatch({
        rows: [matrixRow1, matrixRow2],
        cols: [matrixCol2, matrixCol1],
      }));
  });
});
