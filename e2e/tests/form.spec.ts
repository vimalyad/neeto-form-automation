import { test } from "@fixtures";
import { faker } from "@faker-js/faker";
import FormPage from "../poms/form/form";

test.describe("Form Creation", () => {
    let firstName: string;
    let lastName: string;
    let email: string;
    let validPhone: string;
    let formPage: FormPage;

    test.beforeEach(() => {
        firstName = faker.person.firstName();
        lastName = faker.person.lastName();
        email = faker.internet.email();
        validPhone = process.env.FORM_PHONE_NUMBER!;
    });

    test("Create and submit a form", async ({ formCreationPage, dashboardPage, page }) => {
        await test.step("Add a new form", async () => {
            // from dashboard go to formCreation page
            await dashboardPage.goToFormCreationPage();

            // now we can call methods of formCreationPage
            await formCreationPage.createForm();
        });

        await test.step("Open created form", async () => {
            formPage = await formCreationPage.openFormPage(page.context());
        });

        await test.step("Verify fields", async () => {
            await formPage.verifyFields();
        });

        await test.step("filling empty fields and error assertion", async () => {
            await formPage.emptyFormSubmitValidation();
        });

        await test.step("filling invalid email and phoneNumber and error assertion", async () => {
            await formPage.invalidEmailAndPhoneNumber({
                email: "invalid.com",
                phoneNumber: "123",
                name: { firstName, lastName }
            });
        });

        await test.step("Valid credentials and successful submit", async () => {
            await formPage.validDetailsAndVerify({
                email: email,
                phoneNumber: validPhone,
                name: { firstName, lastName }
            });
        });

        await test.step('Verify Thank you and close form page', async () => {
            await formPage.verifyThankYouOnPage();
        })

        await test.step('Verify submitted response', async () => {
            await formCreationPage.verifySubmission({
                name: `${firstName} ${lastName}`,
                email: email,
                phoneNumber: validPhone
            });

            await formPage.page.close();
        })


        await test.step('delete form' , async() => {
            await formCreationPage.deleteForm();
        })
    });
});