import { expect, Page } from "@playwright/test";
import { CREATE_FORM_SELECTORS, FORM_SELECTORS } from "@selectors";
import { CREATE_FORM_TEXTS } from "@texts/createForm";
import FormPage from "../form";

export class BuildTab {

    constructor(private page: Page) { }

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
}