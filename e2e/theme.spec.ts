import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should switch to light theme', async ({ page }) => {
    // Navigate to a game page where settings are available
    await page.goto('/cricket');
    await page.getByTestId('settings-button').click();

    const lightButton = page.locator('button').filter({ has: page.locator('svg[data-icon="sun"]') }).first();
    await lightButton.click();

    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
  });

  test('should switch to dark theme', async ({ page }) => {
    // Navigate to a game page where settings are available
    await page.goto('/cricket');
    await page.getByTestId('settings-button').click();

    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();

    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test('should persist theme selection after page refresh', async ({ page }) => {
    // Navigate to a game page where settings are available
    await page.goto('/cricket');
    await page.getByTestId('settings-button').click();

    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();
    await page.getByTestId('settings-close-button').click();

    await page.reload();

    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });
});
