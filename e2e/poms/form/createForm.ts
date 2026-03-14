import { BrowserContext, expect, Page } from "@playwright/test";
import { CREATE_FORM_SELECTORS, FORM_SELECTORS } from "@selectors";
import FormPage, { FormDetails } from "./form";
import { CREATE_FORM_TEXTS } from "@texts/createForm";

export interface SubmissionDetails {
    name: string,
    email: string,
    phoneNumber: string
}

export default class FormCreationPage {

    constructor(public page: Page) { }

    createForm = async () => {
        await this.page.getByRole('heading', { name: CREATE_FORM_TEXTS.startFromScratch }).click();
    }

    addNameAndPhoneNumberFields = async () => {
        // click add element button
        this.clickAddElementButton();
        // 
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.fullNameField }).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.phoneNumberField }).click();
    }

    addSingleChoiceQuestionWithSixExtraOptions = async () => {
        this.clickAddElementButton();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.singleChoiceQuestionAddButton).click();
        await expect(this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton)).toBeVisible({ timeout: 10000 });
        for (let i = 0; i < 6; i++) await this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton).click();
    }

    addMultiChoiceQuestionWithSixExtraOptions = async () => {
        // add multi choice question
        await this.page.getByTestId(CREATE_FORM_SELECTORS.multipleChoiceQuestionAddButton).click();
        // click on second question to open it's settings window
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.questionText }).nth(2).click();
        // make sure thr addOption button is visible
        await expect(this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton)).toBeVisible({ timeout: 10000 });
        // add 6 more options
        for (let i = 0; i < 6; i++) await this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton).click();
    }

    randomizeSingleChoiceQuestionOptions = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel).isVisible();
    }

    toggleMultiChoiceQuestionVisibility = async (turnOn: boolean) => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.hideSwitchLabel).getByTestId(CREATE_FORM_SELECTORS.nuiSwitchLabel).click();
        await (
            turnOn
                ? this.page.getByTestId(CREATE_FORM_SELECTORS.hiddenErrorWarning).isHidden()
                : this.page.getByTestId(CREATE_FORM_SELECTORS.hiddenErrorWarning).isVisible()
        );
    }

    publishForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.publishButton).click();
    }

    openFormPage = async (context: BrowserContext) => {
        // catch the promise which will be opening new page
        const pagePromise = context.waitForEvent('page');
        // publish preview button clicked here
        await this.page.getByTestId(FORM_SELECTORS.publishPreviewButton).click();

        // promise resolved and we will get the page
        const newPage = await pagePromise;

        // wait until the dom gets loaded
        await newPage.waitForLoadState('domcontentloaded');

        return new FormPage(newPage);
    }

    verifySubmission = async ({
        name,
        email,
        phoneNumber
    }: SubmissionDetails) => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.submissionTab).click();

        // as it is sorted by time so our submission will be on top
        const submissionRow = this.page.getByRole('row').filter({ hasText: email }).first();

        await expect(submissionRow).toBeVisible();
        await expect(submissionRow.getByText(name)).toBeVisible();
        await expect(submissionRow.getByText(email)).toBeVisible();
        // since us number have - and when submitted they are removed so while checking we remove too and then validate
        await expect(submissionRow.getByText(phoneNumber.replaceAll('-', ' '), { exact: false })).toBeVisible();
    }


    deleteForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.menuButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.formDeleteButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.alertCheckboxButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.alertDeleteButton).click();
    }

    private clickAddElementButton = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
    }
}