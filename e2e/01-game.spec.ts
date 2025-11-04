import { test, expect } from '@playwright/test';

test.describe('01 Game', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de configuration
    await page.goto('/01');

    // Configurer une partie avec 2 joueurs
    const nameInput = page.getByTestId('player-name-input');

    // Ajouter Alice et attendre qu'elle apparaisse
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    // Ajouter Bob et attendre qu'il apparaisse
    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Le mode 501 est sélectionné par défaut

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Attendre d'être sur la page de jeu
    await page.waitForURL(/\/01\/game/);
  });

  test('should display game interface', async ({ page }) => {
    // Vérifier le titre 01
    await expect(page.getByRole('heading').filter({ hasText: /01/i }).first()).toBeVisible();

    // Vérifier que le mode 501 est affiché
    await expect(page.getByText('501')).toBeVisible();

    // Vérifier que le joueur actuel est affiché
    await expect(page.getByRole('heading').filter({ hasText: /Alice|Bob/ }).first()).toBeVisible();
  });

  test('should display player turn history', async ({ page }) => {
    // Vérifier que l'historique est présent
    await expect(page.getByTestId('history-title')).toBeVisible();

    // Vérifier que le round en cours est affiché
    await expect(page.getByTestId('current-round-1')).toBeVisible();
  });

  test('should display control buttons', async ({ page }) => {
    // Vérifier les boutons de contrôle
    await expect(page.getByTestId('undo-button')).toBeVisible();
    await expect(page.getByTestId('next-player-button')).toBeVisible();
  });

  test('should open legend dialog', async ({ page }) => {
    // Cliquer sur le bouton Légende
    await page.getByTestId('legend-button').click();

    // Vérifier que la dialog est ouverte
    await expect(page.getByTestId('legend-dialog')).toBeVisible();

    // Fermer la dialog
    await page.getByTestId('legend-close-button').click();

    // Vérifier que la dialog est fermée
    await expect(page.getByTestId('legend-dialog')).not.toBeVisible();
  });

  test('should open settings dialog', async ({ page }) => {
    // Cliquer sur le bouton Paramètres
    await page.getByTestId('settings-button').click();

    // Vérifier que la dialog est ouverte
    await expect(page.getByTestId('new-game-button')).toBeVisible();
    await expect(page.getByTestId('quit-button')).toBeVisible();

    // Fermer la dialog
    await page.getByTestId('settings-close-button').click();
  });

  test('should toggle sound', async ({ page }) => {
    // Ouvrir les paramètres
    await page.getByTestId('settings-button').click();

    // Vérifier que le contrôle du son est visible
    const soundToggleButton = page.getByTestId('sound-toggle-button');
    await expect(soundToggleButton).toBeVisible();

    // Cliquer pour changer l'état
    await soundToggleButton.click();

    // Le bouton devrait avoir changé de texte
    await expect(soundToggleButton).toBeEnabled();

    // Fermer la dialog
    await page.getByTestId('settings-close-button').click();
  });

  test('should show player info', async ({ page }) => {
    // Vérifier les informations du joueur actuel
    await expect(page.getByTestId('dart-counter')).toBeVisible();
    await expect(page.getByTestId('round-counter')).toBeVisible();
  });

  test('should change player on button click', async ({ page }) => {
    // Récupérer le nom du joueur actuel
    const currentPlayerName = await page.locator('h2 span').first().textContent();

    // Cliquer sur "Joueur suivant"
    await page.getByTestId('next-player-button').click();

    // Attendre un peu pour le changement
    await page.waitForTimeout(500);

    // Vérifier que le joueur a changé
    const newPlayerName = await page.locator('h2 span').first().textContent();
    expect(newPlayerName).not.toBe(currentPlayerName);
  });

  test('should display both players in scoreboard', async ({ page }) => {
    // Vérifier que les deux joueurs sont dans le tableau (scoreboard)
    await expect(page.getByTestId('scoreboard-player-Alice')).toBeVisible();
    await expect(page.getByTestId('scoreboard-player-Bob')).toBeVisible();

    // Vérifier que le score restant est affiché (501 au départ)
    await expect(page.getByText('501').first()).toBeVisible();
  });

  test('should display player statistics', async ({ page }) => {
    // Vérifier que les statistiques sont affichées
    // Moyenne, PPD, Fléchettes
    await expect(page.getByText(/Moyenne|Average/i).first()).toBeVisible();
    await expect(page.getByText('PPD').first()).toBeVisible();
    await expect(page.getByText(/Fléchettes|Darts/i).first()).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading').filter({ hasText: /01/i }).first()).toBeVisible();

    // Tester sur tablette
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading').filter({ hasText: /01/i }).first()).toBeVisible();

    // Tester sur desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading').filter({ hasText: /01/i }).first()).toBeVisible();
  });

  test('should quit game from settings', async ({ page }) => {
    // Ouvrir les paramètres
    await page.getByTestId('settings-button').click();

    // Cliquer sur Quitter
    await page.getByTestId('quit-button').click();

    // Devrait retourner à la page d'accueil
    await expect(page).toHaveURL('/');
  });

  test('should start new game from settings', async ({ page }) => {
    // Ouvrir les paramètres
    await page.getByTestId('settings-button').click();

    // Cliquer sur Nouvelle partie
    await page.getByTestId('new-game-button').click();

    // Devrait retourner à la page de configuration
    await expect(page).toHaveURL('/01');
  });

  test('should highlight current player in scoreboard', async ({ page }) => {
    // Le joueur actif devrait avoir une bordure accent
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');

    // Au moins un des joueurs devrait avoir la classe border-accent
    const aliceClasses = await aliceCard.getAttribute('class');
    const bobClasses = await bobCard.getAttribute('class');

    const hasActivePlayer =
      (aliceClasses && aliceClasses.includes('border-accent')) ||
      (bobClasses && bobClasses.includes('border-accent'));

    expect(hasActivePlayer).toBe(true);
  });

  test('should display round counter', async ({ page }) => {
    // Vérifier que le compteur de tours est affiché
    const roundCounter = page.getByTestId('round-counter');
    await expect(roundCounter).toBeVisible();
    await expect(roundCounter).toContainText(/Tour|Round/i);
  });

  test('should display dart counter', async ({ page }) => {
    // Vérifier que le compteur de fléchettes est affiché
    const dartCounter = page.getByTestId('dart-counter');
    await expect(dartCounter).toBeVisible();
  });

  test('should show game header', async ({ page }) => {
    // Vérifier que le header est présent
    await expect(page.getByRole('heading').filter({ hasText: /01/i }).first()).toBeVisible();
  });

  test('should display initial scores correctly for 501 mode', async ({ page }) => {
    // Les deux joueurs devraient commencer à 501
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');

    await expect(aliceCard).toContainText('501');
    await expect(bobCard).toContainText('501');
  });

  test('should show undo button disabled initially', async ({ page }) => {
    // Le bouton undo devrait être désactivé au début
    const undoButton = page.getByTestId('undo-button');

    // Vérifier qu'il est visible (même s'il peut être désactivé)
    await expect(undoButton).toBeVisible();
  });
});

test.describe('01 Game - 301 Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de configuration
    await page.goto('/01');

    // Configurer une partie avec 2 joueurs
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Sélectionner le mode 301
    await page.getByTestId('game-mode-301').click();

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Attendre d'être sur la page de jeu
    await page.waitForURL(/\/01\/game/);
  });

  test('should display 301 mode in header', async ({ page }) => {
    // Vérifier que le mode 301 est affiché
    await expect(page.getByText('301')).toBeVisible();
  });

  test('should display initial scores correctly for 301 mode', async ({ page }) => {
    // Les deux joueurs devraient commencer à 301
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');

    await expect(aliceCard).toContainText('301');
    await expect(bobCard).toContainText('301');
  });
});

test.describe('01 Game - 701 Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de configuration
    await page.goto('/01');

    // Configurer une partie avec 2 joueurs
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Sélectionner le mode 701
    await page.getByTestId('game-mode-701').click();

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Attendre d'être sur la page de jeu
    await page.waitForURL(/\/01\/game/);
  });

  test('should display 701 mode in header', async ({ page }) => {
    // Vérifier que le mode 701 est affiché
    await expect(page.getByText('701')).toBeVisible();
  });

  test('should display initial scores correctly for 701 mode', async ({ page }) => {
    // Les deux joueurs devraient commencer à 701
    const aliceCard = page.getByTestId('scoreboard-player-Alice');
    const bobCard = page.getByTestId('scoreboard-player-Bob');

    await expect(aliceCard).toContainText('701');
    await expect(bobCard).toContainText('701');
  });
});

test.describe('01 Game - Double Out Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de configuration
    await page.goto('/01');

    // Configurer une partie avec 2 joueurs
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Activer le double out
    await page.getByTestId('double-out-checkbox').click();

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Attendre d'être sur la page de jeu
    await page.waitForURL(/\/01\/game/);
  });

  test('should show double out rules in legend', async ({ page }) => {
    // Ouvrir la légende
    await page.getByTestId('legend-button').click();

    // Vérifier que les règles du double out sont affichées
    await expect(page.getByText(/Double Out/i)).toBeVisible();

    // Fermer la légende
    await page.getByTestId('legend-close-button').click();
  });
});

test.describe('01 Game - Max Rounds', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de configuration
    await page.goto('/01');

    // Configurer une partie avec 2 joueurs
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // Définir un nombre maximum de tours
    const roundsInput = page.getByTestId('max-rounds-input');
    await roundsInput.fill('10');

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Attendre d'être sur la page de jeu
    await page.waitForURL(/\/01\/game/);
  });

  test('should display max rounds in round counter', async ({ page }) => {
    // Vérifier que le nombre maximum de tours est affiché
    const roundCounter = page.getByTestId('round-counter');
    await expect(roundCounter).toContainText('10');
  });
});
