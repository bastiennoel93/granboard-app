"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Player, ZeroOneMode } from "@/services/zeroone";
import { PlayerOrderModal } from "../cricket/components/PlayerOrderModal";
import { PlayerOrderDialog } from "../cricket/components/PlayerOrderDialog";
import { Granboard } from "@/services/granboard";
import { useSettings } from "../contexts/SettingsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGear } from "@fortawesome/free-solid-svg-icons";

export default function ZeroOneSetup() {
  const router = useRouter();
  const t = useTranslations();
  const { openDialog } = useSettings();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [gameMode, setGameMode] = useState<ZeroOneMode>(ZeroOneMode.FiveOhOne);
  const [doubleOut, setDoubleOut] = useState<boolean>(false);
  const [maxRounds, setMaxRounds] = useState<number>(0); // 0 = unlimited
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [granboard, setGranboard] = useState<Granboard | null>(null);

  const addPlayer = () => {
    if (currentName.trim() === "") return;

    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: currentName.trim(),
    };

    setPlayers([...players, newPlayer]);
    setCurrentName("");
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleOrderDetermined = (orderedPlayers: Player[]) => {
    setPlayers(orderedPlayers);
    setShowOrderModal(false);

    // Start the game with the determined order
    sessionStorage.setItem("zeroOnePlayers", JSON.stringify(orderedPlayers));
    sessionStorage.setItem("zeroOneMode", gameMode.toString());
    sessionStorage.setItem("zeroOneDoubleOut", doubleOut.toString());
    sessionStorage.setItem("zeroOneMaxRounds", maxRounds.toString());
    router.push("/01/game");
  };

  const handleThrowForOrder = async () => {
    try {
      const board = await Granboard.ConnectToBoard();
      setGranboard(board);
      setShowOrderModal(true);
    } catch (error) {
      console.error("Failed to connect to Granboard:", error);
      alert(t('zeroOne.errors.connectionFailed'));
    }
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
  };

  const startGame = () => {
    if (players.length < 2) {
      alert(t('zeroOne.errors.minPlayers'));
      return;
    }

    // Show order selection dialog
    setShowOrderDialog(true);
  };

  const handleOrderSet = (orderedPlayers: Player[]) => {
    setPlayers(orderedPlayers);
    setShowOrderDialog(false);

    // Store players, game mode, double out, and max rounds in sessionStorage
    sessionStorage.setItem("zeroOnePlayers", JSON.stringify(orderedPlayers));
    sessionStorage.setItem("zeroOneMode", gameMode.toString());
    sessionStorage.setItem("zeroOneDoubleOut", doubleOut.toString());
    sessionStorage.setItem("zeroOneMaxRounds", maxRounds.toString());
    router.push("/01/game");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  return (
    <main className="relative min-h-screen bg-theme-primary flex flex-col items-center px-8 py-10 gap-8">
      {/* Back button */}
      <button
        data-testid="back-button"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 px-4 py-2 bg-theme-interactive text-theme-interactive bg-theme-interactive-hover rounded-lg transition-all flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> {t('common.back')}
      </button>

      {/* Settings Button - Top Right */}
      <div className="absolute top-6 right-6">
        <button
          data-testid="settings-button"
          onClick={() => openDialog()}
          className="px-4 py-2 bg-theme-interactive text-theme-interactive bg-theme-interactive-hover rounded-lg transition-all flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faGear} /> {t('zeroOne.game.settings')}
        </button>
      </div>

      {/* Title */}
      <div className="w-full text-center">
        <h1 className="text-6xl font-bold text-theme-primary mb-2 tracking-wider">
          {t('zeroOne.title')}
        </h1>
        <p className="text-theme-tertiary text-lg">{t('zeroOne.subtitle')}</p>
      </div>

      {/* Main configuration */}
      <div className="w-full max-w-3xl bg-theme-card-alpha backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-theme-card">
        <h2 className="text-3xl font-bold mb-6 text-accent">
          {t('zeroOne.players.title')}
        </h2>

        <div className="flex gap-4 mb-6">
          <input
            data-testid="player-name-input"
            type="text"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('zeroOne.players.placeholder')}
            className="flex-1 px-4 py-3 bg-theme-input border border-theme-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-theme-input placeholder-theme-input"
            maxLength={20}
          />
          <button
            data-testid="add-player-button"
            onClick={addPlayer}
            className="px-8 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
          >
            {t('common.add')}
          </button>
        </div>

        {players.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-theme-secondary">
              {t(players.length > 1 ? 'zeroOne.players.count_plural' : 'zeroOne.players.count', { count: players.length })}
            </h3>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  data-testid={`player-item-${player.name}`}
                  className="flex items-center justify-between p-4 bg-theme-card rounded-xl border border-theme-card hover:border-accent transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center text-2xl font-bold text-accent bg-theme-secondary rounded-full">
                      {index + 1}
                    </span>
                    <span className="text-xl font-medium text-theme-primary">
                      {player.name}
                    </span>
                  </div>
                  <button
                    data-testid={`remove-player-button-${player.name}`}
                    onClick={() => removePlayer(player.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all text-sm font-medium"
                  >
                    {t('common.remove')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {players.length < 2 && (
          <p className="text-sm text-theme-muted italic mb-6 text-center py-4 bg-theme-secondary rounded-lg">
            {t('zeroOne.players.minRequired')}
          </p>
        )}

        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-4 text-accent">
            {t('zeroOne.gameMode.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              data-testid="game-mode-301"
              onClick={() => setGameMode(ZeroOneMode.ThreeOhOne)}
              className={`group p-6 rounded-xl border-2 transition-all ${
                gameMode === ZeroOneMode.ThreeOhOne
                  ? "border-accent bg-accent-bg shadow-lg"
                  : "border-theme-card bg-theme-card hover:border-accent"
              }`}
            >
              <div className="text-2xl font-bold mb-2 text-theme-primary">301</div>
              <div className={`text-sm ${gameMode === ZeroOneMode.ThreeOhOne ? "text-theme-primary" : "text-theme-muted"}`}>
                {t('zeroOne.gameMode.short')}
              </div>
            </button>
            <button
              data-testid="game-mode-501"
              onClick={() => setGameMode(ZeroOneMode.FiveOhOne)}
              className={`group p-6 rounded-xl border-2 transition-all ${
                gameMode === ZeroOneMode.FiveOhOne
                  ? "border-accent bg-accent-bg shadow-lg"
                  : "border-theme-card bg-theme-card hover:border-accent"
              }`}
            >
              <div className="text-2xl font-bold mb-2 text-theme-primary">501</div>
              <div className={`text-sm ${gameMode === ZeroOneMode.FiveOhOne ? "text-theme-primary" : "text-theme-muted"}`}>
                {t('zeroOne.gameMode.standard')}
              </div>
            </button>
            <button
              data-testid="game-mode-701"
              onClick={() => setGameMode(ZeroOneMode.SevenOhOne)}
              className={`group p-6 rounded-xl border-2 transition-all ${
                gameMode === ZeroOneMode.SevenOhOne
                  ? "border-accent bg-accent-bg shadow-lg"
                  : "border-theme-card bg-theme-card hover:border-accent"
              }`}
            >
              <div className="text-2xl font-bold mb-2 text-theme-primary">701</div>
              <div className={`text-sm ${gameMode === ZeroOneMode.SevenOhOne ? "text-theme-primary" : "text-theme-muted"}`}>
                {t('zeroOne.gameMode.long')}
              </div>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-4 text-accent">
            {t('zeroOne.options.title')}
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-theme-card rounded-xl border border-theme-card hover:border-accent transition-all cursor-pointer">
              <input
                data-testid="double-out-checkbox"
                type="checkbox"
                checked={doubleOut}
                onChange={(e) => setDoubleOut(e.target.checked)}
                className="w-6 h-6 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <div className="flex-1">
                <div className="font-bold text-theme-primary">{t('zeroOne.options.doubleOut.title')}</div>
                <div className="text-sm text-theme-muted">{t('zeroOne.options.doubleOut.description')}</div>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-4 text-accent">
            {t('zeroOne.rounds.title')}
          </h3>
          <div className="flex items-center gap-4 bg-theme-card rounded-xl p-4">
            <input
              data-testid="max-rounds-input"
              type="number"
              min="0"
              max="100"
              value={maxRounds}
              onChange={(e) => setMaxRounds(Math.max(0, parseInt(e.target.value) || 0))}
              className="px-6 py-3 bg-theme-input border border-theme-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-theme-input w-24 text-center font-bold text-2xl"
            />
            <span className="text-theme-secondary text-sm">
              {t('zeroOne.rounds.description')}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            data-testid="start-game-button"
            onClick={startGame}
            disabled={players.length < 2}
            className={`flex-1 px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg ${
              players.length < 2
                ? "bg-theme-interactive text-theme-muted cursor-not-allowed"
                : "bg-accent text-white hover:opacity-90 hover:scale-105"
            }`}
          >
            {t('common.start')}
          </button>
        </div>
      </div>

      {/* Rules */}
      <div className="w-full max-w-3xl bg-game-01-light border-game-01-light rounded-2xl p-6 border-2 backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-4 text-theme-primary">
          {t('zeroOne.rules.title')}
        </h3>
        <ul className="text-theme-secondary space-y-2 mb-4">
          {(t.raw('zeroOne.rules.common') as string[]).map((rule, index) => (
            <li key={index}>• {rule}</li>
          ))}
        </ul>
        {doubleOut && (
          <div className="bg-theme-card p-4 rounded-xl border border-accent/30">
            <p className="font-bold text-accent mb-2">{t('zeroOne.rules.doubleOut.title')}</p>
            <ul className="text-theme-primary space-y-1 text-sm">
              {(t.raw('zeroOne.rules.doubleOut.rules') as string[]).map((rule, index) => (
                <li key={index}>• {rule}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Player order dialog */}
      {showOrderDialog && (
        <PlayerOrderDialog
          players={players}
          onOrderSet={handleOrderSet}
          onThrowForOrder={handleThrowForOrder}
          onClose={() => setShowOrderDialog(false)}
        />
      )}

      {/* Player order modal (for throw for order) */}
      {showOrderModal && granboard && (
        <PlayerOrderModal
          players={players}
          granboard={granboard}
          onOrderDetermined={handleOrderDetermined}
          onClose={handleCloseOrderModal}
        />
      )}
    </main>
  );
}
