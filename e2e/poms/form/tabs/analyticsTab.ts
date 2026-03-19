import { expect, Page } from "@playwright/test";
import { CREATE_FORM_ANALYTICS_SELECTORS } from "@selectors";

export class AnalyticsTab {
    constructor(private page: Page) { }

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