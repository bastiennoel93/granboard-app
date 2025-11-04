import {
  CricketGameMode,
  CricketNumber,
  PlayerState,
  CRICKET_NUMBERS,
  getPlayerScore,
  calculateMPR,
} from "@/services/cricket";

interface ScoreBoardProps {
  players: PlayerState[];
  currentPlayerIndex: number;
  gameMode: CricketGameMode;
  gameFinished: boolean;
}

export function ScoreBoard({
  players,
  currentPlayerIndex,
  gameMode,
  gameFinished,
}: ScoreBoardProps) {
  // Check if all players have closed a specific number
  const isNumberClosedByAll = (num: CricketNumber) => {
    return players.every((p) => getPlayerScore(p, num).marks >= 3);
  };

  // Get mark symbol for display (Phoenix Dart style)
  const getMarkSymbol = (marks: number) => {
    if (marks === 0) return "";
    if (marks === 1) return "/";
    if (marks === 2) return "X";
    if (marks >= 3) return "⊗";
    return "";
  };

  // Split players into left and right columns
  const midPoint = Math.ceil(players.length / 2);
  const leftPlayers = players.slice(0, midPoint);
  const rightPlayers = players.slice(midPoint);

  const renderPlayerCell = (playerState: PlayerState | undefined, num: CricketNumber) => {
    if (!playerState) {
      return <td key="empty" className="p-2"></td>;
    }

    const score = getPlayerScore(playerState, num);
    const symbol = getMarkSymbol(score.marks);
    const isClosed = score.marks >= 3;
    const allClosed = isNumberClosedByAll(num);

    return (
      <td
        key={playerState.player.id}
        className={`p-2 text-center ${allClosed ? "bg-theme-secondary" : ""}`}
      >
        <div
          className={`text-2xl font-bold ${
            isClosed
              ? allClosed
                ? "text-theme-muted"
                : "text-green-400"
              : score.marks > 0
              ? "text-accent"
              : "text-theme-interactive"
          }`}
        >
          {symbol || "-"}
        </div>
      </td>
    );
  };

  return (
    <div className="bg-theme-card rounded-xl shadow-2xl border-2 border-theme-card h-full flex flex-col overflow-hidden">
      <div className="overflow-auto flex-1 relative">
        <table className="w-full border-collapse h-full">
          <thead className="sticky top-0 bg-theme-card z-10">
            <tr className="border-b-2 border-accent">
              {/* Left players headers */}
              {leftPlayers.map((playerState, idx) => {
                const isCurrentPlayer = players.indexOf(playerState) === currentPlayerIndex;
                return (
                  <th
                    key={playerState.player.id}
                    data-testid={`scoreboard-player-${playerState.player.name}`}
                    className={`p-2 text-center font-bold text-base min-w-[70px] ${
                      isCurrentPlayer && !gameFinished
                        ? "text-accent border-b-4 border-accent"
                        : "text-theme-primary"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{playerState.player.name}</span>
                      {isCurrentPlayer && !gameFinished && (
                        <span className="text-accent text-xs">▼</span>
                      )}
                    </div>
                  </th>
                );
              })}
              {/* Number column header */}
              <th className="p-2 text-center font-bold text-theme-primary text-base min-w-[60px] border-x-2 border-theme-card">

              </th>
              {/* Right players headers */}
              {rightPlayers.map((playerState, idx) => {
                const isCurrentPlayer = players.indexOf(playerState) === currentPlayerIndex;
                return (
                  <th
                    key={playerState.player.id}
                    data-testid={`scoreboard-player-${playerState.player.name}`}
                    className={`p-2 text-center font-bold text-base min-w-[70px] ${
                      isCurrentPlayer && !gameFinished
                        ? "text-accent border-b-4 border-accent"
                        : "text-theme-primary"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{playerState.player.name}</span>
                      {isCurrentPlayer && !gameFinished && (
                        <span className="text-accent text-xs">▼</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {CRICKET_NUMBERS.map((num) => {
              const allClosed = isNumberClosedByAll(num);
              return (
                <tr
                  key={num}
                  className={`border-b border-theme-card ${
                    allClosed ? "bg-theme-elevated-alpha" : ""
                  }`}
                >
                  {/* Left players */}
                  {leftPlayers.map((playerState) => renderPlayerCell(playerState, num))}
                  {/* Number column */}
                  <td
                    data-testid={`cricket-number-${num === 25 ? 'Bull' : num}`}
                    className={`p-2 text-center font-bold text-xl border-x-2 border-theme-card ${
                      allClosed ? "text-theme-muted" : "text-theme-primary"
                    }`}
                  >
                    {num === 25 ? "Bull" : num}
                  </td>
                  {/* Right players */}
                  {rightPlayers.map((playerState) => renderPlayerCell(playerState, num))}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 bg-theme-card z-10">
            {/* Total Points Row */}
            <tr className="border-t-2 border-accent bg-theme-secondary">
              {leftPlayers.map((playerState) => (
                <td
                  key={playerState.player.id}
                  className={`p-2 text-center font-bold text-lg ${
                    gameMode === CricketGameMode.CutThroat
                      ? "text-red-400"
                      : "text-theme-primary"
                  }`}
                >
                  {playerState.totalPoints}
                </td>
              ))}
              <td className="p-2 text-center font-bold text-theme-primary text-sm border-x-2 border-theme-card" data-testid="points-label">
                Points
              </td>
              {rightPlayers.map((playerState) => (
                <td
                  key={playerState.player.id}
                  className={`p-2 text-center font-bold text-lg ${
                    gameMode === CricketGameMode.CutThroat
                      ? "text-red-400"
                      : "text-theme-primary"
                  }`}
                >
                  {playerState.totalPoints}
                </td>
              ))}
            </tr>
            {/* MPR Row */}
            <tr className="bg-theme-secondary">
              {leftPlayers.map((playerState) => (
                <td
                  key={playerState.player.id}
                  className="p-2 text-center font-bold text-base text-accent"
                >
                  {calculateMPR(playerState).toFixed(2)}
                </td>
              ))}
              <td className="p-2 text-center font-bold text-theme-primary text-sm border-x-2 border-theme-card" data-testid="mpr-label">
                MPR
              </td>
              {rightPlayers.map((playerState) => (
                <td
                  key={playerState.player.id}
                  className="p-2 text-center font-bold text-base text-accent"
                >
                  {calculateMPR(playerState).toFixed(2)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
