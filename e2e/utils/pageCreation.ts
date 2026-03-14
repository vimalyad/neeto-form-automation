import { Browser, Page } from "@playwright/test";

export async function getNewPageWithCleanContext(
  browser: Browser,
): Promise<Page> {
  const newContext = await browser.newContext();

  const newPage = await newContext.newPage();

  await newPage.context().clearCookies();

  return newPage;
}
