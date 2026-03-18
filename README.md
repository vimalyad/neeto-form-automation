## This repo is just for practice of automation of some of NeetoForm features and learning of playwright using typescript.

## Fixtures
- It is like setting up a environment for your test case
- Setup: In this we set up things which our test may use like visiting a page , firing up dummy database or anything.
- Teardown: Once the test has run , we need to clean up things like closing page etc.

```
page : async ({page} , use) => {
    await page.goto("/");  // -> setup
    await use(page); // -> use
    await page.close(); // -> teardown
}
```

## waitForLoadState('domcontentloaded')
- It tells playwright to wait until the raw HTML gets fully loaded , but not wait for all extra heavy stuff like images , stylesheets etc to finish downloading
- So we should in those cases only , where we care for the only for HTML not for heavy stuffs

## waitForLoadState('load')
- The DOM is fully loaded with heavy stuffs like images , resources

## waitForLoadState('networkIdle')
- The page has stopped making network requests 
- without this we sometimes click on buttons whose logic may have not been completely loaded


## waitForEvent('page')
- It is for catching event opening of new window / page in our entire browser session


## waitForEvent('popup)
- It is for catching a new tab which is being created by a specific page



## Sync in fs
- They stop the current thread and wait for completion then proceeds while fs.access , fs.unlink these are ran in background without stopping the main thread


## Page Creation
- When asking new page from same browser context we get page with same shared state
- When creating new context , then asking new page from it we get completely new page with no shared state