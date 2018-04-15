import { up } from './block';

import { makeCollection } from './function-collection';

import { canMoveDown, DC2MAX, addBlock } from './board';

import { Block, Game } from '../interfaces';

import { intMidFloor, invertBoolean } from '../util';

export default {
  spawns: makeCollection<(width: number, _: any, block: Block) => Block>(
    {
      spawn1,
    },
    spawn1,
  ),
  ticks: makeCollection<(game: Game, delta: number) => boolean>(
    {
      tick1,
    },
    tick1,
  ),
};

const CLEAR_OFFSET = 1;

export const checkForLoss1 = invertBoolean(canMoveDown);

export function spawn1(width: number, _, block: Block): Block {
  up(block);
  block.x = intMidFloor(width);
  block.y = 0;

  return block;
}

function tick1ClearDelayHadAnimationArtifacts(game: Game) {
  game.gravityDrop();

  if (tick1tryAndScore(game, game.state.cascadeCount * 3)) {
    // if we have score, increment the cascade count
    game.state.cascadeCount += 1;
  } else {
    // if we have no more score end the animation
    game.state.cascadeCount = 1;
    game.state.isClearDelay = false;
  }
}

function tick1ClearDelayReset(game: Game) {
  console.warn('tick1ClearDelay: no non solids cleared');
  // No non slids
  game.state.cascadeCount = 1;
  game.state.isClearDelay = false;
}

function tick1ClearAnimationDelay(game: Game, delta: number) {
  if (
    delta <
    game.state.conf.clearDelay *
      (game.state.cascadeCount > 1 ? 1 + game.state.cascadeCount * 0.1 : 1)
  ) {
    return false;
  }
  const animationArtifacts = game.clearNonSolids();
  if (animationArtifacts) {
    tick1ClearDelayHadAnimationArtifacts(game);
  } else {
    tick1ClearDelayReset(game);
  }
  return true;
}

function tick1Main(game: Game) {
  if (game.canMoveDown()) {
    game.moveBlock('y', 1);
  } else {
    // commit the block
    addBlock(game.board, game.state.activePiece, game.board.desc, false);
    game.gravityDrop();

    // check for score
    if (tick1tryAndScore(game)) {
      game.state.isClearDelay = true;
    }
    game.newBlock();
    if (checkForLoss1(game.board, game.state.activePiece)) {
      // game over
      game.gameOver();
    }
    game.emit('drop');
  }
}

export function tick1(game: Game, delta: number) {
  if (game.state.isEnded) {
    return;
  }
  if (game.state.isClearDelay) {
    return tick1ClearAnimationDelay(game, delta);
  }
  const { conf, level } = game.state;
  const interval = deriveMultiple(level, conf.speedMultiplier, conf.speed);
  if (delta < interval) {
    return false;
  }

  tick1Main(game);

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
  if (!cleared.total) {
    return false;
  }
  // increment tilesCleared
  game.state.tilesCleared += cleared.total;

  // compute score for clearing tiles
  const overflow = cleared.total - DC2MAX;
  const clearScore = game.state.level * game.state.conf.tileScoreMultiplier;
  const overflowBonus = clearScore * overflow;
  const fwBonus = cleared.breakdown.reduce((s: number, el) => {
    if (el.fw === game.activeFramework()) {
      s += el.total * 2;
    }
    return s;
  }, 0);

  const {
    conf,
    nextLevelThreshold,
    tilesCleared,
    tilesClearedPrev,
  } = game.state;
  const tilesClearedSinceLevel = tilesCleared - tilesClearedPrev;

  let levelScore = 0;

  if (tilesClearedSinceLevel > nextLevelThreshold) {
    levelScore += conf.baseLevelScore;
    game.state.level += 1;
    levelScore += tilesClearedSinceLevel - game.state.level;
    game.state.nextLevelThreshold *= conf.nextLevelMultiplier;
    game.state.tilesClearedPrev =
      game.state.tilesClearedPrev + nextLevelThreshold;
  }

  game.state.score += Math.floor(
    (clearScore + levelScore + overflowBonus + fwBonus) * multiplier,
  );

  game.emit('score', {
    animationDelay: game.state.conf.clearDelay,
    cleared,
    clearScore,
    levelScore,
    fwBonus,
    overflowBonus,
    score: game.state.score,
  });

  return true;
}
