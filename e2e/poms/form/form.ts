import { expect, Page } from "@playwright/test";
import {
  FORM_ACCESS_CARD_SELECTORS,
  FORM_SELECTORS,
} from "@selectors";
import {
  FORM_COUNTRY_DETAILS,
  FORM_ERRORS_TEXT,
  FORM_SUBMISSION_TEXT,
} from "@texts/form";

export interface Name {
  firstName: string;
  lastName: string;
}

export default class FormPage {
  constructor(public page: Page) {}

  verifyFullNameFieldExist = async () => {
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.fullNameGroup)
        .getByTestId(FORM_SELECTORS.formGroupQuestion),
    ).toBeVisible();
  };

  verifyPhoneNumberFieldExist = async () => {
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.phoneNumberGroup)
        .getByTestId(FORM_SELECTORS.formGroupQuestion),
    ).toBeVisible();
  };

  verifyEmailFieldExist = async () => {
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.emailGroup)
        .getByTestId(FORM_SELECTORS.formGroupQuestion),
    ).toBeVisible({ timeout: 10000 });
  };

  fillName = async ({ firstName, lastName }: Name) => {
    await this.page.getByTestId(FORM_SELECTORS.firstNameField).fill(firstName);
    await this.page.getByTestId(FORM_SELECTORS.lastNameField).fill(lastName);
  };

  fillPhoneNumber = async (phoneNumber: string) => {
    await this.changeCountryIfNotAlready();
    await this.page
      .getByTestId(FORM_SELECTORS.phoneNumberField)
      .fill(phoneNumber);
  };

  fillEmail = async (email: string) => {
    await this.page.getByTestId(FORM_SELECTORS.emailField).fill(email);
  };

  changeCountryIfNotAlready = async () => {
    const prefix = await this.page
      .getByTestId(FORM_SELECTORS.phoneNumberPrefix)
      .textContent();
    if (prefix?.trim() === FORM_COUNTRY_DETAILS.unitedStatesPhoneNumberPrefix)
      return;
    await this.page.locator(FORM_SELECTORS.selectCSS).click();
    await this.page
      .getByTestId(FORM_SELECTORS.countryCodeSearchInput)
      .fill(FORM_COUNTRY_DETAILS.unitedStates);
    await this.page
      .getByText(FORM_COUNTRY_DETAILS.unitedStates, { exact: false })
      .click();
  };

  submitForm = async () => {
    await this.page.getByTestId(FORM_SELECTORS.submitButton).click();
  };

  gotEmailError = async ({ emailPresent }: { emailPresent: boolean }) => {
    await expect(
      this.page.getByText(
        emailPresent
          ? FORM_ERRORS_TEXT.invalidEmail
          : FORM_ERRORS_TEXT.requiredEmail,
      ),
    ).toBeVisible();
  };

  gotNameError = async () => {
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.invalidFirstName),
    ).toBeVisible();
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.invalidLastName),
    ).toBeVisible();
  };

  gotPhoneNumberError = async () => {
    const invalidError = this.page.getByText(
      FORM_ERRORS_TEXT.invalidPhoneNumber,
    );
    const startWithOneError = this.page.getByText(
      FORM_ERRORS_TEXT.usNumberError,
    );
    await expect(invalidError.or(startWithOneError)).toBeVisible();
  };

  // no error asserts

  noEmailError = async () => {
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.invalidEmail),
    ).toBeHidden();
  };

  noNameError = async () => {
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.invalidFirstName),
    ).toBeHidden();
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.invalidLastName),
    ).toBeHidden();
  };

  noPhoneNumberError = async () => {
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.invalidPhoneNumber),
    ).toBeHidden();
    await expect(
      this.page.getByText(FORM_ERRORS_TEXT.usNumberError),
    ).toBeHidden();
  };

  verifyThankYouOnPage = async () => {
    // verify thank you text on page
    await expect(
      this.page.getByRole("heading", {
        name: FORM_SUBMISSION_TEXT.thankYouText,
      }),
    ).toBeVisible({ timeout: 15000 });
  };

  verifyFormPasswordProtected = async () => {
    await expect(
      this.page.getByTestId(
        FORM_ACCESS_CARD_SELECTORS.passwordProtectedHeading,
      ),
    ).toBeVisible();
  };

  fillFormSecurePassword = async (password = "") => {
    await this.page
      .getByTestId(FORM_ACCESS_CARD_SELECTORS.passwordTextField)
      .fill(password);
  };

  continueToFormPage = async () => {
    await this.page
      .getByTestId(FORM_ACCESS_CARD_SELECTORS.continueButton)
      .click();
  };

  verifyPasswordInputError = async () => {
    await expect(
      this.page.getByTestId(FORM_ACCESS_CARD_SELECTORS.passwordInputError),
    ).toBeVisible();
  };

  verifyMultipleChoiceQuestionVisible = async () => {
    // question to be visible
    await expect(
      this.page.getByTestId(FORM_SELECTORS.multipleChoiceGroup),
    ).toBeVisible({
      timeout: 15000,
    });
  };

  verifyEmailNotInPage = async () => {
    // email should not be part of DOM
    await expect(
      this.page.getByTestId(FORM_SELECTORS.emailGroup),
    ).not.toBeAttached();
  };

  selectOptionOfMultipleChoiceQuestion = async (optionNumber: number) => {
    await this.page
      .getByTestId(FORM_SELECTORS.singleChoiceOption)
      .nth(optionNumber - 1)
      .click();
  };

  verifyMultiChoiceQuestionHidden = async () => {
    // verify multi-choice question hidden
    await expect(
      this.page.getByTestId(FORM_SELECTORS.multipleChoiceOptionContainer),
    ).toBeHidden({ timeout: 10000 });
  };

  verifyMultiChoiceQuestionVisible = async () => {
    // verify multi-choice question visible
    await expect(
      this.page.getByTestId(FORM_SELECTORS.multipleChoiceOptionContainer),
    ).toBeVisible({ timeout: 10000 });
  };

  checkEmailValueMatch = async (email: string) => {
    await expect(this.page.getByTestId(FORM_SELECTORS.emailField)).toHaveValue(
      email,
    );
  };

  checkStarValueMatch = async (starRating: string) => {
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.starRatingGroup)
        .locator(`input[value="${starRating}"]`),
    ).toBeChecked();
  };

  checkOpinionScaleMatch = async (opinionScaleRating: string) => {
    await expect(
      this.page.getByTestId(
        `${FORM_SELECTORS.opinionScaleInput}-${opinionScaleRating}`,
      ),
    ).toBeChecked();
  };

  verifyMatrixSelection = async (row: string, col: string) => {
    // get the table
    const headers = this.page.getByTestId(FORM_SELECTORS.matrixColumnLabel);

    // get the total columns
    const headerCount = await headers.count();
    let colIndex = -1;

    // iterate over all columns
    for (let i = 0; i < headerCount; i++) {
      // get the column's text content
      const headerText = await headers.nth(i).textContent();
      // if column's text matched then get the colIndex
      if (headerText?.trim() === col) {
        colIndex = i;
        break;
      }
    }

    // Make sure we found a valid index
    expect(colIndex).toBeGreaterThan(-1);

    // 3. Get the row
    const targetRow = this.page
      .getByTestId(FORM_SELECTORS.matrixTable)
      .locator("tr")
      .filter({ hasText: row });

    // 4. Target the specific radio button by column index and assert it's checked
    await expect(
      targetRow.locator("input[type='radio']").nth(colIndex),
    ).toBeChecked();
  };

  submissionNotAllowedTextVisible = async () => {
    await expect(
      this.page.getByRole("heading", {
        name: FORM_SUBMISSION_TEXT.submissionNotAllowed,
      }),
    ).toBeVisible();
  };

  alreadySubmittedTextVisible = async () => {
    await expect(
      this.page.getByText(FORM_SUBMISSION_TEXT.alreadySubmittedText),
    ).toBeVisible();
  };

  fillStarRating = async (starRating: string) => {
    await this.page
      .getByTestId(`${FORM_SELECTORS.ratingIcon}-${starRating}`)
      .click();
  };

  fillOpinionScale = async (opinionScaleRating: string) => {
    await this.page
      .getByTestId(`${FORM_SELECTORS.opinionScaleItem}-${opinionScaleRating}`)
      .click();
  };

  checkMatrixLabel = async (optionNumber: number) => {
    await this.page
      .getByTestId(FORM_SELECTORS.matrixRadioLabel)
      .nth(optionNumber - 1)
      .check();
  };
}
