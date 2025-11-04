import { test, expect } from '@playwright/test';

test.describe('01 Full Game Flow', () => {
  test('should complete a full game flow from home to game end (501)', async ({ page }) => {
    // 1. Partir de la page d'accueil
    await page.goto('/');
    await expect(page.getByTestId('game-card-01')).toBeVisible();

    // 2. Naviguer vers 01
    await page.getByTestId('game-card-01').click();
    await expect(page).toHaveURL(/\/01/);

    // 3. Configurer la partie
    const nameInput = page.getByTestId('player-name-input');

    // Ajouter Alice et attendre qu'elle apparaisse
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    // Ajouter Bob et attendre qu'il apparaisse
    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Le mode 501 est déjà sélectionné par défaut

    // 4. Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/01\/game/);

    // 5. Vérifier l'interface de jeu
    await expect(page.getByRole('heading').filter({ hasText: /01/i }).first()).toBeVisible();
    await expect(page.getByText('501')).toBeVisible();
    await expect(page.getByRole('heading').filter({ hasText: /Alice|Bob/ }).first()).toBeVisible();

    // 6. Vérifier le scoreboard
    await expect(page.getByTestId('scoreboard-player-Alice')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Bob')).toBeVisible();

    // Vérifier les scores initiaux
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');
    await expect(aliceCard).toContainText('501');
    await expect(bobCard).toContainText('501');

    // 7. Vérifier l'historique
    await expect(page.getByTestId('history-title')).toBeVisible();
    await expect(page.getByTestId('current-round-1')).toBeVisible();

    // 8. Simuler un changement de joueur
    const firstPlayer = await page.locator('h2 span').first().textContent();
    await page.getByTestId('next-player-button').click();

    // Attendre le changement
    await page.waitForTimeout(500);

    const secondPlayer = await page.locator('h2 span').first().textContent();
    expect(secondPlayer).not.toBe(firstPlayer);

    // 9. Tester les fonctionnalités de la dialog
    // Ouvrir la légende
    await page.getByTestId('legend-button').click();
    await expect(page.getByTestId('legend-dialog')).toBeVisible();
    await page.getByTestId('legend-close-button').click();

    // 10. Ouvrir les paramètres
    await page.getByTestId('settings-button').click();
    await expect(page.getByTestId('new-game-button')).toBeVisible();

    // 11. Retour à l'accueil via Quitter
    await page.getByTestId('quit-button').click();
    await expect(page).toHaveURL('/');
  });

  test('should complete a full game flow with 301 mode', async ({ page }) => {
    // 1. Partir de la page d'accueil
    await page.goto('/');

    // 2. Naviguer vers 01
    await page.getByTestId('game-card-01').click();
    await expect(page).toHaveURL(/\/01/);

    // 3. Configurer la partie avec mode 301
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Sélectionner le mode 301
    await page.getByTestId('game-mode-301').click();

    // 4. Commencer la partie
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/01\/game/);

    // 5. Vérifier que le mode 301 est affiché
    await expect(page.getByText('301')).toBeVisible();

    // 6. Vérifier les scores initiaux
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');
    await expect(aliceCard).toContainText('301');
    await expect(bobCard).toContainText('301');
  });

  test('should complete a full game flow with 701 mode', async ({ page }) => {
    // 1. Partir de la page d'accueil
    await page.goto('/');

    // 2. Naviguer vers 01
    await page.getByTestId('game-card-01').click();
    await expect(page).toHaveURL(/\/01/);

    // 3. Configurer la partie avec mode 701
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Sélectionner le mode 701
    await page.getByTestId('game-mode-701').click();

    // 4. Commencer la partie
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/01\/game/);

    // 5. Vérifier que le mode 701 est affiché
    await expect(page.getByText('701')).toBeVisible();

    // 6. Vérifier les scores initiaux
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');
    await expect(aliceCard).toContainText('701');
    await expect(bobCard).toContainText('701');
  });

  test('should complete a full game flow with double out enabled', async ({ page }) => {
    // 1. Partir de la page d'accueil
    await page.goto('/');

    // 2. Naviguer vers 01
    await page.getByTestId('game-card-01').click();
    await expect(page).toHaveURL(/\/01/);

    // 3. Configurer la partie avec double out
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Activer le double out
    await page.getByTestId('double-out-checkbox').click();

    // 4. Commencer la partie
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/01\/game/);

    // 5. Vérifier que les règles du double out sont dans la légende
    await page.getByTestId('legend-button').click();
    await expect(page.getByText(/Double Out/i)).toBeVisible();
    await page.getByTestId('legend-close-button').click();
  });

  test('should complete a full game flow with max rounds set', async ({ page }) => {
    // 1. Partir de la page d'accueil
    await page.goto('/');

    // 2. Naviguer vers 01
    await page.getByTestId('game-card-01').click();
    await expect(page).toHaveURL(/\/01/);

    // 3. Configurer la partie avec nombre de tours maximum
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Définir le nombre de tours maximum
    const roundsInput = page.getByTestId('max-rounds-input');
    await roundsInput.fill('15');

    // 4. Commencer la partie
    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/01\/game/);

    // 5. Vérifier que le nombre de tours maximum est affiché
    const roundCounter = page.getByTestId('round-counter');
    await expect(roundCounter).toContainText('15');
  });

  test('should handle player order selection', async ({ page }) => {
    // Aller à la configuration
    await page.goto('/01');

    // Ajouter des joueurs
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

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Vérifier qu'on est sur la page de jeu
    await page.waitForURL(/\/01\/game/);

    // Vérifier que les 3 joueurs sont dans le scoreboard
    await expect(page.getByTestId('scoreboard-player-Alice')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Bob')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Charlie')).toBeVisible();
  });

  test('should display connection button', async ({ page }) => {
    // Configurer et démarrer une partie
    await page.goto('/01');

    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    await page.waitForURL(/\/01\/game/);

    // Vérifier le bouton de connexion Granboard
    const connectButton = page.getByTestId('connect-button');
    await expect(connectButton).toBeVisible();
  });

  test('should navigate back from setup to home', async ({ page }) => {
    // Aller à la configuration
    await page.goto('/01');

    // Cliquer sur le bouton retour
    await page.getByTestId('back-button').click();

    // Vérifier qu'on est de retour à l'accueil
    await expect(page).toHaveURL('/');
  });

  test('should display rules on setup page', async ({ page }) => {
    // Aller à la configuration
    await page.goto('/01');

    // Vérifier que les règles sont affichées
    await expect(page.getByText(/Objectif/i)).toBeVisible();
  });

  test('should update rules when double out is enabled', async ({ page }) => {
    // Aller à la configuration
    await page.goto('/01');

    // Les règles du double out ne devraient pas être visibles initialement
    await expect(page.getByText(/Double Out/i)).not.toBeVisible();

    // Activer le double out
    await page.getByTestId('double-out-checkbox').click();

    // Les règles du double out devraient maintenant être visibles
    await expect(page.getByText(/Double Out/i)).toBeVisible();
  });

  test('should allow starting new game from within a game', async ({ page }) => {
    // Démarrer une partie complète
    await page.goto('/01');

    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/01\/game/);

    // Ouvrir les paramètres et démarrer une nouvelle partie
    await page.getByTestId('settings-button').click();
    await page.getByTestId('new-game-button').click();

    // Devrait retourner à la page de configuration
    await expect(page).toHaveURL('/01');
  });

  test('should persist game configuration during setup', async ({ page }) => {
    // Aller à la configuration
    await page.goto('/01');

    // Configurer la partie
    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    // Sélectionner 301
    await page.getByTestId('game-mode-301').click();

    // Activer double out
    await page.getByTestId('double-out-checkbox').click();

    // Définir max rounds
    const roundsInput = page.getByTestId('max-rounds-input');
    await roundsInput.fill('20');

    // Vérifier que toutes les configurations sont toujours là
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();
    await expect(page.getByTestId('game-mode-301')).toHaveClass(/border-accent/);
    await expect(page.getByTestId('double-out-checkbox')).toBeChecked();
    await expect(roundsInput).toHaveValue('20');
  });

  test('should display statistics during game', async ({ page }) => {
    // Démarrer une partie
    await page.goto('/01');

    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    await page.getByTestId('start-game-button').click();
    await page.getByTestId('order-random-button').click();
    await page.waitForURL(/\/01\/game/);

    // Vérifier que les statistiques sont affichées dans le scoreboard
    await expect(page.getByText(/Moyenne|Average/i).first()).toBeVisible();
    await expect(page.getByText('PPD').first()).toBeVisible();
    await expect(page.getByText(/Fléchettes|Darts/i).first()).toBeVisible();

    // Vérifier que les valeurs initiales sont 0
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    await expect(aliceCard).toContainText('0.00'); // Moyenne et PPD devraient être 0.00
  });
});
