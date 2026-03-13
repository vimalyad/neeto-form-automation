import { Page } from "@playwright/test";
import { CREATE_FORM_SELECTORS } from "@selectors";
import { CREATE_FORM_TEXTS } from "@texts/form";

export default class FormPage {
    constructor(private page: Page) { }

    createForm = async () => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormButton).click();
        await this.page.getByRole('heading', { name: CREATE_FORM_TEXTS.startFromScratch }).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormElementButton).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.fullNameField }).click();
        await this.page.getByRole('button', { name: CREATE_FORM_TEXTS.phoneNumberField }).click();
        await this.page.getByTestId(CREATE_FORM_SELECTORS.publishButton).click();
    }

    verifyForm = async () => {
        await this.page.getByTestId('full-name-group').getByTestId('form-group-question').isVisible();
        await this.page.getByTestId('phone-group').getByTestId('form-group-question').isVisible();
    }
}