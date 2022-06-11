import { test, expect } from '@playwright/test';

test.describe('duckduckgo tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://duckduckgo.com/');
    await page
      .locator('[placeholder="Search the web without being tracked"]')
      .fill('michael jordan');
    await Promise.all([
      page.waitForNavigation(),
      page
        .locator('[placeholder="Search the web without being tracked"]')
        .press('Enter'),
    ]);
  });

  test('Verify A picture of Michael Jordan is displayed in the search results page', async ({
    page,
  }) => {
    expect(
      await page
        .locator('text=Michael JordanMichael Jeffrey Jordan >> img >> nth=0')
        .screenshot()
    ).toMatchSnapshot('test-data/mj-photo.png');
  });
  test('verify There is at least one wikipedia page results', async ({
    page,
  }) => {
    expect(
      await page.$eval(
        'a:has-text("Michael Jordan - Wikipedia")',
        (el: HTMLLinkElement) => el.href
      )
    ).toBe('https://en.wikipedia.org/wiki/Michael_Jordan');
  });
  test('verify  There is at least one nba.com page result', async ({
    page,
  }) => {
    await page.locator('text=More results').click();
    await page.waitForSelector('text=Michael Jordan | Chicago Bulls | NBA.com');
    expect(
      await page.$eval(
        'a:has-text("Michael Jordan | Chicago Bulls | NBA.com")',
        (el: HTMLLinkElement) => el.href
      )
    ).toBe('https://www.nba.com/player/893');
  });
  test('change the theme to terminal', async ({ page }) => {
    await page.locator('text=⇶').click();
    await Promise.all([
      page.waitForNavigation(),
      page.locator('text=Themes').click(),
    ]);
    await page.locator('text=Terminal').click();
    await Promise.all([
      page.waitForNavigation(),
      page.locator('text=Save and Exit').click(),
    ]);
  });
});
