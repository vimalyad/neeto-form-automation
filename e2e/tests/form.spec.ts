import { test } from "@fixtures";
import { expect } from "@playwright/test";
import FormPage from "@poms/form/form";

import { getMockData, transformToFullName } from "@utils/testData";

test.describe("Form Features", () => {
    let mockUser: ReturnType<typeof getMockData> = getMockData();
    let formPage: FormPage;

    test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
        // from dashboard go to formCreation page
        await dashboardPage.goToFormCreationPage();

        // now click on create form
        await formCreationPage.createForm();
    });

    // clear the created forms
    test.afterEach(async ({ formCreationPage }) => {
        await test.step("Cleanup: Delete form", async () =>
            formCreationPage.deleteForm());
    });

    test("Create and submit a form", async ({ formCreationPage, page }) => {
        test.setTimeout(60000);
        await test.step("Add name and phone number fields", async () => {
            await formCreationPage.clickAddElementButton();
            await formCreationPage.addNameElement();
            await formCreationPage.addPhoneNumberElement();
        });

        await test.step("publish form page", () => formCreationPage.publishForm());

        await test.step("Open created form", async () => {
            // page.context() gives us the BrowserContext
            formPage = await formCreationPage.openFormPage();
        });

        await test.step("Verify fields", async () => {
            await formPage.verifyFullNameFieldExist();
            await formPage.verifyPhoneNumberFieldExist();
            await formPage.verifyEmailFieldExist();
        });

        await test.step("filling empty fields and error assertion", async () => {
            await formPage.fillEmail("");
            await formPage.fillName({ firstName: "", lastName: "" });
            await formPage.fillPhoneNumber("");
            await formPage.submitForm();
            await formPage.gotEmailError({ emailPresent: false });
            await formPage.gotNameError();
            await formPage.gotPhoneNumberError();
        });

        await test.step("filling invalid email and phoneNumber and error assertion", async () => {
            await formPage.fillEmail("invalid.com");
            await formPage.fillName({
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
            });
            await formPage.fillPhoneNumber("123");
            await formPage.submitForm();
            await formPage.gotEmailError({ emailPresent: true });
            await formPage.noNameError();
            await formPage.gotPhoneNumberError();
        });

        await test.step("Valid credentials and successful submit", async () => {
            await formPage.fillEmail(mockUser.email);
            await formPage.fillName({
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
            });
            await formPage.fillPhoneNumber(mockUser.validPhone);
            await formPage.submitForm();
            await formPage.noEmailError();
            await formPage.noNameError();
            await formPage.noPhoneNumberError();
        });

        await test.step("Verify Thank you and close form page", () =>
            formPage.verifyThankYouOnPage());

        await test.step("Close form page", () => formPage.page.close());

        await test.step("Verify submitted response", async () => {
            await formCreationPage.page.reload();
            await formCreationPage.page.waitForLoadState('networkidle');
            await formCreationPage.openSubmissionsTab();
            // as it is sorted by time so our submission will be on top
            const submissionRow = await formCreationPage.getSubmissionRow(
                mockUser.email,
            );
            await expect(submissionRow).toBeVisible();
            await expect(
                submissionRow.getByText(
                    transformToFullName(mockUser.firstName, mockUser.lastName),
                ),
            ).toBeVisible();
            await expect(submissionRow.getByText(mockUser.email)).toBeVisible();
            // since us number have - and when submitted they are removed so while checking we remove too and then validate
            await expect(
                submissionRow.getByText(mockUser.validPhone.replaceAll("-", " "), {
                    exact: false,
                }),
            ).toBeVisible();
        });
    });
});
