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
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.fullNameField }).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.phoneNumberField }).click();
    }

    addSingleChoiceQuestionWithSixExtraOptions = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.singleChoiceQuestionAddButton).click();
        await expect(this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton)).toBeVisible({ timeout: 10000 });
        for (let i = 0; i < 6; i++) await this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton).click();
    }

    addMultiChoiceQuestionWithSixExtraOptions = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.multipleChoiceQuestionAddButton).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.questionText }).nth(2).click();
        await expect(this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton)).toBeVisible({ timeout: 10000 });
        for (let i = 0; i < 6; i++) await this.page.getByTestId(CREATE_FORM_SELECTORS.addOptionButton).click();
    }

    randomizeSingleChoiceQuestionOptions = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.randomizeSwitchLabel).filter({ visible: true }).first().click();
        await this.page.waitForTimeout(1500);
    }

    toggleMultiChoiceQuestionVisibility = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.hideSwitchLabel).getByTestId(CREATE_FORM_SELECTORS.nuiSwitchLabel).click();
        await this.page.waitForTimeout(1500);
    }

    publishForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.publishButton).click();
    }

    openFormPage = async (context: BrowserContext) => {
        // catch the promise which will be opening new page
        const pagePromise = context.waitForEvent('page');
        // publish preview button clicked here
        await this.page.getByTestId(FORM_SELECTORS.publishPreviewButton).click();
        const newPage = await pagePromise;
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
        await expect(submissionRow.getByText(phoneNumber.replaceAll('-', ' '), { exact: false })).toBeVisible();
    }


    deleteForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.menuButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.formDeleteButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.alertCheckboxButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.alertDeleteButton).click();
    }

}

/**
 


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
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.fullNameField }).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.phoneNumberField }).click();
    }

    addSingleChoiceElementsWithSixExtraOptions = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.singleChoice, exact: true }).first().click();
        await expect(this.page.getByTestId(CREATE_FORM_SELECTORS.addOption)).toBeVisible({ timeout: 10000 });

        for (let i = 0; i < 6; i++) {
            await this.page.getByTestId(CREATE_FORM_SELECTORS.addOption).click();
        }
    }

    addMultiChoiceElementsWithSixExtraOptions = async () => {
        const multipleChoiceBtn = this.page.getByRole('button', { name: CREATE_FORM_TEXTS.multipleChoice, exact: true });
        
        if (!(await multipleChoiceBtn.first().isVisible())) {
            await this.page.getByTestId(CREATE_FORM_SELECTORS.elementsContainer).click();
            await expect(multipleChoiceBtn.first()).toBeVisible({ timeout: 5000 });
        }

        await multipleChoiceBtn.first().click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.question }).nth(2).click();

        await expect(this.page.getByTestId(CREATE_FORM_SELECTORS.addOption)).toBeVisible({ timeout: 10000 });

        for (let i = 0; i < 6; i++) {
            await this.page.getByTestId(CREATE_FORM_SELECTORS.addOption).click();
        }
    }

    randomizeSingleChoiceOptions = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.randomizeSwitch).filter({ visible: true }).first().click();
        await this.page.waitForTimeout(1500);
    }

    toggleMultiChoiceQuestion = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.hideSwitch).getByTestId(CREATE_FORM_SELECTORS.nuiSwitch).click();
        await this.page.waitForTimeout(1500);
    }

    publishForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.publishButton).click();
    }

    verifySingleChoiceElementRandomized = async (publishedPage: Page) => {
        // Note: In your working test, verification happens on the Published Form Page.
        // You would typically extract the text content of the options here and assert 
        // that their order does not match the default sequential order.
        const optionsContainer = publishedPage.getByTestId(FORM_SELECTORS.singleChoiceOptionsContainer);
        await expect(optionsContainer).toBeVisible();
    }

    verifyMultiChoiceElementHidden = async (publishedPage: Page) => {
        // Renamed from 'Randomized' to 'Hidden' to match the test logic you provided.
        const optionsContainer = publishedPage.getByTestId(FORM_SELECTORS.multipleChoiceOptionsContainer);
        await expect(optionsContainer).toBeHidden();
    }

    openFormPage = async (context: BrowserContext) => {
        const pagePromise = context.waitForEvent('page');
        await this.page.getByTestId(FORM_SELECTORS.publishPreviewButton).click();
        const newPage = await pagePromise;
        await newPage.waitForLoadState('domcontentloaded');
        return new FormPage(newPage);
    }

    verifySubmission = async ({ name, email, phoneNumber }: SubmissionDetails) => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.submissionTab).click();

        const submissionRow = this.page.getByRole('row').filter({ hasText: email }).first();

        await expect(submissionRow).toBeVisible();
        await expect(submissionRow.getByText(name)).toBeVisible();
        await expect(submissionRow.getByText(email)).toBeVisible();
        await expect(submissionRow.getByText(phoneNumber.replaceAll('-', ' '), { exact: false })).toBeVisible();
    }

    deleteForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.menuButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.formDeleteButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.alertCheckboxButton).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.alertDeleteButton).click();
    }
}
 */