import { useState, useRef, useEffect } from "react";
import { Segment } from "@/services/boardinfo";

type GameHistoryEntry<T> = {
  gameState: T;
  turnHits: Segment[];
};

export function useGameHistory<T extends { dartsThrown: number; currentPlayerIndex: number }>(
  gameState: T | null,
  currentTurnHits: Segment[],
  cloneFn: (state: T) => T
) {
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry<T>[]>([]);
  const previousGameStateRef = useRef<T | null>(null);
  const previousTurnHitsRef = useRef<Segment[]>([]);
  const isRestoringRef = useRef<boolean>(false);

  // Track game state changes and save to history
  useEffect(() => {
    if (!gameState) return;

    // Don't save to history if we're restoring a previous state
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      previousGameStateRef.current = cloneFn(gameState);
      previousTurnHitsRef.current = [...currentTurnHits];
      return;
    }

    // If we have a previous state, save it to history
    if (previousGameStateRef.current) {
      // IMPORTANT: Capture the values BEFORE updating the refs to avoid React Strict Mode issues
      const stateToSave = cloneFn(previousGameStateRef.current);
      const hitsToSave = [...previousTurnHitsRef.current];

      setGameHistory((prev) =>
        [
          ...prev,
          {
            gameState: stateToSave,
            turnHits: hitsToSave,
          },
        ].slice(-20)
      );
    }

    // Update previous state reference (will be saved next time)
    previousGameStateRef.current = cloneFn(gameState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.dartsThrown, gameState?.currentPlayerIndex]);

  const saveCurrentTurnHits = (hits: Segment[]) => {
    previousTurnHitsRef.current = [...hits];
  };

  const undoLastAction = (): {
    gameState: T;
    turnHits: Segment[];
  } | null => {
    if (gameHistory.length === 0) return null;

    const previousEntry = gameHistory[gameHistory.length - 1];
    setGameHistory((prev) => prev.slice(0, -1));

    // Mark that we're restoring to prevent re-saving in useEffect
    isRestoringRef.current = true;

    return previousEntry;
  };

  return {
    gameHistory,
    saveCurrentTurnHits,
    undoLastAction,
    hasHistory: gameHistory.length > 0,
  };
}
