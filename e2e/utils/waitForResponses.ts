import FormCreationPage from "@poms/form/createForm";

export const reloadAndWaitForInsights = async (formCreationPage: FormCreationPage) => {
    const insightsLoaded = formCreationPage.page.waitForResponse(
        (res) =>
            res.url().includes("/api/v1/forms/") &&
            res.url().includes("/insights") &&
            res.request().method() === "GET" &&
            res.status() === 200
    );
    await formCreationPage.page.reload();
    await insightsLoaded;
};

export const openFormPageWithAttempts = async (formCreationPage: FormCreationPage) => {
    const attemptTracked = formCreationPage.page.context().waitForEvent(
        "response",
        (res) =>
            res.url().includes("/api/v1/forms/attempts/") &&
            res.request().method() === "PATCH"
    );
    const formPage = await formCreationPage.openFormPage();
    await attemptTracked;
    return formPage;
}

// since there is debounce in saving of fields of form we wait until the form is properly updated
export const waitForRecordSaved = (formCreationPage: FormCreationPage) =>
        formCreationPage.page.waitForResponse(
            (res) =>
                res.url().includes("/api/v1/forms/") &&
                res.url().includes("/records/") &&
                res.request().method() === "PUT" &&
                res.status() === 200
        );
