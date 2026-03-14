import { expect, Page } from "@playwright/test";
import { FORM_ACCESS_CARD_SELECTORS, FORM_SELECTORS } from "@selectors";
import {
  FORM_COUNTRY_DETAILS,
  FORM_ERRORS_TEXT,
  FORM_SUBMISSION_TEXT,
} from "@texts/form";

export interface Name {
  firstName: string;
  lastName: string;
}

export interface FormDetails {
  email: string;
  name: Name;
  phoneNumber: string;
}

export default class FormPage {
  constructor(public page: Page) {}

  verifyFields = async () => {
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.fullNameGroup)
        .getByTestId(FORM_SELECTORS.formGroupQuestion),
    ).toBeVisible();
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.phoneNumberGroup)
        .getByTestId(FORM_SELECTORS.formGroupQuestion),
    ).toBeVisible();
    await expect(
      this.page
        .getByTestId(FORM_SELECTORS.emailGroup)
        .getByTestId(FORM_SELECTORS.formGroupQuestion),
    ).toBeVisible();
  };

  verifyThankYouOnPage = async () => {
    // verify thank you text on page
    await expect(
      this.page.getByRole("heading", {
        name: FORM_SUBMISSION_TEXT.thankYouText,
      }),
    ).toBeVisible({ timeout: 15000 });
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

  verifySingleChoiceOptionsRandomized = async () => {
    const optionsContainer = this.page.getByTestId(
      FORM_SELECTORS.singleChoiceOptionContainer,
    );
    // get the container storing all options of single-choice-question

    // playwright will wait upto 15 sec while it will be scanning dom every millisecond and as soon as it finds it , it will move to next
    await expect(optionsContainer).toBeVisible({ timeout: 15000 });

    // get all option's textContent
    const options = await optionsContainer.locator("label").allTextContents();
    for (let i = 0; i < options.length; i++) {
      // if it is randomized then it will not follow i + 1 structure
      if (options[i] !== `Option ${i + 1}`) return;
    }
    expect(false, "Options not randomized").toBe(true);
  };

  // errors assert methods

  gotEmailError = async (emailPresent: boolean) => {
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

  // empty form error validation

  emptyFormSubmitValidation = async () => {
    await this.fillAndSubmitForm({
      name: { firstName: "", lastName: "" },
      email: "",
      phoneNumber: "",
    });
    await this.gotEmailError(false);
    await this.gotNameError();
    await this.gotPhoneNumberError();
  };

  // invalid email and phoneNumber validation

  invalidEmailAndPhoneNumber = async ({
    email,
    name,
    phoneNumber,
  }: FormDetails) => {
    if (!name.firstName || !name.lastName) return;
    await this.fillAndSubmitForm({ email, name, phoneNumber });
    await this.gotEmailError(true);
    await this.gotPhoneNumberError();
    await this.noNameError();
  };

  validDetailsAndVerify = async ({ email, name, phoneNumber }: FormDetails) => {
    if (!email || !name.firstName || !name.lastName || !phoneNumber) return;
    await this.fillAndSubmitForm({ email, name, phoneNumber });
    await this.noPhoneNumberError();
    await this.noEmailError();
    await this.noNameError();
  };

  fillEmail = async (email: string) => {
    await this.page.getByTestId(FORM_SELECTORS.emailField).fill(email);
  };

  submitForm = async () => {
    await this.page.getByTestId(FORM_SELECTORS.submitButton).click();
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

  verifyFormIsPasswordProtectedAndFillForm = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await this.verifyFormPasswordProtected();
    await this.fillFormSecurePassword("123");
    await this.continueToFormPage();
    await this.verifyPasswordInputError();
    await this.fillFormSecurePassword(password);
    await this.continueToFormPage();
    await this.fillEmail(email);
    await this.submitForm();
    await this.verifyThankYouOnPage();
  };

  // private methods

  private fillName = async ({ firstName, lastName }: Name) => {
    await this.page.getByTestId(FORM_SELECTORS.firstNameField).fill(firstName);
    await this.page.getByTestId(FORM_SELECTORS.lastNameField).fill(lastName);
  };

  private fillPhoneNumber = async (phoneNumber: string) => {
    await this.changeCountryIfNotAlready();
    await this.page
      .getByTestId(FORM_SELECTORS.phoneNumberField)
      .fill(phoneNumber);
  };

  private fillAndSubmitForm = async ({
    email,
    name,
    phoneNumber,
  }: FormDetails) => {
    await this.fillEmail(email);
    await this.fillName(name);
    await this.fillPhoneNumber(phoneNumber);
    await this.submitForm();
  };

  private changeCountryIfNotAlready = async () => {
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
}
