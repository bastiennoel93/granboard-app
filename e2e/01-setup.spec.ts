import { test, expect } from '@playwright/test';

test.describe('01 Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/01');
  });

  test('should display 01 setup page with default values', async ({ page }) => {
    // Vérifier le titre
    await expect(page.getByRole('heading', { name: /01/i })).toBeVisible();

    // Vérifier les modes de jeu
    await expect(page.getByTestId('game-mode-301')).toBeVisible();
    await expect(page.getByTestId('game-mode-501')).toBeVisible();
    await expect(page.getByTestId('game-mode-701')).toBeVisible();

    // Vérifier que le bouton commencer est présent
    await expect(page.getByTestId('start-game-button')).toBeVisible();

    // Vérifier que le bouton retour est présent
    await expect(page.getByTestId('back-button')).toBeVisible();

    // Vérifier que le bouton paramètres est présent
    await expect(page.getByTestId('settings-button')).toBeVisible();
  });

  test('should add players', async ({ page }) => {
    // Trouver le champ de saisie du nom
    const nameInput = page.getByTestId('player-name-input');

    // Ajouter un premier joueur et attendre qu'il apparaisse
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    // Ajouter un deuxième joueur et attendre qu'il apparaisse
    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();
  });

  test('should add player by pressing Enter key', async ({ page }) => {
    const nameInput = page.getByTestId('player-name-input');

    // Ajouter un joueur en appuyant sur Entrée
    await nameInput.fill('Charlie');
    await nameInput.press('Enter');
    await expect(page.getByTestId('player-item-Charlie')).toBeVisible();
  });

  test('should not allow starting game without enough players', async ({ page }) => {
    // Essayer de commencer sans joueur
    const startButton = page.getByTestId('start-game-button');

    // Le bouton devrait être désactivé
    await expect(startButton).toBeDisabled();

    // Ajouter un seul joueur
    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    // Le bouton devrait toujours être désactivé avec un seul joueur
    await expect(startButton).toBeDisabled();
  });

  test('should allow removing players', async ({ page }) => {
    // Ajouter un joueur et attendre qu'il apparaisse
    const nameInput = page.getByTestId('player-name-input');
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    // Supprimer le joueur
    await page.getByTestId('remove-player-button-Alice').click();

    // Vérifier que le joueur a disparu
    await expect(page.getByTestId('player-item-Alice')).not.toBeVisible();
  });

  test('should select 301 game mode', async ({ page }) => {
    // Cliquer sur 301
    await page.getByTestId('game-mode-301').click();

    // Vérifier que le mode est sélectionné (vérifier la classe CSS)
    const mode301 = page.getByTestId('game-mode-301');
    await expect(mode301).toHaveClass(/border-accent/);
  });

  test('should select 501 game mode (default)', async ({ page }) => {
    // 501 devrait être sélectionné par défaut
    const mode501 = page.getByTestId('game-mode-501');
    await expect(mode501).toHaveClass(/border-accent/);
  });

  test('should select 701 game mode', async ({ page }) => {
    // Cliquer sur 701
    await page.getByTestId('game-mode-701').click();

    // Vérifier que le mode est sélectionné (vérifier la classe CSS)
    const mode701 = page.getByTestId('game-mode-701');
    await expect(mode701).toHaveClass(/border-accent/);
  });

  test('should toggle double out option', async ({ page }) => {
    // Trouver la checkbox double out
    const doubleOutCheckbox = page.getByTestId('double-out-checkbox');

    // Elle devrait être décochée par défaut
    await expect(doubleOutCheckbox).not.toBeChecked();

    // Cocher la case
    await doubleOutCheckbox.click();
    await expect(doubleOutCheckbox).toBeChecked();

    // Décocher la case
    await doubleOutCheckbox.click();
    await expect(doubleOutCheckbox).not.toBeChecked();
  });

  test('should change max rounds', async ({ page }) => {
    // Trouver l'input de rounds
    const roundsInput = page.getByTestId('max-rounds-input');

    // Par défaut devrait être 0
    await expect(roundsInput).toHaveValue('0');

    // Changer à 10
    await roundsInput.fill('10');
    await expect(roundsInput).toHaveValue('10');

    // Changer à 20
    await roundsInput.fill('20');
    await expect(roundsInput).toHaveValue('20');
  });

  test('should start game with valid configuration (301)', async ({ page }) => {
    // Ajouter deux joueurs
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

    // Vérifier qu'on est redirigé vers la page de jeu
    await expect(page).toHaveURL(/\/01\/game/);
  });

  test('should start game with valid configuration (501)', async ({ page }) => {
    // Ajouter deux joueurs
    const nameInput = page.getByTestId('player-name-input');

    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByTestId('add-player-button').click();
    await expect(page.getByTestId('player-item-Bob')).toBeVisible();

    // 501 est déjà sélectionné par défaut, pas besoin de cliquer

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Vérifier qu'on est redirigé vers la page de jeu
    await expect(page).toHaveURL(/\/01\/game/);
  });

  test('should start game with valid configuration (701)', async ({ page }) => {
    // Ajouter deux joueurs
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

    // Vérifier qu'on est redirigé vers la page de jeu
    await expect(page).toHaveURL(/\/01\/game/);
  });

  test('should start game with double out enabled', async ({ page }) => {
    // Ajouter deux joueurs
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

    // Vérifier qu'on est redirigé vers la page de jeu
    await expect(page).toHaveURL(/\/01\/game/);
  });

  test('should start game with max rounds set', async ({ page }) => {
    // Ajouter deux joueurs
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

    // Commencer la partie
    await page.getByTestId('start-game-button').click();

    // Gérer la dialog d'ordre des joueurs - choisir "Ordre aléatoire"
    await page.getByTestId('order-random-button').click();

    // Vérifier qu'on est redirigé vers la page de jeu
    await expect(page).toHaveURL(/\/01\/game/);
  });

  test('should navigate back to home', async ({ page }) => {
    // Cliquer sur le bouton retour
    await page.getByTestId('back-button').click();

    // Vérifier qu'on est redirigé vers la page d'accueil
    await expect(page).toHaveURL('/');
  });

  test('should display rules section', async ({ page }) => {
    // Vérifier que la section des règles est visible
    await expect(page.getByText(/Objectif/i)).toBeVisible();
  });

  test('should show double out rules when enabled', async ({ page }) => {
    // Activer le double out
    await page.getByTestId('double-out-checkbox').click();

    // Vérifier que les règles du double out sont affichées
    await expect(page.getByText(/Double Out/i)).toBeVisible();
  });

  test('should support multiple players', async ({ page }) => {
    const nameInput = page.getByTestId('player-name-input');

    // Ajouter 4 joueurs
    const players = ['Alice', 'Bob', 'Charlie', 'David'];
    for (const player of players) {
      await nameInput.fill(player);
      await page.getByTestId('add-player-button').click();
      await expect(page.getByTestId(`player-item-${player}`)).toBeVisible();
    }

    // Vérifier que le compteur affiche 4 joueurs
    await expect(page.getByText(/4 joueurs/i)).toBeVisible();

    // Le bouton start devrait être activé
    const startButton = page.getByTestId('start-game-button');
    await expect(startButton).not.toBeDisabled();
  });

  test('should not add empty player name', async ({ page }) => {
    const nameInput = page.getByTestId('player-name-input');

    // Essayer d'ajouter un joueur avec un nom vide
    await nameInput.fill('');
    await page.getByTestId('add-player-button').click();

    // Aucun joueur ne devrait être ajouté
    await expect(page.getByText(/Ajoutez au moins 2 joueurs/i)).toBeVisible();
  });

  test('should clear input after adding player', async ({ page }) => {
    const nameInput = page.getByTestId('player-name-input');

    // Ajouter un joueur
    await nameInput.fill('Alice');
    await page.getByTestId('add-player-button').click();

    // L'input devrait être vide
    await expect(nameInput).toHaveValue('');
  });
});
