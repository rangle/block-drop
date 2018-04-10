import { 
  up, 
} from './block';

import {
  canMoveDown, DC2MAX,
} from './board';

import { 
  Block,
  Board,
  Game,
} from '../interfaces';

import { 
  intMidFloor,
  invertBoolean,
} from '../util';

const CLEAR_OFFSET = 1;

export function gameOver1(engine: { gameOver: () => any }, board?: Board) {
  // must call game over when done
  engine.gameOver();
}

export const checkForLoss1 = invertBoolean(canMoveDown);

export function spawn1(width: number, height: number, block: Block): Block {
  up(block);
  block.x = intMidFloor(width);
  block.y = 0;

  return block;
}

function tick1ClearDelay(game: Game, delta: number) {
  if (delta < (
    game.state.conf.clearDelay * (
      game.state.cascadeCount > 1 ?
        1 + game.state.cascadeCount * 0.1 :
        1
    )
  )) {
    return false;
  }
  const cleared = game.clearNonSolids();
  if (cleared) {
    game.gravityDrop();

    if (tick1tryAndScore(game, game.state.cascadeCount * 3)) {
      // if we have score, increment the cascade count
      game.state.cascadeCount += 1;
    } else {
      // if we have no more score end the animation
      game.state.cascadeCount = 1;
      game.state.isClearDelay = false;
    }
    game.emit('redraw');
  } else {
    console.warn('tick1ClearDelay: no non solids cleared');
    // No non slids
    game.state.cascadeCount = 1;
    game.state.isClearDelay = false;
  }
  return true;
}

export function tick1(
  game: Game,
  delta: number,
) {
  if (game.state.isEnded) {
    return;
  }
  if (game.state.isClearDelay) {
    return tick1ClearDelay(game, delta);
  }
  const { conf, level } = game.state;
  const interval = deriveMultiple(
    level, conf.speedMultiplier, conf.speed
  );
  if (delta < interval) {
    return false;
  }

  if (game.state.conf.canMoveDown(game.board, game.state.activePiece)) {
    game.moveBlock('y', 1);
    game.emit('redraw');
  } else {
    game.addBlock(game.board, game.state.activePiece, game.board.desc, false);
    if (tick1tryAndScore(game)) {
      game.state.isClearDelay = true;
    }
    game.newBlock();
    if (conf.checkForLoss(game.board, game.state.activePiece)) {
      // game over
      game.gameOver();
    } else {
      game.moveBlock('y', 1);
    }
    game.emit('redraw');
    game.emit('drop');
  }
  return true;

}

function deriveMultiple(level: number, multiplier: number, value: number) {
  if (level <= 1) {
    return value * multiplier;
  }
  return deriveMultiple(level - 1, multiplier, value) * multiplier;
}

function tick1tryAndScore(game: Game, multiplier = 1) {
  const cleared = game.clearCheck(CLEAR_OFFSET);
  if (!cleared) {
    return false;
  }
  // increment tilesCleared
  game.state.tilesCleared += cleared;

  // compute score for clearing tiles
  const overflow = cleared - DC2MAX;
  const clearScore = overflow * game.state.level *
    game.state.conf.tileScoreMultiplier;

  const {
    conf, nextLevelThreshold, tilesCleared, tilesClearedPrev
  } = game.state;
  const tilesClearedSinceLevel = tilesCleared - tilesClearedPrev;

  let levelScore = 0;

  if (tilesClearedSinceLevel > nextLevelThreshold) {
    levelScore += conf.baseLevelScore;
    game.state.level += 1;
    levelScore += (tilesClearedSinceLevel - game.state.level) *
      conf.tileScoreMultiplier * game.state.level;
    game.state.nextLevelThreshold *= conf.nextLevelMultiplier;
    game.state.tilesClearedPrev = game.state.tilesClearedPrev +
      nextLevelThreshold;
  }

  game.state.score += (clearScore + levelScore) * multiplier;

  game.emit('score', {
    animationDelay: game.state.conf.clearDelay,
    cleared,
    clearScore,
    levelScore,
  });

  return true;
}
