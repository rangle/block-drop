/**
 * Describes the game board and its actions
 */
import {
  forEach,
  rotateLeft,
  rotateRight,
} from './block';

import {
  Block,
  Board,
  Board1,
  Direction,
} from './interfaces';

export function addBlock(board: Board,
                         block: Block,
                         buffer: Uint8Array = board.desc) {
  forEach(block, (el, x, y, i, j) => {
    const index = indexFromPoint(board.width, x, y);
    if (block.desc[i][j] === 0) {
      return;
    }
    buffer[index] = block.desc[i][j];
  });
}

export function canMoveDown(board: Board, block: Block): boolean {
  const newY =  block.y + 1; 
  const bottomEdge = newY + block.height - block.centreY;
  if (bottomEdge > board.height) {
    return false;
  }
  return !isOverlapping(board, block, block.x, newY);
}

export function canMoveUp(board: Board, block: Block): boolean {
  const newY =  block.y - 1;
  const topEdge = newY - block.centreY;
  if (topEdge < 0) {
    return false;
  }

  return !isOverlapping(board, block, block.x, newY);
}

export function canMoveLeft(board: Board, block: Block): boolean {
  const newX = block.x - 1;
  const leftEdge = newX - block.centreX;
  if (leftEdge < 0) {
    return false;
  }
  return !isOverlapping(board, block, newX, block.y);
}

export function canMoveRight(board: Board, block: Block): boolean {
  const newX = block.x + 1;
  const rightEdge = newX + block.width - block.centreX;
  if (rightEdge > board.width) {
    return false;
  }
  return !isOverlapping(board, block, newX, block.y);
}

/**
 * Simple can rotate function.  Can only rotate if there is space between the
 * edges (left/right/bottom) and blocks
 */
export function canRotateEdges(board: Board, block: Block): boolean {
  const rightEdge = block.x + block.width - block.centreX;
  
  if (rightEdge > board.width - 1) {
    return false;
  }
  
  const leftEdge = block.x - block.centreX;
  
  if (leftEdge <= 0) {
    return false;
  }
  
  const bottomEdge = block.y + block.height - block.centreY;
  
  if (bottomEdge > board.height - 1) {
    return false;
  }
  
  const topEdge = block.y - block.centreY;
  
  if (topEdge <= 0) {
    return false;
  }

  return true;
}

export function canRotateLeft1(board: Board, block: Block): boolean {
  if (!canRotateEdges(board, block)) {
    return false;
  }
  
  rotateLeft(block);
  const result = !isOverlapping(board, block, block.x, block.y);
  rotateRight(block);
  
  return result;
}

export function canRotateRight1(board: Board, block: Block): boolean {
  if (!canRotateEdges(board, block)) {
    return false;
  }
  
  rotateRight(block);
  const result = !isOverlapping(board, block, block.x, block.y);
  rotateLeft(block);
  
  return result;
}

/**
 * Creates a new game board
 */
export function createBoard1(x: number, y: number): Board1 {
  const total = x * y;
  const board = new Uint8Array(total);
  let i;
  
  for (i = 0; i < total; i += 1) {
    board[i] = 0;
  }
  
  return Object.create(null, {
    desc: {
      configurable: true,
      writable: true,
      value: board,
    },
    descBuffer: {
      configurable: true,
      writable: true,
      value: new Uint8Array(total),
    },
    width: {
      configurable: false,
      writable: false,
      value: x,
    },
    height: {
      configurable: false,
      writable: false,
      value: y,
    }
  });
}

/**
 * Populates `descBuffer` with the new state *and* flips `desc`/`descBuffer`
 * 
 * The new state is calculated by checking for solid rows and omitting them 
 * from * the `nextBoard`.  Rows above the cleared rows are moved down by the 
 * number of * rows immediately below them that have been cleared.  Finally the 
 * function * returns the number of rows cleared.
 * 
 * This function is labelled detectAndClear1 because it's conceivable that 
 * alternate algorithms will be considered in the future as well as alternate 
 * rules
 */
export function detectAndClear1(board: Board1): number {
  let clearedRows = 0;
  let newRowOffset = 0;
  let completeRow = true;
  let rowCounter = 0;
  
  for (let i = board.desc.length - 1; i >= 0; i -= 1) {
    if (board.desc[i] === 0) {
      completeRow = false;
    }
    
    board.descBuffer[i + newRowOffset] = board.desc[i];

    rowCounter += 1;

    if (rowCounter === board.width) {
      if (completeRow) {
        newRowOffset += board.width;
        clearedRows += 1;
      }
      rowCounter = 0;
      completeRow = true;
    }
  }

  // clear any remaining bits
  for (let i = 0; i < newRowOffset; i += 1) {
    board.descBuffer[i] = 0;
  }

  // swap buffer
  [board.desc, board.descBuffer] = [board.descBuffer, board.desc];

  return clearedRows;
}

export function indexFromPoint(width: number, x: number, y: number): number {
  return y * width + x;
}

/**
 * Simple test to see if a block's position overlaps other blocks on the board
 */
export function isOverlapping(board: Board,
                              block: Block, 
                              newX: number = block.x,
                              newY: number = block.y): boolean {
  let overlaps = false;
  
  for (let j = block.height - 1; j >= 0; j -= 1) {
    if (overlaps) {
      break;
    }
    
    let testY;
    
    if (j < block.centreY) {
      testY = newY - block.centreY + j;
    } else if (j === block.centreY) {
      testY = newY;
    } else {
      testY = newY + j - block.centreY;
    }

    for (let i = 0; i < block.width; i += 1) {
      let testX;

      if (i < block.centreX) {
        testX = newX - block.centreX + i;
      } else if (i === block.centreX) {
        testX = newX;
      } else {
        testX = newX + i - block.centreX;
      }

      const index = indexFromPoint(board.width, testX, testY);
      if (board.desc[index] !== 0) {
        if (block.desc[i][j] !== 0) {
          overlaps = true;
          break;
        }
      }
    }
  }
  
  return overlaps;
}

export function removeBlock(board: Board,
                           block: Block,
                           buffer: Uint8Array = board.desc) {

  forEach(block, (el, x, y, i, j) => {
    const index = indexFromPoint(board.width, x, y);
    if (block.desc[i][j] === 0) {
      return;
    }
    buffer[index] = 0;
  });
}
