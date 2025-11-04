import {
  PlayerState,
  calculatePPD,
  calculateAverage,
} from "@/services/zeroone";
import { useTranslations } from "next-intl";

interface ScoreBoardProps {
  players: PlayerState[];
  currentPlayerIndex: number;
  gameFinished: boolean;
}

export function ScoreBoard({
  players,
  currentPlayerIndex,
  gameFinished,
}: ScoreBoardProps) {
  const t = useTranslations();

  return (
    <div className="bg-theme-card rounded-xl shadow-2xl border-2 border-theme-card h-full flex flex-col overflow-hidden">
      <div className="overflow-auto flex-1">
        <div className="space-y-2 p-4">
          {players.map((playerState, idx) => {
            const isCurrentPlayer = idx === currentPlayerIndex;
            const isFinished = playerState.currentScore === 0;

            return (
              <div
                key={playerState.player.id}
                data-testid={`scoreboard-player-${playerState.player.name}`}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isFinished
                    ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                    : isCurrentPlayer && !gameFinished
                    ? "border-accent bg-accent-bg dark:bg-green-900/30 shadow-xl ring-4 ring-accent dark:ring-accent"
                    : "border-green-700 bg-green-700 dark:border-green-700 dark:bg-green-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isCurrentPlayer && !gameFinished && (
                      <span className="text-accent text-2xl animate-pulse">
                        ▶
                      </span>
                    )}
                    {isFinished && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                    <span
                      className={`text-xl font-bold ${
                        isFinished
                          ? "text-green-600 dark:text-green-400"
                          : isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}
                    >
                      {playerState.player.name}
                    </span>
                  </div>
                  {playerState.busts > 0 && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <span>💥</span>
                      <span className="font-medium">{playerState.busts}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Score restant */}
                  <div className="text-center">
                    <div
                      className={`text-5xl font-bold mb-1 ${
                        isFinished
                          ? "text-green-600 dark:text-green-400"
                          : isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}
                    >
                      {playerState.currentScore}
                    </div>
                    <div
                      className={`text-xs uppercase tracking-wide ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent font-bold"
                          : "text-white font-semibold"
                      }`}
                    >
                      {t("zeroOne.game.remaining")}
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}>
                        {t("zeroOne.game.average")}
                      </span>
                      <span className={`font-bold ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}>
                        {calculateAverage(playerState).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}>
                        PPD
                      </span>
                      <span className={`font-bold ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}>
                        {calculatePPD(playerState).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}>
                        {t("zeroOne.game.darts")}
                      </span>
                      <span className={`font-bold ${
                        isCurrentPlayer && !gameFinished
                          ? "text-accent"
                          : "text-white"
                      }`}>
                        {playerState.dartsThrown}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
