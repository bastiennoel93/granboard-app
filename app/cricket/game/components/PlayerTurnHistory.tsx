import { useTranslations } from "next-intl";
import { Player } from "@/services/cricket";
import { PlayerTurn } from "../hooks/usePlayerTurnHistory";
import { Segment } from "@/services/boardinfo";

interface PlayerTurnHistoryProps {
  player: Player;
  turns: PlayerTurn[];
  currentTurnHits: Segment[];
  currentRound: number;
}

export function PlayerTurnHistory({ player, turns, currentTurnHits, currentRound }: PlayerTurnHistoryProps) {
  const t = useTranslations();

  return (
    <div className="bg-theme-card rounded-xl shadow-2xl border-2 border-theme-card h-full flex flex-col overflow-hidden">
      <h3 className="text-lg font-bold text-theme-primary px-4 py-3 border-b-2 border-accent flex-shrink-0" data-testid="history-title">
        {t('cricket.game.history')} - {player.name}
      </h3>
      <div className="overflow-y-auto flex-1 p-4 space-y-2">
        {/* Current turn */}
        <div className="bg-accent-bg rounded-lg p-2 border-2 border-accent">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-accent" data-testid={`current-round-${currentRound}`}>
              {t('cricket.game.round')} {currentRound} ({t('cricket.game.inProgress')})
            </span>
            <span className="text-xs text-accent">
              {currentTurnHits.length} / 3 {t('cricket.game.darts')}
            </span>
          </div>
          <div className="flex gap-1.5">
            {currentTurnHits.length > 0 ? (
              <>
                {currentTurnHits.map((hit, hitIdx) => (
                  <div
                    key={hitIdx}
                    className={`flex-1 bg-theme-interactive rounded px-2 py-1.5 text-center ${
                      hitIdx === currentTurnHits.length - 1 ? "ring-2 ring-green-400" : ""
                    }`}
                  >
                    <div className="text-sm font-bold text-theme-primary">
                      {hit.ShortName}
                    </div>
                    <div className="text-xs text-theme-muted">
                      {hit.Value}
                    </div>
                  </div>
                ))}
                {/* Fill remaining dart slots */}
                {currentTurnHits.length < 3 &&
                  Array.from({ length: 3 - currentTurnHits.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex-1 bg-theme-secondary rounded px-2 py-1.5 text-center"
                    >
                      <div className="text-sm text-theme-tertiary">-</div>
                      <div className="text-xs text-theme-tertiary">0</div>
                    </div>
                  ))}
              </>
            ) : (
              /* No darts thrown yet */
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex-1 bg-theme-secondary rounded px-2 py-1.5 text-center"
                >
                  <div className="text-sm text-theme-tertiary">-</div>
                  <div className="text-xs text-theme-tertiary">0</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Previous turns */}
        {turns.length > 0 ? (
          [...turns].reverse().map((turn, idx) => {
            return (
              <div
                key={`${turn.round}-${idx}`}
                className="bg-theme-card rounded-lg p-2 border border-theme-card"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-accent" data-testid={`completed-round-${turn.round}`}>
                    {t('cricket.game.round')} {turn.round}
                  </span>
                  <span className="text-xs text-theme-muted">
                    {turn.hits.length} {t('cricket.game.darts')}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {turn.hits.map((hit, hitIdx) => (
                    <div
                      key={hitIdx}
                      className="flex-1 bg-theme-interactive rounded px-2 py-1.5 text-center"
                    >
                      <div className="text-sm font-bold text-theme-primary">
                        {hit.ShortName}
                      </div>
                      <div className="text-xs text-theme-muted">
                        {hit.Value}
                      </div>
                    </div>
                  ))}
                  {/* Fill empty dart slots */}
                  {turn.hits.length < 3 &&
                    Array.from({ length: 3 - turn.hits.length }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="flex-1 bg-theme-secondary rounded px-2 py-1.5 text-center"
                      >
                        <div className="text-sm text-theme-tertiary">-</div>
                        <div className="text-xs text-theme-tertiary">0</div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-theme-muted text-center py-4 text-sm">
            {t('cricket.game.noCompletedTurns')}
          </div>
        )}
      </div>
    </div>
  );
}
