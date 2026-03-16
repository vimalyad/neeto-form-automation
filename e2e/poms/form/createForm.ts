import { BrowserContext, expect, Page } from "@playwright/test";
import {
  CREATE_FORM_SELECTORS,
  CREATE_FORM_ANALYTICS_SELECTORS,
  FORM_SELECTORS,
  CREATE_FORM_SUBMISSIONS_SELECTORS,
  CREATE_FORM_SETTINGS_SELECTORS,
} from "@selectors";
import FormPage from "./form";
import { CREATE_FORM_TEXTS } from "@texts/createForm";

export interface SubmissionDetails {
  name: string;
  email: string;
  phoneNumber: string;
}

export default class FormCreationPage {
  constructor(public page: Page) {}

  createForm = async () => {
    await this.page
      .getByRole("heading", { name: CREATE_FORM_TEXTS.startFromScratch })
      .click();
  };

  addNameAndPhoneNumberFields = async () => {
    // click add element button
    this.clickAddElementButton();
    //
    await this.page
      .getByRole("button", { name: CREATE_FORM_TEXTS.fullNameField })
      .click();
    await this.page
      .getByRole("button", { name: CREATE_FORM_TEXTS.phoneNumberField })
      .click();
  };

  addSingleChoiceQuestionWithSixExtraOptions = async () => {
    this.clickAddElementButton();
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.singleChoiceQuestionAddButton)
      .click();
    await expect(
      this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton),
    ).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 6; i++)
      await this.page
        .getByTestId(CREATE_FORM_SELECTORS.addOptionButton)
        .click();
  };

  addMultiChoiceQuestionWithSixExtraOptions = async () => {
    // add multi choice question
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.multipleChoiceQuestionAddButton)
      .click();
    // click on second question to open it's settings window
    await this.page
      .getByRole("button", { name: CREATE_FORM_TEXTS.questionText })
      .nth(2)
      .click();
    // make sure thr addOption button is visible
    await expect(
      this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton),
    ).toBeVisible({ timeout: 10000 });
    // add 6 more options
    for (let i = 0; i < 6; i++)
      await this.page
        .getByTestId(CREATE_FORM_SELECTORS.addOptionButton)
        .click();
  };

  randomizeSingleChoiceQuestionOptions = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel)
      .click();
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel)
      .isVisible();
  };

  toggleMultiChoiceQuestionVisibility = async (turnOn: boolean) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.hideSwitchLabel)
      .getByTestId(CREATE_FORM_SELECTORS.nuiSwitchLabel)
      .click();
    await (turnOn
      ? this.page
          .getByTestId(CREATE_FORM_SELECTORS.hiddenErrorWarning)
          .isHidden()
      : this.page
          .getByTestId(CREATE_FORM_SELECTORS.hiddenErrorWarning)
          .isVisible());
  };

  publishForm = async () => {
    await this.page.getByTestId(CREATE_FORM_SELECTORS.publishButton).click();
  };

  openFormPage = async (context: BrowserContext) => {
    const previewButton = this.page.getByTestId(
      FORM_SELECTORS.publishPreviewButton,
    );
    // make sure preview button enabled
    await expect(previewButton).toBeEnabled({ timeout: 15000 });
    // publish preview button clicked here
    await previewButton.click();
    // catch the promise which will be opening new page
    const pagePromise = context.waitForEvent("page");
    // promise resolved and we will get the page
    const newPage = await pagePromise;
    // wait until the dom gets loaded
    await newPage.waitForLoadState("domcontentloaded");
    return new FormPage(newPage);
  };

  verifySubmission = async ({
    name,
    email,
    phoneNumber,
  }: SubmissionDetails) => {
    await this.openSubmissionsTab();

    // as it is sorted by time so our submission will be on top
    const submissionRow = this.page
      .getByRole("row")
      .filter({ hasText: email })
      .first();

    await expect(submissionRow).toBeVisible();
    await expect(submissionRow.getByText(name)).toBeVisible();
    await expect(submissionRow.getByText(email)).toBeVisible();
    // since us number have - and when submitted they are removed so while checking we remove too and then validate
    await expect(
      submissionRow.getByText(phoneNumber.replaceAll("-", " "), {
        exact: false,
      }),
    ).toBeVisible();
  };

  deleteForm = async () => {
    await this.page.getByTestId(CREATE_FORM_SELECTORS.menuButton).click();
    await this.page.getByTestId(CREATE_FORM_SELECTORS.formDeleteButton).click();
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.alertCheckboxButton)
      .click();
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.alertDeleteButton)
      .click();
  };

  verifyInitialFormInsightToBeZero = async () => {
    this.verifyStartCount(0);
    this.verifyStartCount(0);
    this.verifySubmissionCount(0);
    this.verifyCompletionPercentage(0);
  };

  openAnalyticsTab = async () => {
    await this.page
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.analyticsTab)
      .click();
  };

  // here we are waiting for the UI to get updated with real details by providing it time

  verifyVisitCount = async (count: number) => {
    await expect(this.getVisitLocator()).toHaveText(count.toString(), {
      timeout: 15000,
    });
  };

  verifyStartCount = async (count: number) => {
    await expect(this.getStartsLocator()).toHaveText(count.toString(), {
      timeout: 15000,
    });
  };

  verifySubmissionCount = async (count: number) => {
    await expect(this.getSubmissionsLocator()).toHaveText(count.toString(), {
      timeout: 15000,
    });
  };

  verifyCompletionPercentage = async (percentage: number) => {
    await expect(this.getCompletionLocator()).toHaveText(`${percentage}%`, {
      timeout: 15000,
    });
  };

  openSettingsTab = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.settingsTab)
      .click();
  };

  openAccessControlCard = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.accessControlCard)
      .click();
  };

  setSecurePasswordToForm = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.accessControlPasswordField)
      .check();
  };

  verifySecurePasswordField = async () => {
    await this.setSecurePassword();
    await this.saveFormChangesButton();
    await this.gotSecurePasswordError();
    await this.setSecurePassword("123");
    await this.saveFormChangesButton();
    await this.gotSecurePasswordError();
    await this.setSecurePassword("abc");
    await this.saveFormChangesButton();
    await this.gotSecurePasswordError();
  };

  setSecurePasswordAndSave = async (password: string) => {
    await this.setSecurePassword(password);
    await this.saveFormChangesButton();
  };

  setSecurePassword = async (password = "") => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.securePasswordInput)
      .fill(password);
  };

  saveFormChangesButton = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.saveChangesButton)
      .click();
  };

  gotSecurePasswordError = async () => {
    await expect(
      this.page.getByTestId(CREATE_FORM_SETTINGS_SELECTORS.securePasswordError),
    ).toBeVisible();
  };

  noSecurePasswordError = async () => {
    await expect(
      this.page.getByTestId(CREATE_FORM_SETTINGS_SELECTORS.securePasswordError),
    ).toBeHidden();
  };

  openSubmissionsTab = async () => {
    await this.page.waitForTimeout(2000);
    await this.page.reload();
    await this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.submissionTab)
      .click();
  };

  verifyResponse = async (email: string) => {
    await expect(this.page.getByRole("link", { name: email })).toBeVisible();
  };

  allowDuplicateSubmission = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.noTrackItemCheck)
      .check();
    await this.saveFormChangesButton();
  };

  allowUniqueSubmission = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.cookieTrackItemCheck)
      .check();
    await this.saveFormChangesButton();
  };

  openUniqueSubmissionCard = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.uniqueSubmissionCard)
      .click();
  };

  deleteEmailElement = async () => {
    // open dropdown
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.emailDetailsDropdown)
      .click();
    // delete email element
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.deleteEmailButton)
      .click();
  };

  addEmailElement = async () => {
    // add Email element
    await this.page.getByTestId(CREATE_FORM_SELECTORS.addEmailButton).click();
  };

  addSingleChoiceElementWithOnlyTwoOptions = async () => {
    // click add element button
    await this.clickAddElementButton();
    // add single choice element
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.singleChoiceQuestionAddButton)
      .click();
    // make sure the loading spinner is invisible
    await this.page.waitForSelector(CREATE_FORM_SELECTORS.loadingSpinner, {
      state: "hidden",
      timeout: 15000,
    });
    // add pointer to first question
    const questionBlock = this.page
      .getByTestId(CREATE_FORM_SELECTORS.formGroupQuestion)
      .nth(0);
    // question should be visible
    await questionBlock.waitFor({ state: "visible" });
    await questionBlock.scrollIntoViewIfNeeded();
    // click on question to open settings page
    await questionBlock.click();
    // check add option button is now visible to make sure settings page loaded properly
    await expect(
      this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton),
    ).toBeVisible({
      timeout: 15000,
    });
    // before clicking option 4 check it is visible
    await expect(
      this.page.getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-3`),
    ).toBeVisible({
      timeout: 10000,
    });
    await this.page
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-3`)
      .click();
    await expect(
      this.page.getByTestId(`${CREATE_FORM_SELECTORS.deleteOptionButton}-3`),
    ).toBeVisible();
    await this.page
      .getByTestId(`${CREATE_FORM_SELECTORS.deleteOptionButton}-3`)
      .click();
    // verify option deleted
    await expect(
      this.page.getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-3`),
    ).toBeHidden();

    // option 3 is visible
    await this.page
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-2`)
      .click();
    await expect(
      this.page.getByTestId(`${CREATE_FORM_SELECTORS.deleteOptionButton}-2`),
    ).toBeVisible();
    await this.page
      .getByTestId(`${CREATE_FORM_SELECTORS.deleteOptionButton}-2`)
      .click();
    // verify option deleted
    await expect(
      this.page.getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-2`),
    ).toBeHidden();
  };

  openConditionalLogicCard = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.conditionalLogicCard)
      .click();
  };

  addConditionalLogicOfEmailDependencyOnOptionOne = async () => {
    // click on Add new condition button
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.addNewCondition)
      .click();

    // make sure input field is visible
    await expect(
      this.page.locator(
        CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerField,
      ),
    ).toBeVisible({ timeout: 15000 });

    // open input field for dependency from
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerField)
      .click();
    // choose single choice question
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.typeAQuestionSelectValue)
      .click();

    // open input field for verb
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerVerb)
      .click();
    // select the value to be equal to
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.isEqualToOption)
      .click();

    // open input field for value dependency
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerValue)
      .click();
    // choose option 1 for dependency
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.optionOne)
      .click();

    // open action input field
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerActionType)
      .click();
    // select action to show
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.showAction)
      .click();

    // open field for what to show
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerFields)
      .click();
    // select Email to be shown
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.emailOption)
      .click();

    // save the conditional logic
    await this.saveFormChangesButton();
    // verify conditional logic to be Hidden now
    await expect(
      this.page.getByTestId(CREATE_FORM_SELECTORS.saveChangesButton),
    ).toBeHidden();
  };

  removeEmailDependency = async () => {
    // open conditional logic dropdown
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.conditionalLogicDropdown)
      .click();
    // disable conditional logic
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.conditionalLogicDisableButton)
      .click();
  };

  private clickAddElementButton = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.addFormElementButton)
      .click();
  };

  private getVisitLocator = () => {
    return this.page
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.visitMetric)
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.insightCount);
  };

  private getStartsLocator = () => {
    return this.page
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.startsMetric)
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.insightCount);
  };

  private getSubmissionsLocator = () => {
    return this.page
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.submissionsMetric)
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.insightCount);
  };

  private getCompletionLocator = () => {
    return this.page
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.completionRateMetric)
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.insightCount);
  };
}
