import { BrowserContext, expect, Page } from "@playwright/test";
import { CREATE_FORM_SELECTORS, FORM_SELECTORS } from "@selectors";
import FormPage, { FormDetails } from "./form";
import { CREATE_FORM_TEXTS } from "@texts/createForm";

interface SubmissionDetails {
    name: string,
    email: string,
    phoneNumber: string
}

export default class FormCreationPage {

    constructor(public page: Page) { }

    createForm = async () => {
        await this.page.getByRole('heading', { name: CREATE_FORM_TEXTS.startFromScratch }).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.fullNameField }).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.phoneNumberField }).click();
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
        await this.page.getByTestId('submissions-tab').click();

        // as it is sorted by time so our submission will be on top
        const submissionRow = this.page.getByRole('row').filter({ hasText: email }).first();

        await expect(submissionRow).toBeVisible();
        await expect(submissionRow.getByText(name)).toBeVisible();
        await expect(submissionRow.getByText(email)).toBeVisible();
        await expect(submissionRow.getByText(phoneNumber.replaceAll('-' , ' '), { exact: false })).toBeVisible();
    }


    deleteForm = async() => {
        await this.page.getByTestId('neeto-molecules-menu-button').click();
        await this.page.getByTestId('form-delete-button').click();
        await this.page.getByTestId('delete-archive-alert-archive-checkbox').click();
        await this.page.getByTestId('delete-archive-alert-delete-button').click();
    }

}