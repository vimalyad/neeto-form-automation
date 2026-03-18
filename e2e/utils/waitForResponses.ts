import { BACKEND_MAPPING_FOR_FORM_BUILDER, BACKEND_URL_PATTERNS, formUrl } from "@constants/urlPatterns/backendUrlPattern";
import FormCreationPage from "@poms/form/createForm";

// reload form page and wait for updated insights from backend
export const reloadAndWaitForInsights = async (formCreationPage: FormCreationPage) => {
    const loadInsights = formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes(`${formUrl}/`) &&
            res.url().includes(`/${BACKEND_MAPPING_FOR_FORM_BUILDER.insights}`) &&
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
            res.url().includes(BACKEND_URL_PATTERNS.attemptsUrl) &&
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
            res.url().includes(`${formUrl}/`) &&
            res.url().includes(`/${BACKEND_MAPPING_FOR_FORM_BUILDER.records}/`) &&
            res.request().method() === "PUT" &&
            res.status() === 200
    );
}

// wait for Response from backend to get updated submissions
export const getSubmissionsLoaded = (formCreationPage: FormCreationPage) => {
    return formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes(`${formUrl}/`) &&
            res.url().includes(`/${BACKEND_MAPPING_FOR_FORM_BUILDER.submissions}`) &&
            res.request().method() === "GET" &&
            res.status() === 200
    );
}


export const getExportPagePromise = (formCreationPage: FormCreationPage) => {
    return formCreationPage.page
        .context()
        .waitForEvent("request", (req) =>
            req.url().includes(BACKEND_URL_PATTERNS.exportsUrl),
        );
}

export const publishFormWait = async (formCreationPage: FormCreationPage) => {
    const publishComplete = formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes(BACKEND_URL_PATTERNS.publishUrl) &&
            res.request().method() === "PUT" &&
            res.status() === 200
    );
    await formCreationPage.publishForm();
    await publishComplete;
}