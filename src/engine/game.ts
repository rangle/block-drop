/**
 * Public API:
 *   - createGame1() creates a game
 *
 * The game is a stateful object that processes a series of ticks (steps)
 *
 * Core Responsibilities:
 * - Calculate the events of each turn of the game
 * - Keep Score
 * - Track Level
 */
import rulesFunctions from './rules';
import boardFunctions, { gravityDrop } from './board';
import { debugBlock, move } from './block';
import { Block, Board, Game, GameConfig } from '../interfaces';
import { rotateLeft, rotateRight } from './block';

const CLEAR_OFFSET = 1;

export function clearCheck(
  detectAndClear: (
    markOffset?: number,
  ) => { breakdown: { fw: 10 | 20 | 30; total: number }[]; total: number },
  offset = CLEAR_OFFSET,
) {
  return detectAndClear(offset);
}

function cartesianControl(
  game: Game,
  axis: 'x' | 'y',
  magnitude: number,
  can: (board: Board, block: Block) => boolean,
) {
  if (can(game.board, game.state.activePiece)) {
    game.moveBlock(axis, magnitude);
    return true;
  }
  return false;
}

export function createGame1(
  conf: GameConfig,
  emit,
  board: Board,
  detectAndClear,
  nextBlock,
  gameOver,
  activeFramework: () => 10 | 20 | 30,
): Game {
  const tick = rulesFunctions.ticks.get(conf.tick);
  const canMoveDown = boardFunctions.canMoveDown.get(conf.canMoveDown);
  const canMoveLeft = boardFunctions.canMoveLeft.get(conf.canMoveLeft);
  const canMoveRight = boardFunctions.canMoveRight.get(conf.canMoveRight);
  const canMoveUp = boardFunctions.canMoveUp.get(conf.canMoveUp);
  const canRotateLeft = boardFunctions.canRotateLeft.get(conf.canRotateLeft);
  const canRotateRight = boardFunctions.canRotateRight.get(conf.canRotateRight);
  const game: Game = {
    state: {
      activePiece: nextBlock(),
      cascadeCount: 1,
      conf,
      isEnded: false,
      isClearDelay: false,
      level: 1,
      levelPrev: 1,
      nextLevelThreshold: 45,
      rowsCleared: 0,
      rowsClearedPrev: 0,
      score: 0,
      tilesCleared: 0,
      tilesClearedPrev: 0,
    },
    controls: {
      endGame: gameOver,
      moveDown: () => cartesianControl(game, 'y', 1, canMoveDown),
      moveLeft: () => cartesianControl(game, 'x', -1, canMoveLeft),
      moveRight: () => cartesianControl(game, 'x', 1, canMoveRight),
      moveUp: () => {
        let happened = false;
        while (canMoveDown(board, game.state.activePiece)) {
          happened = true;
          game.moveBlock('y', 1);
        }
        return happened;
      },
      rotateLeft: () => {
        if (canRotateLeft(board, game.state.activePiece)) {
          rotateLeft(game.state.activePiece);
          return true;
        }
        return false;
      },
      rotateRight: () => {
        if (canRotateRight(board, game.state.activePiece)) {
          rotateRight(game.state.activePiece);
          return true;
        }
        return false;
      },
    },
    activeFramework,
    board,
    canMoveDown: () => canMoveDown(game.board, game.state.activePiece),
    canMoveLeft: () => canMoveLeft(game.board, game.state.activePiece),
    canMoveRight: () => canMoveRight(game.board, game.state.activePiece),
    canMoveUp: () => canMoveUp(game.board, game.state.activePiece),
    canRotateLeft: () => canRotateLeft(game.board, game.state.activePiece),
    canRotateRight: () => canRotateRight(game.board, game.state.activePiece),
    clearCheck: (offset: number = 0) => clearCheck(game.detectAndClear, offset),
    clearNonSolids: () => {
      let didClear = 0;
      for (let i = 0; i < board.desc.length; i += 1) {
        if (board.desc[i] % 10 === 0) {
          continue;
        }
        board.desc[i] = 0;

        didClear += 1;
      }
      return didClear;
    },
    detectAndClear: (markOffset = 0) =>
      detectAndClear(board, conf.connectedBlocks, markOffset),
    emit,
    gameOver,
    gravityDrop: () => gravityDrop(board),
    moveBlock: (axis: 'x' | 'y', quantity: number) => {
      move(game.state.activePiece, axis, quantity);
    },
    newBlock: () => {
      game.state.activePiece = game.nextBlock();
      if (conf.debug) {
        debugBlock('New Piece:', game.state.activePiece);
      }
    },
    nextBlock,
    tick: (delta: number) => tick(game, delta),
  };
  return game;
}
