import { test } from "@fixtures";
import FormPage from "@poms/form/form";
import { CREATE_FORM_SELECTORS } from "@selectors";

test.describe("Form Features", () => {
  let formPage: FormPage;

  test.beforeEach(async ({ dashboardPage, formCreationPage }) => {
    // from dashboard go to formCreation page
    await dashboardPage.goToFormCreationPage();

    // now click on create form
    await formCreationPage.buildTab.createForm();
  });

  // clear the created forms
  test.afterEach(async ({ formCreationPage }) => {
    await test.step("Cleanup: Delete form", async () =>
      formCreationPage.buildTab.deleteForm());
  });

  test("Conditional logic", async ({ formCreationPage }) => {

    await test.step("Delete Email Element", async () => {
      await formCreationPage.buildTab.openEmailDetailsDropdown();
      await formCreationPage.buildTab.deleteEmailElement();
    });

    await test.step("Add single choice with element only two options", async () => {
      // click add element button
      await formCreationPage.buildTab.clickAddElementButton();
      await formCreationPage.buildTab.addSingleChoiceElement();
      await formCreationPage.buildTab.verifyLoadingSpinnerInvisible();
      // add pointer to first question
      const questionBlock = formCreationPage.page
        .getByTestId(CREATE_FORM_SELECTORS.formGroupQuestion)
        .nth(0);
      // question should be visible
      await questionBlock.waitFor({ state: "visible" });
      await questionBlock.scrollIntoViewIfNeeded();
      // click on question to open settings page
      await questionBlock.click();

      await formCreationPage.buildTab.verifyAddOptionButtonVisible();

      await formCreationPage.buildTab.checkOptionVisible(4);
      await formCreationPage.buildTab.clickOption(4);
      await formCreationPage.buildTab.deleteOptionButtonVisible(4);
      await formCreationPage.buildTab.deleteOption(4);
      await formCreationPage.buildTab.checkOptionHidden(4);

      await formCreationPage.buildTab.checkOptionVisible(3);
      await formCreationPage.buildTab.clickOption(3);
      await formCreationPage.buildTab.deleteOptionButtonVisible(3);
      await formCreationPage.buildTab.deleteOption(3);
      await formCreationPage.buildTab.checkOptionHidden(3);
    });

    await test.step("Add Email Element", () =>
      formCreationPage.buildTab.addEmailElement());

    await test.step("Open settings tab", () =>
      formCreationPage.openSettingsTab());

    await test.step("Open conditional logic card", () =>
      formCreationPage.settingsTab.openConditionalLogicCard());

    await test.step("Add email dependency over option 1 of single choice", async () => {
      await formCreationPage.settingsTab.addNewCondition();
      await formCreationPage.settingsTab.verifySelectValueContainerFieldVisibleInCondition();
      await formCreationPage.settingsTab.openDependencyFromSelectValueContainerFieldInCondition();
      await formCreationPage.settingsTab.selectQuestionAsDependencyFromSelectValueContainerFieldInCondition();
      await formCreationPage.settingsTab.openVerbSelectValueContainerFieldInCondition();
      await formCreationPage.settingsTab.selectIsEqualToVerbInSelectValueContainerFieldInCondition();
      await formCreationPage.settingsTab.openDependencyValueContainerInCondition();
      await formCreationPage.settingsTab.selectOptionOneAsDependencyValueInCondition();
      await formCreationPage.settingsTab.openActionInputFieldInContainerInCondition();
      await formCreationPage.settingsTab.selectShowActionInCondition();
      await formCreationPage.settingsTab.openConditionResultInContainerInCondition();
      await formCreationPage.settingsTab.selectEmailAsConditionalResult();
      await formCreationPage.settingsTab.saveFormChangesButton();
      await formCreationPage.settingsTab.verifySaveChangesButtonHidden();
    });

    await test.step("Publish form", () => formCreationPage.buildTab.publishForm());

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.buildTab.openFormPage();
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
      await formCreationPage.settingsTab.openConditionalLogicDropdown();
      await formCreationPage.settingsTab.disableConditionalLogic();
    });

    await test.step("Open form page", async () => {
      formPage = await formCreationPage.buildTab.openFormPage();
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
