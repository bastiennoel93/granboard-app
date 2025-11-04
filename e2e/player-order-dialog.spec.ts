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
    // Verify dialog is visible
    await expect(page.locator('h2:has-text("Choisir l\'ordre des joueurs")').or(page.locator('h2:has-text("Choose Player Order")'))).toBeVisible();

    // Verify all four options are visible
    await expect(page.getByTestId('order-random-button')).toBeVisible();
    await expect(page.getByTestId('order-throw-button')).toBeVisible();
    await expect(page.getByTestId('order-manual-button')).toBeVisible();
    await expect(page.getByTestId('order-current-button')).toBeVisible();
  });

  test('should close dialog with X button', async ({ page }) => {
    // Click X button
    const closeButton = page.locator('button').filter({ has: page.locator('svg[data-icon="xmark"]') }).first();
    await closeButton.click();

    // Verify dialog is closed (back to setup page)
    await expect(page).toHaveURL(/\/cricket$/);
  });

  test('should start game with random order', async ({ page }) => {
    await page.getByTestId('order-random-button').click();

    // Should navigate to game page
    await page.waitForURL(/\/cricket\/game/);
    await expect(page.getByRole('heading', { name: /CRICKET/i })).toBeVisible();

    // Verify a player name is displayed
    await expect(page.locator('h2 span.text-accent')).toBeVisible();
  });

  test('should start game with current order', async ({ page }) => {
    await page.getByTestId('order-current-button').click();

    // Should navigate to game page
    await page.waitForURL(/\/cricket\/game/);
    await expect(page.getByRole('heading', { name: /CRICKET/i })).toBeVisible();

    // First player should be Alice (first added)
    const currentPlayerName = await page.locator('h2 span.text-accent').textContent();
    expect(currentPlayerName).toBe('Alice');
  });

  test('should display manual order interface', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Verify manual order title is visible
    await expect(page.locator('h2:has-text("Ordre manuel")').or(page.locator('h2:has-text("Manual Order")'))).toBeVisible();

    // Verify all three players are listed with order numbers in the reorder list
    await expect(page.locator('.space-y-3').locator('text=Alice').first()).toBeVisible();
    await expect(page.locator('.space-y-3').locator('text=Bob').first()).toBeVisible();
    await expect(page.locator('.space-y-3').locator('text=Charlie').first()).toBeVisible();

    // Verify up/down arrows are present
    await expect(page.locator('svg[data-icon="arrow-up"]').first()).toBeVisible();
    await expect(page.locator('svg[data-icon="arrow-down"]').first()).toBeVisible();
  });

  test('should move player up in manual order', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Find Bob's row (position 2) and click up button
    const reorderList = page.locator('.space-y-3');
    const bobRow = reorderList.locator('.flex.items-center.justify-between').filter({ hasText: 'Bob' }).filter({ hasText: '2' });
    const upButton = bobRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-up"]') }).first();
    await upButton.click();

    // Verify new order
    await page.waitForTimeout(200);
    const rows = await reorderList.locator('.flex.items-center.justify-between').all();
    expect(await rows[0].textContent()).toContain('Bob');
    expect(await rows[1].textContent()).toContain('Alice');
    expect(await rows[2].textContent()).toContain('Charlie');
  });

  test('should move player down in manual order', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Find Alice's row (position 1) and click down button
    const reorderList = page.locator('.space-y-3');
    const aliceRow = reorderList.locator('.flex.items-center.justify-between').filter({ hasText: 'Alice' }).filter({ hasText: '1' });
    const downButton = aliceRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-down"]') }).first();
    await downButton.click();

    // Verify new order
    await page.waitForTimeout(200);
    const rows = await reorderList.locator('.flex.items-center.justify-between').all();
    expect(await rows[0].textContent()).toContain('Bob');
    expect(await rows[1].textContent()).toContain('Alice');
    expect(await rows[2].textContent()).toContain('Charlie');
  });

  test('should disable up arrow for first player', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // First player's up button should be disabled
    const reorderList = page.locator('.space-y-3');
    const firstPlayerRow = reorderList.locator('.flex.items-center.justify-between').first();
    const upButton = firstPlayerRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-up"]') }).first();
    await expect(upButton).toBeDisabled();
  });

  test('should disable down arrow for last player', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Last player's down button should be disabled
    const reorderList = page.locator('.space-y-3');
    const lastPlayerRow = reorderList.locator('.flex.items-center.justify-between').last();
    const downButton = lastPlayerRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-down"]') }).first();
    await expect(downButton).toBeDisabled();
  });

  test('should confirm manual order and start game', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Reorder: move Bob to first position
    const reorderList = page.locator('.space-y-3');
    const bobRow = reorderList.locator('.flex.items-center.justify-between').filter({ hasText: 'Bob' }).filter({ hasText: '2' });
    const upButton = bobRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-up"]') }).first();
    await upButton.click();

    await page.waitForTimeout(200);

    // Confirm order
    const confirmButton = page.locator('button').filter({ has: page.locator('svg[data-icon="check"]') });
    await confirmButton.click();

    // Should navigate to game page
    await page.waitForURL(/\/cricket\/game/);

    // First player should be Bob (as we reordered)
    const currentPlayerName = await page.locator('h2 span.text-accent').textContent();
    expect(currentPlayerName).toBe('Bob');
  });

  test('should go back from manual order to main dialog', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    // Click back arrow
    const backButton = page.locator('button').filter({ has: page.locator('svg[data-icon="arrow-left"]') });
    await backButton.click();

    // Should be back at main order dialog
    await expect(page.getByTestId('order-random-button')).toBeVisible();
    await expect(page.getByTestId('order-throw-button')).toBeVisible();
    await expect(page.getByTestId('order-manual-button')).toBeVisible();
    await expect(page.getByTestId('order-current-button')).toBeVisible();
  });

  test('should display throw for order option', async ({ page }) => {
    // Verify throw for order button exists and has correct icon
    const throwButton = page.getByTestId('order-throw-button');
    await expect(throwButton).toBeVisible();
    await expect(throwButton.locator('svg[data-icon="bullseye"]')).toBeVisible();
  });

  test('should close dialog when selecting throw for order', async ({ page }) => {
    await page.getByTestId('order-throw-button').click();

    // Should close dialog and return to setup page (throw for order implementation TBD)
    await expect(page).toHaveURL(/\/cricket$/);
  });

  test('should display correct descriptions for all options', async ({ page }) => {
    // Random order description
    await expect(page.getByTestId('order-random-button')).toContainText(/aléatoire|random/i);

    // Throw for order description
    await expect(page.getByTestId('order-throw-button')).toContainText(/lancer|throw|bull/i);

    // Manual order description
    await expect(page.getByTestId('order-manual-button')).toContainText(/manuel|manual|personnalisé|custom/i);

    // Current order description
    await expect(page.getByTestId('order-current-button')).toContainText(/actuel|current|ajout|addition/i);
  });

  test('should handle multiple reorderings in manual mode', async ({ page }) => {
    await page.getByTestId('order-manual-button').click();

    const reorderList = page.locator('.space-y-3');

    // Move Charlie (3) to position 1 - click up twice
    let charlieRow = reorderList.locator('.flex.items-center.justify-between').filter({ hasText: 'Charlie' }).filter({ hasText: '3' });
    let upButton = charlieRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-up"]') }).first();
    await upButton.click(); // Charlie is now 2
    await page.waitForTimeout(200);

    charlieRow = reorderList.locator('.flex.items-center.justify-between').filter({ hasText: 'Charlie' }).filter({ hasText: '2' });
    upButton = charlieRow.locator('button').filter({ has: page.locator('svg[data-icon="arrow-up"]') }).first();
    await upButton.click(); // Charlie is now 1
    await page.waitForTimeout(200);

    // Verify final order: Charlie, Alice, Bob
    const rows = await reorderList.locator('.flex.items-center.justify-between').all();
    expect(await rows[0].textContent()).toContain('Charlie');
    expect(await rows[1].textContent()).toContain('Alice');
    expect(await rows[2].textContent()).toContain('Bob');

    // Confirm and verify Charlie starts
    const confirmButton = page.locator('button').filter({ has: page.locator('svg[data-icon="check"]') });
    await confirmButton.click();

    await page.waitForURL(/\/cricket\/game/);
    const currentPlayerName = await page.locator('h2 span.text-accent').textContent();
    expect(currentPlayerName).toBe('Charlie');
  });
});
