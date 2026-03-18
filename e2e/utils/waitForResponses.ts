import FormCreationPage from "@poms/form/createForm";
import { SUBMISSION_PREVIEW_SELECTORS } from "@selectors/submissionPreview";

// reload form page and wait for updated insights from backend
export const reloadAndWaitForInsights = async (formCreationPage: FormCreationPage) => {
    const loadInsights = formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes("/api/v1/forms/") &&
            res.url().includes("/insights") &&
            res.request().method() === "GET" &&
            res.status() === 200
    );
    await formCreationPage.page.reload();
    await loadInsights;
};

// get form page with updated attempts about there action on formPage
export const openFormPageWithAttempts = async (formCreationPage: FormCreationPage) => {
    // here we are adding the waitForEvent at context level
    const trackAttempts = formCreationPage.page.context().waitForEvent(
        "response",
        (res) =>
            res.url().includes("/api/v1/forms/attempts/") &&
            res.request().method() === "PATCH"
    );
    const formPage = await formCreationPage.openFormPage();
    await trackAttempts;
    return formPage;
}

// since there is debounce in saving of fields of form we wait until the form is properly updated
export const getWaitForRecordSaved = (formCreationPage: FormCreationPage) => {
    return formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes("/api/v1/forms/") &&
            res.url().includes("/records/") &&
            res.request().method() === "PUT" &&
            res.status() === 200
    );
}

// wait for Response from backend to get updated submissions
export const getSubmissionsLoaded = (formCreationPage: FormCreationPage) => {
    return formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes("/api/v1/forms/") &&
            res.url().includes("/submissions") &&
            res.request().method() === "GET" &&
            res.status() === 200
    );
}


export const getExportPagePromise = (formCreationPage: FormCreationPage) => {
    return formCreationPage.page
        .context()
        .waitForEvent("request", (req) =>
            req.url().includes(SUBMISSION_PREVIEW_SELECTORS.urlPart),
        );
}