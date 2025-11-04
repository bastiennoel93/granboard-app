import {
  createInitialGameState,
  createInitialPlayerState,
  processDartHit,
  nextPlayer,
  calculatePPD,
  calculateAverage,
  cloneGameState,
  ZeroOneMode,
  Player,
} from './zeroone';
import { CreateSegment, SegmentID } from './boardinfo';

describe('ZeroOne Service', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  describe('createInitialPlayerState', () => {
    it('should create initial player state with correct values', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);

      expect(playerState.player).toEqual(mockPlayers[0]);
      expect(playerState.currentScore).toBe(501);
      expect(playerState.dartsThrown).toBe(0);
      expect(playerState.totalPointsScored).toBe(0);
      expect(playerState.busts).toBe(0);
      expect(playerState.roundsPlayed).toBe(0);
    });

    it('should initialize with 301 starting score', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.ThreeOhOne);
      expect(playerState.currentScore).toBe(301);
    });

    it('should initialize with 701 starting score', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.SevenOhOne);
      expect(playerState.currentScore).toBe(701);
    });
  });

  describe('createInitialGameState', () => {
    it('should create initial game state correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 20);

      expect(gameState.players.length).toBe(2);
      expect(gameState.currentPlayerIndex).toBe(0);
      expect(gameState.dartsThrown).toBe(0);
      expect(gameState.currentRound).toBe(1);
      expect(gameState.maxRounds).toBe(20);
      expect(gameState.gameStarted).toBe(true);
      expect(gameState.gameFinished).toBe(false);
      expect(gameState.winner).toBeNull();
      expect(gameState.mode).toBe(ZeroOneMode.FiveOhOne);
      expect(gameState.doubleOut).toBe(false);
    });

    it('should initialize with double out enabled', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, true, 0);
      expect(gameState.doubleOut).toBe(true);
    });

    it('should initialize all players with starting score', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.ThreeOhOne, false, 0);
      gameState.players.forEach(player => {
        expect(player.currentScore).toBe(301);
      });
    });
  });

  describe('processDartHit', () => {
    it('should subtract score correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.TRP_20); // Triple 20 = 60 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(441); // 501 - 60
      expect(newState.players[0].totalPointsScored).toBe(60);
      expect(newState.players[0].dartsThrown).toBe(1);
      expect(newState.dartsThrown).toBe(1);
    });

    it('should handle single dart correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.INNER_20); // Single 20 = 20 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(481);
      expect(newState.players[0].totalPointsScored).toBe(20);
    });

    it('should handle double dart correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.DBL_20); // Double 20 = 40 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(461);
      expect(newState.players[0].totalPointsScored).toBe(40);
    });

    it('should handle bull correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.BULL); // Bull = 25 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(476);
    });

    it('should handle double bull correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.DBL_BULL); // Double Bull = 50 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(451);
    });

    it('should handle miss correctly', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.MISS); // Miss = 0 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(501);
      expect(newState.players[0].totalPointsScored).toBe(0);
      expect(newState.dartsThrown).toBe(1);
    });

    it('should detect bust when going below 0', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.players[0].currentScore = 40;
      const segment = CreateSegment(SegmentID.TRP_20); // Triple 20 = 60 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(40); // Score unchanged
      expect(newState.players[0].busts).toBe(1);
      expect(newState.dartsThrown).toBe(3); // Turn ends on bust
    });

    it('should detect bust when landing on 1', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.players[0].currentScore = 21;
      const segment = CreateSegment(SegmentID.INNER_20); // Single 20 = 20 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(21); // Score unchanged
      expect(newState.players[0].busts).toBe(1);
      expect(newState.dartsThrown).toBe(3);
    });

    it('should win when reaching exactly 0', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.players[0].currentScore = 60;
      const segment = CreateSegment(SegmentID.TRP_20); // Triple 20 = 60 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(0);
      expect(newState.gameFinished).toBe(true);
      expect(newState.winner).toEqual(mockPlayers[0]);
    });

    it('should require double out when enabled', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, true, 0);
      gameState.players[0].currentScore = 20;
      const segment = CreateSegment(SegmentID.INNER_20); // Single 20, not a double

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(20); // Bust, score unchanged
      expect(newState.players[0].busts).toBe(1);
    });

    it('should win with double out when hitting double', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, true, 0);
      gameState.players[0].currentScore = 40;
      const segment = CreateSegment(SegmentID.DBL_20); // Double 20 = 40 points

      const newState = processDartHit(gameState, segment);

      expect(newState.players[0].currentScore).toBe(0);
      expect(newState.gameFinished).toBe(true);
      expect(newState.winner).toEqual(mockPlayers[0]);
    });

    it('should not double process same dart hit', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const segment = CreateSegment(SegmentID.INNER_20); // Single 20
      const hitId = 'unique-hit-123';

      const newState1 = processDartHit(gameState, segment, hitId);
      const newState2 = processDartHit(newState1, segment, hitId); // Same hit ID

      expect(newState2.players[0].currentScore).toBe(481); // Only processed once
      expect(newState2.players[0].dartsThrown).toBe(1);
    });
  });


  describe('nextPlayer', () => {
    it('should rotate to next player after 3 darts', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.dartsThrown = 3;

      const newState = nextPlayer(gameState);

      expect(newState.currentPlayerIndex).toBe(1);
      expect(newState.dartsThrown).toBe(0);
      expect(newState.players[0].roundsPlayed).toBe(1);
    });

    it('should wrap around to first player', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.currentPlayerIndex = 1;
      gameState.dartsThrown = 3;

      const newState = nextPlayer(gameState);

      expect(newState.currentPlayerIndex).toBe(0);
      expect(newState.currentRound).toBe(2);
    });

    it('should increment round after all players played', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.currentPlayerIndex = 1;
      gameState.dartsThrown = 3;

      const newState = nextPlayer(gameState);

      expect(newState.currentRound).toBe(2);
    });

    it('should check for game finished after player rotation', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 1);
      gameState.currentPlayerIndex = 1;
      gameState.dartsThrown = 3;
      gameState.currentRound = 1;

      const newState = nextPlayer(gameState);

      expect(newState.gameFinished).toBe(true);
    });
  });

  describe('calculatePPD', () => {
    it('should calculate points per dart correctly', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);
      playerState.totalPointsScored = 180;
      playerState.dartsThrown = 9;

      const ppd = calculatePPD(playerState);

      expect(ppd).toBe(20); // 180 / 9
    });

    it('should return 0 when no darts thrown', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);

      const ppd = calculatePPD(playerState);

      expect(ppd).toBe(0);
    });

    it('should handle decimal values', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);
      playerState.totalPointsScored = 100;
      playerState.dartsThrown = 9;

      const ppd = calculatePPD(playerState);

      expect(ppd).toBeCloseTo(11.11, 2);
    });
  });

  describe('calculateAverage', () => {
    it('should calculate average per turn correctly', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);
      playerState.totalPointsScored = 180;
      playerState.roundsPlayed = 3; // 3 rounds

      const average = calculateAverage(playerState);

      expect(average).toBe(60); // 180 / 3 rounds
    });

    it('should return 0 when no rounds played', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);

      const average = calculateAverage(playerState);

      expect(average).toBe(0);
    });

    it('should calculate for multiple rounds', () => {
      const playerState = createInitialPlayerState(mockPlayers[0], ZeroOneMode.FiveOhOne);
      playerState.totalPointsScored = 100;
      playerState.roundsPlayed = 2;

      const average = calculateAverage(playerState);

      expect(average).toBe(50); // 100 / 2 rounds
    });
  });

  describe('cloneGameState', () => {
    it('should create a deep copy of game state', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      gameState.players[0].currentScore = 400;
      gameState.dartsThrown = 2;

      const cloned = cloneGameState(gameState);

      expect(cloned).not.toBe(gameState);
      expect(cloned.players).not.toBe(gameState.players);
      expect(cloned.players[0]).not.toBe(gameState.players[0]);
      expect(cloned.players[0].currentScore).toBe(400);
      expect(cloned.dartsThrown).toBe(2);
    });

    it('should not affect original when modifying clone', () => {
      const gameState = createInitialGameState(mockPlayers, ZeroOneMode.FiveOhOne, false, 0);
      const cloned = cloneGameState(gameState);

      cloned.players[0].currentScore = 100;
      cloned.dartsThrown = 3;

      expect(gameState.players[0].currentScore).toBe(501);
      expect(gameState.dartsThrown).toBe(0);
    });
  });
});
