import { test, expect } from '@playwright/test';

test.describe('Cricket Cut-Throat Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cricket');
  });

  test('should select Cut-Throat mode', async ({ page }) => {
    // Verify Cut-Throat mode button is visible
    await expect(page.getByTestId('game-mode-cutthroat')).toBeVisible();

    // Click Cut-Throat mode
    await page.getByTestId('game-mode-cutthroat').click();

    // Verify it's selected (should have green border)
    await expect(page.getByTestId('game-mode-cutthroat')).toHaveClass(/border-red-500/);
  });

  test('should display Cut-Throat mode description', async ({ page }) => {
    // Click Cut-Throat mode
    await page.getByTestId('game-mode-cutthroat').click();

    // Verify description is visible
    const cutthroatButton = page.getByTestId('game-mode-cutthroat');
    await expect(cutthroatButton).toContainText(/adversaires|opponents|ennemis|enemies/i);
  });

  test('should start Cut-Throat game with multiple players', async ({ page }) => {
    // Add three players (Cut-Throat requires at least 2)
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    await nameInput.fill('Charlie');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Charlie')).toBeVisible();

    // Select Cut-Throat mode
    await page.getByTestId('game-mode-cutthroat').click();

    // Start game
    await page.getByTestId('start-game-button').click();

    // Handle player order dialog
    await page.getByTestId('order-random-button').click();

    // Should navigate to game page
    await page.waitForURL(/\/cricket\/game/);
    await expect(page.getByRole('heading', { name: /CRICKET/i })).toBeVisible();
  });

  test('should display all players in Cut-Throat scoreboard', async ({ page }) => {
    // Setup game with three players in Cut-Throat mode
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Charlie');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // Verify all three players are in the scoreboard using data-testid
    await expect(page.getByTestId('scoreboard-player-Alice')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Bob')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Charlie')).toBeVisible();
  });

  test('should show points for all players in Cut-Throat', async ({ page }) => {
    // Setup Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // In Cut-Throat, both players should be visible in scoreboard
    // Points are given TO opponents, so lower score is better
    await expect(page.getByTestId('scoreboard-player-Alice')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Bob')).toBeVisible();
  });

  test('should navigate between players in Cut-Throat mode', async ({ page }) => {
    // Setup Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // Get first player
    const firstPlayer = await page.locator('h2 span.text-accent').textContent();

    // Click next player button
    await page.getByTestId('next-player-button').click();
    await page.waitForTimeout(500);

    // Should show different player
    const secondPlayer = await page.locator('h2 span.text-accent').textContent();
    expect(secondPlayer).not.toBe(firstPlayer);
  });

  test('should display Cut-Throat visual styling', async ({ page }) => {
    // Setup Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();

    // Verify Cut-Throat button has red styling
    const cutthroatButton = page.getByTestId('game-mode-cutthroat');
    await expect(cutthroatButton).toHaveClass(/border-red-500/);
    await expect(cutthroatButton).toHaveClass(/bg-red-100|bg-red-900/);
  });

  test('should switch from Standard to Cut-Throat mode', async ({ page }) => {
    // Initially select Standard
    await page.getByTestId('game-mode-standard').click();
    await expect(page.getByTestId('game-mode-standard')).toHaveClass(/border-green-500/);

    // Switch to Cut-Throat
    await page.getByTestId('game-mode-cutthroat').click();

    // Verify Cut-Throat is now selected
    await expect(page.getByTestId('game-mode-cutthroat')).toHaveClass(/border-red-500/);

    // Verify Standard is no longer selected
    await expect(page.getByTestId('game-mode-standard')).not.toHaveClass(/border-green-500/);
  });

  test('should maintain Cut-Throat selection when adding players', async ({ page }) => {
    // Select Cut-Throat first
    await page.getByTestId('game-mode-cutthroat').click();

    // Add players
    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    // Verify Cut-Throat is still selected
    await expect(page.getByTestId('game-mode-cutthroat')).toHaveClass(/border-red-500/);
  });

  test('should show all cricket numbers in Cut-Throat scoreboard', async ({ page }) => {
    // Setup Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // Verify all cricket numbers are displayed
    const cricketNumbers = ['15', '16', '17', '18', '19', '20', 'Bull'];
    for (const num of cricketNumbers) {
      await expect(page.getByTestId(`cricket-number-${num}`)).toBeVisible();
    }
  });

  test('should allow quitting Cut-Throat game', async ({ page }) => {
    // Setup and start Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // Open settings and quit
    await page.getByTestId('settings-button').click();
    await page.getByTestId('quit-button').click();

    // Should return to home
    await expect(page).toHaveURL('/');
  });

  test('should start new Cut-Throat game from settings', async ({ page }) => {
    // Setup and start Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // Open settings and start new game
    await page.getByTestId('settings-button').click();
    await page.getByTestId('new-game-button').click();

    // Should return to cricket setup
    await expect(page).toHaveURL(/\/cricket$/);
  });

  test('should display Cut-Throat legend correctly', async ({ page }) => {
    // Setup Cut-Throat game
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();

    await page.getByTestId('game-mode-cutthroat').click();
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/cricket\/game/);

    // Open legend
    await page.getByTestId('legend-button').click();
    await expect(page.getByTestId('legend-dialog')).toBeVisible();

    // Verify legend explains marks (should be same as Standard)
    await expect(page.getByTestId('legend-dialog')).toContainText(/marque|mark/i);

    // Close legend
    await page.getByTestId('legend-close-button').click();
  });
});
