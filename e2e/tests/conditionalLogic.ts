import { test } from "@fixtures";
import FormPage from "@poms/form/form";
import { CREATE_FORM_SELECTORS } from "@selectors";

test.describe("Form Features", () => {
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

  test("Conditional logic", async ({ formCreationPage, page }) => {
    test.setTimeout(60000);

    await test.step("Delete Email Element", async () => {
      await formCreationPage.openEmailDetailsDropdown();
      await formCreationPage.deleteEmailElement();
    });

    await test.step("Add single choice with element only two options", async () => {
      // click add element button
      await formCreationPage.clickAddElementButton();
      await formCreationPage.addSingleChoiceElement();
      await formCreationPage.verifyLoadingSpinnerInvisible();
      // add pointer to first question
      const questionBlock = formCreationPage.page
        .getByTestId(CREATE_FORM_SELECTORS.formGroupQuestion)
        .nth(0);
      // question should be visible
      await questionBlock.waitFor({ state: "visible" });
      await questionBlock.scrollIntoViewIfNeeded();
      // click on question to open settings page
      await questionBlock.click();

      await formCreationPage.verifyAddOptionButtonVisible();

      await formCreationPage.checkOptionVisible(4);
      await formCreationPage.clickOption(4);
      await formCreationPage.deleteOptionButtonVisible(4);
      await formCreationPage.deleteOption(4);
      await formCreationPage.checkOptionHidden(4);

      await formCreationPage.checkOptionVisible(3);
      await formCreationPage.clickOption(3);
      await formCreationPage.deleteOptionButtonVisible(3);
      await formCreationPage.deleteOption(3);
      await formCreationPage.checkOptionHidden(3);
    });

    await test.step("Add Email Element", () =>
      formCreationPage.addEmailElement());

    await test.step("Open settings tab", () =>
      formCreationPage.openSettingsTab());

    await test.step("Open conditional logic card", () =>
      formCreationPage.openConditionalLogicCard());

    await test.step("Add email dependency over option 1 of single choice", async () => {
      await formCreationPage.addNewCondition();
      await formCreationPage.verifySelectValueContainerFieldVisibleInCondition();
      await formCreationPage.openDependencyFromSelectValueContainerFieldInCondition();
      await formCreationPage.selectQuestionAsDependencyFromSelectValueContainerFieldInCondition();
      await formCreationPage.openVerbSelectValueContainerFieldInCondition();
      await formCreationPage.selectIsEqualToVerbInSelectValueContainerFieldInCondition();
      await formCreationPage.openDependencyValueContainerInCondition();
      await formCreationPage.selectOptionOneAsDependencyValueInCondition();
      await formCreationPage.openActionInputFieldInContainerInCondition();
      await formCreationPage.selectShowActionInCondition();
      await formCreationPage.openConditionResultInContainerInCondition();
      await formCreationPage.selectEmailAsConditionalResult();
      await formCreationPage.saveFormChangesButton();
      await formCreationPage.verifySaveChangesButtonHidden();
    });

    await test.step("Publish form", () => formCreationPage.publishForm());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage();
    });

    await test.step("Check email dependency of Email on Option 1 of single choice", async () => {
      await formPage.verifyMultipleChoiceQuestionVisible();
      await formPage.verifyEmailNotInPage();
      await formPage.selectOptionOfMultipleChoiceQuestion(2);
      await formPage.verifyEmailNotInPage();
      await formPage.selectOptionOfMultipleChoiceQuestion(1);
      await formPage.verifyEmailFieldExist();
    });

    await test.step("Close form page", () => formPage.page.close());

    await test.step("Remove email dependency", async () => {
      await formCreationPage.openConditionalLogicDropdown();
      await formCreationPage.disableConditionalLogic();
    });

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.openFormPage();
    });

    await test.step("Check email has no dependency", async () => {
      await formPage.verifyMultipleChoiceQuestionVisible();
      await formPage.verifyEmailFieldExist();
      await formPage.selectOptionOfMultipleChoiceQuestion(2);
      await formPage.verifyEmailFieldExist();
      await formPage.selectOptionOfMultipleChoiceQuestion(1);
      await formPage.verifyEmailFieldExist();
    });

    await test.step("Close form page", () => formPage.page.close());
  });
});
