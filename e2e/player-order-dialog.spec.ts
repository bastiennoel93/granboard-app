import { test, expect } from '@playwright/test';

test.describe('Player Order Dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to cricket setup and add players
    await page.goto('/cricket');

    const nameInput = page.getByTestId('player-name-input');

    // Add three players
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    await nameInput.fill('Charlie');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Charlie')).toBeVisible();

    // Start game to trigger order dialog
    await page.getByTestId('start-game-button').click();
  });

  test('should display player order dialog with all options', async ({ page }) => {
    // Verify all four options are visible
    await expect(page.getByTestId('order-random-button')).toBeVisible();
    await expect(page.getByTestId('order-throw-button')).toBeVisible();
    await expect(page.getByTestId('order-manual-button')).toBeVisible();
    await expect(page.getByTestId('order-current-button')).toBeVisible();
  });

  test('should start game with random order', async ({ page }) => {
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/cricket\/game/);
    await expect(page.getByRole('heading', { name: /CRICKET/i })).toBeVisible();
  });

  test('should start game with current order', async ({ page }) => {
    await page.getByTestId('order-current-button').click();
    await page.waitForURL(/\/cricket\/game/);

    // First player should be Alice (first added)
    const currentPlayerName = await page.locator('h2 span.text-accent').textContent();
    expect(currentPlayerName).toBe('Alice');
  });

  test('should display and use manual order interface', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Verify manual order interface
    await expect(page.locator('h2:has-text("Ordre manuel")').or(page.locator('h2:has-text("Manual Order")'))).toBeVisible();

    // Verify players are listed
    const reorderList = page.locator('.space-y-3');
    await expect(reorderList.locator('text=Alice').first()).toBeVisible();
    await expect(reorderList.locator('text=Bob').first()).toBeVisible();
    await expect(reorderList.locator('text=Charlie').first()).toBeVisible();

    // Move Bob up to first position
    const bobRow = reorderList.locator('.flex.items-center.justify-between').filter({ hasText: 'Bob' }).filter({ hasText: '2' });
    const upButton = bobRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-up"]') }).first();
    await upButton.click();

    // Confirm order
    const confirmButton = page.locator('button').filter({ has: page.locator('svg[data-icon="check"]') });
    await confirmButton.click();

    await page.waitForURL(/\/cricket\/game/);

    // First player should be Bob
    const currentPlayerName = await page.locator('h2 span.text-accent').textContent();
    expect(currentPlayerName).toBe('Bob');
  });
});
