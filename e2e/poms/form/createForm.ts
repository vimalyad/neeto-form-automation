import { Page } from "@playwright/test";
import { AnalyticsTab, BuildTab, SettingsTab } from "./tabs";
import { SubmissionsTab } from "./tabs/submissionTab";

export default class FormCreationPage {

  public buildTab: BuildTab;
  public settingsTab: SettingsTab;
  public analyticsTab: AnalyticsTab;
  public submissionsTab: SubmissionsTab;

  constructor(public page: Page) {
    this.buildTab = new BuildTab(page);
  }

  openSubmissionsTab = async () => {
    this.submissionsTab = new SubmissionsTab(this.page);
    this.submissionsTab.openSubmissionsTab();
  };

  openAnalyticsTab = async () => {
    this.analyticsTab = new AnalyticsTab(this.page);
    this.analyticsTab.openAnalyticsTab();
  };

  openSettingsTab = async () => {
    this.settingsTab = new SettingsTab(this.page);
    this.settingsTab.openSettingsTab();
  };
}
