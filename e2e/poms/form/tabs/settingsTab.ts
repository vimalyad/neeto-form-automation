import { expect, Page } from "@playwright/test";
import { CREATE_FORM_SELECTORS, CREATE_FORM_SETTINGS_SELECTORS } from "@selectors";

export class SettingsTab {
    constructor(private page: Page) { }

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

    setSecurePassword = async (password = "") => {
        await this.page
            .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.securePasswordInput)
            .fill(password);
    };

    setSecurePasswordToForm = async () => {
        await this.page
            .getByTestId(CREATE_FORM_SETTINGS_SELECTORS.accessControlPasswordField)
            .check();
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
}