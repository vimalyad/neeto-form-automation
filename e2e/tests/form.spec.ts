import { test } from "@fixtures";
import { faker } from "@faker-js/faker";
import FormPage from "../poms/form/form";
import { getInvalidEmailAndPhoneNumber, getMockData, transformToFormDetails, transformToSubmissionDetails } from '@utils/testData'

test.describe("Form Creation", () => {
    let mockUser: ReturnType<typeof getMockData> = getMockData();
    let formPage: FormPage;

    test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
        // from dashboard go to formCreation page
        await dashboardPage.goToFormCreationPage();

        // now we can call methods of formCreationPage
        await formCreationPage.createForm();
    })

    // test.afterEach(async ({ formCreationPage }) => {
    //     await test.step('Cleanup: Delete form', async () => formCreationPage.deleteForm())
    // })

    test("Create and submit a form", async ({ formCreationPage, page }) => {
        await test.step("Add name and phone number fields", () => formCreationPage.addNameAndPhoneNumberFields());

        await test.step("publish form page", () => formCreationPage.publishForm())

        await test.step("Open created form", async () => {
            formPage = await formCreationPage.openFormPage(page.context());
        });

        await test.step("Verify fields", () => formPage.verifyFields());

        await test.step("filling empty fields and error assertion", () => formPage.emptyFormSubmitValidation());

        await test.step("filling invalid email and phoneNumber and error assertion", () => formPage.invalidEmailAndPhoneNumber(getInvalidEmailAndPhoneNumber({
            firstName: mockUser.firstName,
            lastName: mockUser.lastName
        })));

        await test.step("Valid credentials and successful submit", () => formPage.validDetailsAndVerify(transformToFormDetails(mockUser)));

        await test.step('Verify Thank you and close form page', () => formPage.verifyThankYouOnPage())

        await test.step('Verify submitted response', async () => {
            await formCreationPage.verifySubmission(transformToSubmissionDetails(mockUser));
            await formPage.page.close();
        })
    });


    test.only("Customize form's field elements", async ({formCreationPage , page}) => {
        await test.step("Add single choice element with 6 additional options", () => formCreationPage.addSingleChoiceQuestionWithSixExtraOptions());
        await test.step("Randomize the options of single element", () => formCreationPage.randomizeSingleChoiceQuestionOptions());
        await test.step("Add multi choice element with 6 additional options", () => formCreationPage.addMultiChoiceQuestionWithSixExtraOptions());
        await test.step("Hide the multi choice question", () => formCreationPage.toggleMultiChoiceQuestionVisibility());
        await test.step("Publish the form", () => formCreationPage.publishForm())
        await test.step("Open published version of form" , async () => {
            formPage = await formCreationPage.openFormPage(page.context());
        })
        await test.step("Ensure options of single choice element are randomized", () => formPage.verifySingleChoiceOptionsRandomized())
        await test.step("Verify multi choice element is hidden", () => formPage.verifyMultiChoiceQuestionHidden());
        await test.step("Close opened form page" , () => formPage.page.close())
        await test.step("Uncheck the hide option of multi choice element", () => formCreationPage.toggleMultiChoiceQuestionVisibility())
        await test.step("Publish the form", () => formCreationPage.publishForm());
        await test.step("Open published version of form" , async () => {
            formPage = await formCreationPage.openFormPage(page.context());
        })
        await test.step("Ensure the field is now visible on the published form.", () => formPage.verifyMultiChoiceQuestionVisible());
        await test.step("Close opened form page" , () => formPage.page.close())
    });
})