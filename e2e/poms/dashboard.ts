import { Page } from "@playwright/test";
import { CREATE_FORM_SELECTORS } from "@selectors";

export default  class DashboardPage {

    constructor(private page: Page){}

    goToFormCreationPage = async() => {
        await this.page.getByTestId(CREATE_FORM_SELECTORS.addFormButton).click();
    }
}