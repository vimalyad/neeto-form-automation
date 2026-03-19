import { expect, Page } from "@playwright/test";
import { CREATE_FORM_SUBMISSIONS_SELECTORS } from "@selectors";

export class SubmissionsTab {
    constructor(private page: Page) { }

    openSubmissionsTab = async () => {
        await this.page
            .getByTestId(CREATE_FORM_SUBMISSIONS_SELECTORS.submissionTab)
            .click();
    };

    getSubmissionRow = async (identifier: string) => {
        return this.page.getByRole("row").filter({ hasText: identifier }).first();
    };

    verifyResponse = async (email: string) => {
        await expect(this.page.getByRole("link", { name: email })).toBeVisible();
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