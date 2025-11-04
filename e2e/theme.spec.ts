import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should default to system theme on first visit', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-button').click();
    await expect(page.getByTestId('settings-dialog')).toBeVisible();

    // Check that system theme button appears selected (has accent background)
    const systemButton = page.locator('button:has-text("Système")').or(page.locator('button:has-text("System")'));
    await expect(systemButton).toHaveClass(/bg-accent/);
  });

  test('should switch to light theme', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-button').click();
    await expect(page.getByTestId('settings-dialog')).toBeVisible();

    // Click light theme button
    const lightButton = page.locator('button').filter({ has: page.locator('svg[data-icon="sun"]') }).first();
    await lightButton.click();

    // Verify theme is applied (no dark class on html)
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Verify button shows as selected
    await expect(lightButton).toHaveClass(/bg-amber-500/);
  });

  test('should switch to dark theme', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-button').click();
    await expect(page.getByTestId('settings-dialog')).toBeVisible();

    // Click dark theme button
    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();

    // Verify theme is applied (dark class on html)
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    // Verify button shows as selected
    await expect(darkButton).toHaveClass(/bg-slate-600/);
  });

  test('should persist theme selection after page refresh', async ({ page }) => {
    await page.goto('/');

    // Open settings and select dark theme
    await page.getByTestId('settings-button').click();
    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();

    // Close settings
    await page.getByTestId('settings-close-button').click();

    // Refresh page
    await page.reload();

    // Verify dark theme is still applied
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test('should persist theme across navigation', async ({ page }) => {
    await page.goto('/');

    // Open settings and select light theme
    await page.getByTestId('settings-button').click();
    const lightButton = page.locator('button').filter({ has: page.locator('svg[data-icon="sun"]') }).first();
    await lightButton.click();
    await page.getByTestId('settings-close-button').click();

    // Navigate to cricket page
    await page.getByTestId('game-card-cricket').click();
    await expect(page).toHaveURL(/\/cricket/);

    // Verify light theme is still applied
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
  });

  test('should not flash wrong theme on page load', async ({ page }) => {
    // Set dark theme
    await page.goto('/');
    await page.getByTestId('settings-button').click();
    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();
    await page.getByTestId('settings-close-button').click();

    // Create a promise that rejects if light theme is detected
    const themeFlashDetector = page.evaluate(() => {
      return new Promise((resolve, reject) => {
        const observer = new MutationObserver(() => {
          if (!document.documentElement.classList.contains('dark')) {
            reject(new Error('Theme flash detected: light theme shown'));
          }
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class']
        });

        // Stop observing after 500ms
        setTimeout(() => {
          observer.disconnect();
          resolve(true);
        }, 500);
      });
    });

    // Reload and check for theme flash
    await Promise.all([
      page.reload(),
      themeFlashDetector
    ]);

    // Verify dark theme is applied
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test('should apply correct colors in light mode', async ({ page }) => {
    await page.goto('/');

    // Set light theme
    await page.getByTestId('settings-button').click();
    const lightButton = page.locator('button').filter({ has: page.locator('svg[data-icon="sun"]') }).first();
    await lightButton.click();
    await page.getByTestId('settings-close-button').click();

    // Verify background color is light
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Light mode should have a light background (rgb values close to 255)
    expect(backgroundColor).toMatch(/rgb\(24[0-9], 25[0-9], 25[0-9]\)/);
  });

  test('should apply correct colors in dark mode', async ({ page }) => {
    await page.goto('/');

    // Set dark theme
    await page.getByTestId('settings-button').click();
    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();
    await page.getByTestId('settings-close-button').click();

    // Verify background color is dark
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Dark mode should have a dark background (rgb values close to 0-50)
    expect(backgroundColor).toMatch(/rgb\([0-5][0-9], [0-5][0-9], [0-5][0-9]\)/);
  });

  test('should show correct theme icon in settings based on selection', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-button').click();

    // Initially should show system icon (desktop)
    let themeLabel = page.locator('label').filter({ hasText: /Thème|Theme/ }).first();
    await expect(themeLabel.locator('svg[data-icon="desktop"]')).toBeVisible();

    // Switch to light
    const lightButton = page.locator('button').filter({ has: page.locator('svg[data-icon="sun"]') }).first();
    await lightButton.click();

    // Close and reopen settings
    await page.getByTestId('settings-close-button').click();
    await page.getByTestId('settings-button').click();

    // Should now show sun icon
    themeLabel = page.locator('label').filter({ hasText: /Thème|Theme/ }).first();
    await expect(themeLabel.locator('svg[data-icon="sun"]')).toBeVisible();

    // Switch to dark
    const darkButton = page.locator('button').filter({ has: page.locator('svg[data-icon="moon"]') }).first();
    await darkButton.click();

    // Close and reopen settings
    await page.getByTestId('settings-close-button').click();
    await page.getByTestId('settings-button').click();

    // Should now show moon icon
    themeLabel = page.locator('label').filter({ hasText: /Thème|Theme/ }).first();
    await expect(themeLabel.locator('svg[data-icon="moon"]')).toBeVisible();
  });
});
