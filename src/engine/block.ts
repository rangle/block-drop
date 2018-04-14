/**
 * shortcut for importing blocks from arrays
 */
import { Block, Direction, Matrix } from '../interfaces';

import {
  rotateLeft as rotateMatrixLeft,
  rotateRight as rotateMatrixRight,
} from './matrix';

import { deepFreeze, intMidCeil, intMidFloor } from '../util';
import { makeCollection } from './function-collection';

export default {
  createBlock: makeCollection<
    (desc: Matrix, posX: number, posY: number, name: string) => Block
  >(
    {
      createBlock1: createBlock,
    },
    createBlock,
  ),
};

export function columnsFromBlock(block: Block) {
  const cols = [];
  let desc = [];
  let lastJ = 0;

  forEach(block, (el, _, __, ___, j) => {
    if (j !== lastJ) {
      cols.push(desc);
      desc = [];
      lastJ = j;
    }
    desc.push(el);
  });
  cols.push(desc);
  return cols;
}

export function createBlock(
  desc: Matrix,
  posX: number = 0,
  posY: number = 0,
  name: string = 'block',
): Block {
  if (!Array.isArray(desc)) {
    throw new TypeError('createBlock requires desc to be an array');
  }

  if (!desc.length) {
    throw new TypeError('createBlock requires desc to have length');
  }

  let width = desc.length;

  if (!Array.isArray(desc[0])) {
    throw new TypeError('createBlock requires desc to be a 2d array');
  }

  if (!desc[0].length) {
    throw new TypeError(
      "createBlock request desc's second dimension to " + 'have length',
    );
  }

  let height = desc[0].length;

  return Object.create(null, {
    centreX: {
      configurable: true,
      writable: true,
      value: intMidFloor(width),
    },
    centreY: {
      configurable: true,
      writable: true,
      value: intMidFloor(height),
    },
    desc: {
      configurable: true,
      writable: true,
      value: deepFreeze(desc),
    },
    descUp: {
      configurable: false,
      writable: false,
      value: deepFreeze(desc),
    },
    descDown: {
      configurable: false,
      writable: false,
      value: deepFreeze(rotateMatrixRight(rotateMatrixRight(desc))),
    },
    descLeft: {
      configurable: false,
      writable: false,
      value: deepFreeze(rotateMatrixLeft(desc)),
    },
    descRight: {
      configurable: false,
      writable: false,
      value: deepFreeze(rotateMatrixRight(desc)),
    },
    name: {
      configurable: false,
      writable: false,
      value: name,
    },
    orientation: {
      configurable: true,
      writable: true,
      value: Direction.Up,
    },
    x: {
      configurable: true,
      writable: true,
      value: posX,
    },
    y: {
      configurable: true,
      writable: true,
      value: posY,
    },
    width: {
      configurable: true,
      writable: true,
      value: width,
    },
    height: {
      configurable: true,
      writable: true,
      value: height,
    },
  });
}

export function debugBlock(msg: string, block: Block) {
  const { desc, name, x, y } = block;
  /* tslint:disable no-console */
  console.log(`${msg} name: ${name} x: ${x} y: ${y} shape: ${desc}`);
}

export function forEach(
  block: Block,
  fn: (
    el: number,
    boardX: number,
    boardY: number,
    blockX: number,
    blockY: number,
  ) => void,
) {
  for (let j = 0; j < block.height; j += 1) {
    let posY;

    if (j < block.centreY) {
      posY = block.y - block.centreY + j;
    } else if (j === block.centreY) {
      posY = block.y;
    } else {
      posY = block.y + j - block.centreY;
    }

    for (let i = 0; i < block.width; i += 1) {
      let posX;

      if (i < block.centreX) {
        posX = block.x - block.centreX + i;
      } else if (i === block.centreX) {
        posX = block.x;
      } else {
        posX = block.x + i - block.centreX;
      }

      fn(block.desc[i][j], posX, posY, i, j);
    }
  }
}

export function move(block: Block, axis: 'x' | 'y', value: number) {
  block[axis] += value;
}

export function up(block: Block) {
  block.desc = block.descUp;
  block.orientation = Direction.Up;
  block.width = block.desc.length;
  block.height = block.desc[0].length;
  block.centreX = intMidFloor(block.width);
  block.centreY = intMidFloor(block.height);
}

export function down(block: Block) {
  block.desc = block.descDown;
  block.orientation = Direction.Down;
  block.width = block.desc.length;
  block.height = block.desc[0].length;
  block.centreX = intMidCeil(block.width);
  block.centreY = intMidCeil(block.height);
}

export function left(block: Block) {
  block.desc = block.descLeft;
  block.orientation = Direction.Left;
  block.width = block.desc.length;
  block.height = block.desc[0].length;
  block.centreX = intMidFloor(block.width);
  block.centreY = intMidFloor(block.height);
}

export function right(block: Block) {
  block.desc = block.descRight;
  block.orientation = Direction.Right;
  block.width = block.desc.length;
  block.height = block.desc[0].length;
  block.centreX = intMidCeil(block.width);
  block.centreY = intMidCeil(block.height);
}

export function rotateLeft(block: Block) {
  [block.height, block.width] = [block.width, block.height];

  switch (block.orientation) {
    case Direction.Down:
      right(block);
      break;
    case Direction.Left:
      down(block);
      break;
    case Direction.Right:
      up(block);
      break;
    default:
      left(block);
      break;
  }
}

export function rotateRight(block: Block) {
  [block.height, block.width] = [block.width, block.height];

  switch (block.orientation) {
    case Direction.Down:
      left(block);
      break;
    case Direction.Left:
      up(block);
      break;
    case Direction.Right:
      down(block);
      break;
    default:
      right(block);
      break;
  }
}
