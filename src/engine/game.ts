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
import {
  addBlock,
  canMoveDown,
  removeBlock,
} from './board';
import {
  debugBlock,
  move,
} from './block';
import {
  Block,
  Board,
  GameConfig,
} from '../interfaces';
import {
  copyBuffer,
} from '../util';
import { rotateLeft, rotateRight } from './block';

export function clearCheck(
  buffer: Uint8Array,
  board: Board,
  detectAndClear: () => number,
  forceBufferCopy: boolean
) {
  const cleared = detectAndClear();

  if (cleared || forceBufferCopy) { copyBuffer(board.desc, buffer); }

  return cleared;
}

export function updateBlock(board: Board,
                            block: Block,
                            buffer: Uint8Array,
                            enableShadow: boolean,
                            updateFn: () => any,
                          ) {
  removeBlock(board, block, buffer, enableShadow);
  updateFn();
  addBlock(board, block, buffer, enableShadow);
}

function cartesianControl(
  game, axis: 'x' | 'y', magnitude: number, can: (board: Board, block: Block
  ) => boolean) {
  if (can(game.board, game.state.activePiece)) {
    game.moveBlock(axis, magnitude);
    game.emit('redraw');
  }
}

export function createGame1(
  conf: GameConfig, 
  emit,
  buffer: Uint8Array,
  board: Board,
  detectAndClear,
  nextBlock,
  gameOver,
) {
  const game = {
    state: {
      activePiece: nextBlock(), 
      activePieceHistory: [],
      buffer,
      conf,
      isEnded: false,
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
      endGame: () => {
        game.state.isEnded = true;
      },
      moveDown: () => cartesianControl(game, 'y', 1, conf.canMoveDown),
      moveLeft: () => cartesianControl(game, 'x', -1, conf.canMoveLeft),
      moveRight: () => cartesianControl(game, 'x', 1, conf.canMoveRight),
      moveUp: () => {
        while (conf.canMoveDown(board, game.state.activePiece)) {
          game.moveBlock('y', 1);
        }
        emit('redraw');
      },
      rotateLeft: () => {
        if (conf.canRotateLeft(board, game.state.activePiece)) {
          updateBlock(
            board, game.state.activePiece, buffer, conf.enableShadow,
            () => rotateLeft(game.state.activePiece)
          ),
          emit('redraw');
        }
      },
      rotateRight: () => {
        if (conf.canRotateRight(board, game.state.activePiece)) {
          updateBlock(
            board, game.state.activePiece, buffer, conf.enableShadow,
            () => rotateRight(game.state.activePiece)
          ),
          emit('redraw');
        }
      },
    },
    addBlock,
    board,
    detectAndClear: () => detectAndClear(board),
    emit,
    gameOver,
    moveBlock: (axis: 'x' | 'y', quantity: number) => {
      updateBlock(
        board, 
        game.state.activePiece, 
        buffer, 
        conf.enableShadow, 
        () => {
        move(game.state.activePiece, axis, quantity);
      });
    },
    newBlock: () => {
      game.state.activePieceHistory.unshift(game.state.activePiece);
      game.state.activePiece = game.nextBlock();
      if (conf.debug) {
        debugBlock('New Piece:', game.state.activePiece);
      }
      addBlock(board, game.state.activePiece, buffer, conf.enableShadow);
    },
    nextBlock,
    tick: (delta: number) => tick(game, delta),
  }; 
  return game;
}

function deriveMultiple(level: number, multiplier: number, value: number) {
  if (level <= 1) {
    return value * multiplier;
  }
  return deriveMultiple(level - 1, multiplier, value) * multiplier;
}


function tick(
  game,
  delta: number,
) {
  if (game.isEnded) {
    return;
  }
  const { buffer, conf } = game.state;
  const interval = deriveMultiple(
    game.state.level, conf.speedMultiplier, conf.speed
  );
  if (delta < interval) {
    return false;
  }

  if (!canMoveDown(game.board, game.state.activePiece)) {
    game.addBlock(game.board, game.state.activePiece, game.board.desc, false);
    game.newBlock();
    clearCheck(
      buffer, game.board, game.detectAndClear, conf.forceBufferUpdateOnClear
    );
    if (conf.checkForLoss(game.board, game.state.activePiece)) {
      // game over
      game.gameOver();
    } else {
      game.moveBlock('y', 1);
    }
    game.emit('redraw');
    game.emit('drop');
  } else {
    game.moveBlock('y', 1);
    game.emit('redraw');
  }
  return true;
}
