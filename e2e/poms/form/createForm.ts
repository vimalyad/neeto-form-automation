import { BrowserContext, expect, Page } from "@playwright/test";
import {
  CREATE_FORM_SELECTORS,
  CREATE_FORM_ANALYTICS_SELECTORS,
  FORM_SELECTORS,
  CREATE_FORM_SUBMISSIONS_SELECTORS,
  CREATE_FORM_SETTINGS_SELECTORS,
} from "@selectors";
import { CREATE_FORM_TEXTS } from "@texts/createForm";
import FormPage from "./form";

export default class FormCreationPage {
  constructor(public page: Page) {}

  createForm = async () => {
    await this.page
      .getByRole("heading", { name: CREATE_FORM_TEXTS.startFromScratch })
      .click();
  };

  clickAddElementButton = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.addFormElementButton)
      .click();
  };

  addNameElement = async () => {
    await this.page
      .getByRole("button", { name: CREATE_FORM_TEXTS.fullNameField })
      .click();
  };

  addPhoneNumberElement = async () => {
    await this.page
      .getByRole("button", { name: CREATE_FORM_TEXTS.phoneNumberField })
      .click();
  };

  addSingleChoiceElement = async () => {
    // add single choice element
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.singleChoiceQuestionAddButton)
      .click();
  };

  addMultiChoiceElement = async () => {
    // add multi choice question
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.multipleChoiceQuestionAddButton)
      .click();
  };

  publishForm = async () => {
    await this.page.getByTestId(CREATE_FORM_SELECTORS.publishButton).click();
  };

  openFormPage = async () => {
    const previewButton = this.page.getByTestId(
      FORM_SELECTORS.publishPreviewButton,
    );
    // make sure preview button enabled
    await expect(previewButton).toBeEnabled({ timeout: 15000 });
    // publish preview button clicked here
    await previewButton.click();
    // catch the promise which will be opening new page
    const pagePromise = this.page.waitForEvent("popup");
    // as the new tab will be opened by this page only we are using popup
    // promise resolved and we will get the page
    const newPage = await pagePromise;
    // wait until the dom gets loaded
    await newPage.waitForLoadState("domcontentloaded");
    return new FormPage(newPage);
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

  randomizeSingleChoiceQuestionOptions = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel)
      .click();
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel)
      .isVisible();
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

  openAnalyticsTab = async () => {
    await this.page
      .getByTestId(CREATE_FORM_ANALYTICS_SELECTORS.analyticsTab)
      .click();
  };

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

  openSubmissionsTab = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.submissionTab)
      .click();
  };

  getSubmissionRow = async (identifier: string) => {
    return this.page.getByRole("row").filter({ hasText: identifier }).first();
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

  verifyResponse = async (email: string) => {
    await expect(this.page.getByRole("link", { name: email })).toBeVisible();
  };

  openEmailDetailsDropdown = async () => {
    // open dropdown
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.emailDetailsDropdown)
      .click();
  };

  deleteEmailElement = async () => {
    // delete email element
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.deleteEmailButton)
      .click();
  };

  verifyLoadingSpinnerInvisible = async () => {
    // make sure the loading spinner is invisible
    await this.page.waitForSelector(CREATE_FORM_SELECTORS.loadingSpinner, {
      state: "hidden",
      timeout: 15000,
    });
  };

  verifyAddOptionButtonVisible = async () => {
    // check add option button is now visible to make sure settings page loaded properly
    await expect(
      this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton),
    ).toBeVisible({
      timeout: 10000,
    });
  };

  addOption = async () => {
    await this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton).click();
  };

  checkOptionVisible = async (option: number) => {
    // option check it is visible
    await expect(
      this.page.getByTestId(
        `${CREATE_FORM_SELECTORS.optionInput}-${option - 1}`,
      ),
    ).toBeVisible({
      timeout: 10000,
    });
  };

  clickOption = async (option: number) => {
    await this.page
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-${option - 1}`)
      .click();
  };

  deleteOptionButtonVisible = async (option: number) => {
    await expect(
      this.page.getByTestId(
        `${CREATE_FORM_SELECTORS.deleteOptionButton}-${option - 1}`,
      ),
    ).toBeVisible();
  };

  deleteOption = async (option: number) => {
    await this.page
      .getByTestId(`${CREATE_FORM_SELECTORS.deleteOptionButton}-${option - 1}`)
      .click();
  };

  checkOptionHidden = async (option: number) => {
    await expect(
      this.page.getByTestId(
        `${CREATE_FORM_SELECTORS.optionInput}-${option - 1}`,
      ),
    ).toBeHidden();
  };

  addEmailElement = async () => {
    // add Email element
    await this.page.getByTestId(CREATE_FORM_SELECTORS.addEmailButton).click();
  };

  openConditionalLogicCard = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.conditionalLogicCard)
      .click();
  };

  addNewCondition = async () => {
    // click on Add new condition button
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.addNewCondition)
      .click();
  };

  verifySelectValueContainerFieldVisibleInCondition = async () => {
    // make sure input field is visible
    await expect(
      this.page.locator(
        CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerField,
      ),
    ).toBeVisible({ timeout: 15000 });
  };

  openDependencyFromSelectValueContainerFieldInCondition = async () => {
    // open input field for dependency from
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerField)
      .click();
  };

  selectQuestionAsDependencyFromSelectValueContainerFieldInCondition =
    async () => {
      // choose single choice question
      await this.page
        .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.typeAQuestionSelectValue)
        .click();
    };

  openVerbSelectValueContainerFieldInCondition = async () => {
    // open input field for verb
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerVerb)
      .click();
  };

  selectIsEqualToVerbInSelectValueContainerFieldInCondition = async () => {
    // select the value to be equal to
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.isEqualToOption)
      .click();
  };

  openDependencyValueContainerInCondition = async () => {
    // open input field for value dependency
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerValue)
      .click();
  };

  selectOptionOneAsDependencyValueInCondition = async () => {
    // choose option 1 for dependency
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.optionOne)
      .click();
  };

  openActionInputFieldInContainerInCondition = async () => {
    // open action input field
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerActionType)
      .click();
  };

  selectShowActionInCondition = async () => {
    // select action to show
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.showAction)
      .click();
  };

  openConditionResultInContainerInCondition = async () => {
    // open field for what to show
    await this.page
      .locator(CREATE_FORM_SETTINGS_SELECTORS.selectValueContainerFields)
      .click();
  };

  selectEmailAsConditionalResult = async () => {
    // select Email to be shown
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.emailOption)
      .click();
  };

  verifySaveChangesButtonHidden = async () => {
    await expect(
      this.page.getByTestId(CREATE_FORM_SELECTORS.saveChangesButton),
    ).toBeHidden();
  };

  openConditionalLogicDropdown = async () => {
    // open conditional logic dropdown
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.conditionalLogicDropdown)
      .click();
  };

  disableConditionalLogic = async () => {
    // disable conditional logic
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.conditionalLogicDisableButton)
      .click();
  };

  openQuestionsSettingWindow = async (questionNumber: number) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.formGroupQuestion)
      .nth(questionNumber - 1)
      .click();
  };

  openAdvanceProperties = async () => {
    await this.page
      .getByRole("button", { name: CREATE_FORM_TEXTS.advancedProperties })
      .click();
  };

  openEmailSetting = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.emailPreviewGroup)
      .click();
  };

  getEmailIdentifier = async () => {
    return await this.page
      .getByTestId(CREATE_FORM_SELECTORS.fieldCodeTextField)
      .inputValue();
  };

  addStarRatingElement = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.addStarRatingElement)
      .click();
  };

  openElementContextField = async () => {
    await this.page.getByTestId(CREATE_FORM_SELECTORS.contextTextField).click();
  };

  fillTextInStarElement = async (starRatingQuestion: string) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.contextTextField)
      .fill(starRatingQuestion);
  };

  getStarRatingIdentifier = async () => {
    return await this.page
      .getByTestId(CREATE_FORM_SELECTORS.fieldCodeTextField)
      .inputValue();
  };

  addOpinionScaleElement = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.addOpinionScaleElement)
      .click();
  };

  fillTextInOpinionScaleElement = async (opinionScaleQuestion: string) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.contextTextField)
      .fill(opinionScaleQuestion);
  };

  getOpinionScaleIdentifier = async () => {
    return await this.page
      .getByTestId(CREATE_FORM_SELECTORS.fieldCodeTextField)
      .inputValue();
  };

  addMatrixElement = async () => {
    await this.page.getByTestId(CREATE_FORM_SELECTORS.addMatrixElement).click();
  };

  fillQuestionInMatrix = async (matrixText: string) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.contextTextField)
      .fill(matrixText);
  };

  openInputFieldOfRowInMatrix = async (optionNumber: number) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.matrixRowContainer)
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-${optionNumber - 1}`)
      .click();
  };

  openInputFieldOfColInMatrix = async (optionNumber: number) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.matrixColContainer)
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-${optionNumber - 1}`)
      .click();
  };

  fillInputFieldOfRowContainer = async (
    optionNumber: number,
    value: string,
  ) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.matrixRowContainer)
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-${optionNumber - 1}`)
      .fill(value);
  };

  fillInputFieldOfColContainer = async (
    optionNumber: number,
    value: string,
  ) => {
    await this.page
      .getByTestId(CREATE_FORM_SELECTORS.matrixColContainer)
      .getByTestId(`${CREATE_FORM_SELECTORS.optionInput}-${optionNumber - 1}`)
      .fill(value);
  };

  getMatrixIdentifier = async () => {
    return await this.page
      .getByTestId(CREATE_FORM_SELECTORS.fieldCodeTextField)
      .inputValue();
  };

  openUniqueSubmissionCard = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.uniqueSubmissionCard)
      .click();
  };

  allowUniqueSubmission = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.cookieTrackItemCheck)
      .check();
    await this.saveFormChangesButton();
  };

  allowDuplicateSubmission = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.noTrackItemCheck)
      .check();
    await this.saveFormChangesButton();
  };

  openSubmittedResponse = async (responseNumber: number) => {
    await this.page
      .getByTestId(
        `${CREATE_FORM_SUBMISSIONS_SELECTORS.submittedResponse}-${responseNumber}`,
      )
      .click();
  };

  openDropdownForDownloadType = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.dropdownElement)
      .click();
  };

  checkDownloadAsPdf = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.downloadAsPdfCheckbox)
      .check();
  };

  downloadSubmissions = async () => {
    await this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.downloadButton)
      .click();
  };

  paneCloseButtonVisibility = async () => {
    return this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.paneCloseButton)
      .isVisible();
  };

  closePane = async () => {
    this.page
      .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.paneCloseButton)
      .click();
  };
}
