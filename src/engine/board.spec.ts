import { createBlock } from './block';

import {
  addBlock,
  canMoveDown,
  canMoveUp,
  canMoveLeft,
  canMoveRight,
  canRotateEdges,
  canRotateLeft1,
  canRotateRight1,
  createBoard1,
  detectAndClear1,
  detectAndClearTile1,
  detectAndClear2,
  gravityDropTile,
  indexFromPoint,
  isOverlapping,
  removeBlock,
  SHADOW_OFFSET,
} from './board';

describe('game-board functions', () => {
  describe('addBlock function', () => {
    it('should add a block to a board, 1x3', () => {
      const board = createBoard1(10, 10);
      addBlock(board, createBlock([[1], [2], [3]], 5, 0));
      expect(board.desc[4]).toBe(1);
      expect(board.desc[5]).toBe(2);
      expect(board.desc[6]).toBe(3);
    });

    it('should add a block to a board, 2x3 holes', () => {
      const board = createBoard1(10, 10);
      addBlock(board, createBlock([[1, 0], [0, 2], [3, 0]], 5, 0));
      expect(board.desc[4]).toBe(1);
      expect(board.desc[5]).toBe(0);
      expect(board.desc[6]).toBe(3);
      expect(board.desc[14]).toBe(0);
      expect(board.desc[15]).toBe(2);
      expect(board.desc[16]).toBe(0);
    });
  });

  describe('canMoveDown', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it(
      'should return false if the bottom of the block is lower than the ' +
        'height of the board',
      () => {
        const block = createBlock([[1, 1, 1]]);
        block.x = 4;
        block.y = 8;
        expect(canMoveDown(board, block)).toBe(false);
      },
    );

    it('should return false if the block will overlap other blocks', () => {
      const block = createBlock([[1, 1, 1]]);
      block.x = 4;
      block.y = 7;
      populateBoard(board);
      expect(canMoveDown(board, block)).toBe(false);
    });
  });

  describe('canMoveUp', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it('should return false if the bottom of the block is lower than zero', () => {
      const block = createBlock([[1, 1, 1]]);
      block.x = 4;
      block.y = 1;
      expect(canMoveUp(board, block)).toBe(false);
    });

    it('should return false if the block will overlap other blocks', () => {
      const block = createBlock([[1, 1, 1]]);
      block.x = 4;
      block.y = 2;
      populateBoard(board);
      expect(canMoveUp(board, block)).toBe(false);
    });
  });

  describe('canMoveLeft', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it(
      'should return false if the left edge is at the left edge of the ' +
        'board',
      () => {
        const block = createBlock([[1], [1], [1]]);
        block.x = 1;
        block.y = 5;
        expect(canMoveLeft(board, block)).toBe(false);
      },
    );

    it('should return false if the block will overlap other blocks', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 2;
      block.y = 5;
      populateBoard(board);
      expect(canMoveLeft(board, block)).toBe(false);
    });
  });

  describe('canMoveRight', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it(
      'should return false if the right edge is at the left edge of the ' +
        'board',
      () => {
        const block = createBlock([[1], [1], [1]]);
        block.x = 8;
        block.y = 5;
        expect(canMoveRight(board, block)).toBe(false);
      },
    );

    it('should return false if the block will overlap other blocks', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 7;
      block.y = 5;
      populateBoard(board);
      expect(canMoveRight(board, block)).toBe(false);
    });
  });

  describe('canRotateEdges function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it('should not be able to rotate something pressed against the left edge', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 0;
      block.y = 5;
      expect(canRotateEdges(board, block)).toBe(false);
    });

    it('should not be able to rotate something pressed against the right edge', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 9;
      block.y = 5;
      expect(canRotateEdges(board, block)).toBe(false);
    });

    it('should not be able to rotate something pressed against the bottom edge', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 5;
      block.y = 9;
      expect(canRotateEdges(board, block)).toBe(false);
    });

    it('should not be able to rotate something pressed against the top edge', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 5;
      block.y = 0;
      expect(canRotateEdges(board, block)).toBe(false);
    });

    it('should be able to rotate something that is not on the edges', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 5;
      block.y = 5;
      expect(canRotateEdges(board, block)).toBe(true);
    });
  });

  describe('canRotateLeft1 function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it('should not rotate if it will overlap other tiles: 3x1', () => {
      const block = createBlock([[1], [1], [1]]);
      populateBoard(board);
      block.x = 5;
      block.y = 8;
      expect(isOverlapping(board, block)).toBe(false);
      expect(canRotateLeft1(board, block)).toBe(false);
      block.y = 7;
      expect(canRotateLeft1(board, block)).toBe(true);
    });
  });

  describe('canRotateRight1 function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it('should not rotate if it will overlap other tiles: 3x1', () => {
      const block = createBlock([[1], [1], [1]]);
      block.x = 5;
      block.y = 8;
      populateBoard(board);
      expect(isOverlapping(board, block)).toBe(false);
      expect(canRotateRight1(board, block)).toBe(false);
      block.y = 7;
      expect(canRotateLeft1(board, block)).toBe(true);
    });
  });

  describe('createBoard1 function', () => {
    it('should return a board with a desc array that is x * y long', () => {
      expect(createBoard1(5, 5).desc.length).toBe(5 * 5);
    });

    it('should return a board with a desc that is a Uint8Array', () => {
      expect(createBoard1(5, 5).desc instanceof Uint8Array).toBe(true);
    });

    it("should set the board's width", () => {
      expect(createBoard1(5, 7).width).toBe(5);
    });

    it("should set the board's height", () => {
      expect(createBoard1(5, 7).height).toBe(7);
    });

    it('width property should be immutable', () => {
      const board = createBoard1(5, 7);
      expect(() => (board.width = 44)).toThrowError();
    });

    it('height property should be immutable', () => {
      const board = createBoard1(5, 7);
      expect(() => (board.height = 44)).toThrowError();
    });

    it('desc should be mutable', () => {
      const board = createBoard1(5, 7);
      expect(() => (board.desc = new Uint8Array(1))).not.toThrowError();
    });

    it('descBuffer should be mutable', () => {
      const board = createBoard1(5, 7);
      expect(() => (board.descBuffer = new Uint8Array(1))).not.toThrowError();
    });
  });

  describe('detectAndClear1 function', () => {
    describe('single bottom row case', () => {
      it('should solve a simple 3x3', () => {
        const board = Uint8Array.from([0, 1, 0, 1, 0, 1, 7, 8, 9]);
        const next = new Uint8Array(9);
        const result = detectAndClear1({
          width: 3,
          height: 3,
          desc: board,
          descBuffer: next,
        });

        expect(next).toEqual(Uint8Array.from([0, 0, 0, 0, 1, 0, 1, 0, 1]));
        expect(result.total).toBe(1);
      });

      it('should solve a simple 5x5', () => {
        const board = Uint8Array.from([
          0,
          1,
          0,
          0,
          1,
          1,
          0,
          1,
          2,
          3,
          7,
          8,
          9,
          0,
          2,
          1,
          2,
          3,
          4,
          0,
          5,
          1,
          2,
          3,
          4,
        ]);
        const next = new Uint8Array(25);
        const result = detectAndClear1({
          width: 5,
          height: 5,
          desc: board,
          descBuffer: next,
        });

        expect(next).toEqual(
          Uint8Array.from([
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            1,
            1,
            0,
            1,
            2,
            3,
            7,
            8,
            9,
            0,
            2,
            1,
            2,
            3,
            4,
            0,
          ]),
        );

        expect(result.total).toBe(1);
      });
    });

    describe('double bottom row case', () => {
      it('should solve a simple 3x3', () => {
        const board = Uint8Array.from([0, 1, 0, 1, 1, 1, 7, 8, 9]);
        const next = new Uint8Array(9);
        const result = detectAndClear1({
          width: 3,
          height: 3,
          desc: board,
          descBuffer: next,
        });

        expect(next).toEqual(Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 1, 0]));
        expect(result.total).toBe(2);
      });

      it('should solve a simple 5x5', () => {
        const board = Uint8Array.from([
          0,
          1,
          0,
          0,
          1,
          1,
          0,
          1,
          2,
          3,
          7,
          8,
          9,
          0,
          2,
          1,
          2,
          3,
          4,
          7,
          5,
          1,
          2,
          3,
          4,
        ]);
        const next = new Uint8Array(25);
        const result = detectAndClear1({
          width: 5,
          height: 5,
          desc: board,
          descBuffer: next,
        });

        expect(next).toEqual(
          Uint8Array.from([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            1,
            1,
            0,
            1,
            2,
            3,
            7,
            8,
            9,
            0,
            2,
          ]),
        );

        expect(result.total).toBe(2);
      });
    });

    describe('triple row case', () => {
      it('should solve a simple 3x3', () => {
        const board = Uint8Array.from([1, 1, 1, 1, 1, 1, 7, 8, 9]);
        const next = new Uint8Array(9);
        const result = detectAndClear1({
          width: 3,
          height: 3,
          desc: board,
          descBuffer: next,
        });

        expect(next).toEqual(Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        expect(result.total).toBe(3);
      });

      it('should solve a simple 5x5', () => {
        const board = Uint8Array.from([
          0,
          1,
          0,
          0,
          1,
          1,
          1,
          1,
          2,
          3,
          7,
          8,
          9,
          0,
          2,
          1,
          2,
          3,
          4,
          7,
          5,
          1,
          2,
          3,
          4,
        ]);
        const next = new Uint8Array(25);
        const result = detectAndClear1({
          width: 5,
          height: 5,
          desc: board,
          descBuffer: next,
        });

        expect(next).toEqual(
          Uint8Array.from([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            1,
            7,
            8,
            9,
            0,
            2,
          ]),
        );

        expect(result.total).toBe(3);
      });
    });
  });

  describe('detectAndClearTile1 function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it('should throw if given a negative range', () => {
      expect(() => detectAndClearTile1(board, -1)).toThrowError();
    });

    it('should throw if given an excessive range', () => {
      expect(() => detectAndClearTile1(board, 100)).toThrowError();
    });

    it('should return the given adjacents array if tile at offset is 0', () => {
      const adj = [27];
      const result = detectAndClearTile1(board, 5, adj);
      expect(result).toBe(adj);
      expect(result).toEqual([27]);
    });

    it(
      'should add the given tile to adjacents if tile is non-zero and given ' +
        'value is zero or omitted',
      () => {
        board.desc[5] = 10;
        const adj = [];
        detectAndClearTile1(board, 5, adj);
        expect(adj[0]).toBe(5);
      },
    );

    it('should not add a value twice', () => {
      board.desc[5] = 7;
      const adj = [5];
      detectAndClearTile1(board, 5, adj);
      expect(adj.length).toBe(1);
    });

    it(
      "should add the given tile to adjacents if tile's value matches " +
        'given value',
      () => {
        board.desc[5] = 10;
        const adj = [];
        detectAndClearTile1(board, 5, adj, [], 10);
        expect(adj[0]).toBe(5);
      },
    );

    it('should return adjacents if on the last (bottom right) tile', () => {
      board.desc[99] = 10;
      const adj = [];
      detectAndClearTile1(board, 99, adj);
      expect(adj).toEqual([99]);
    });

    it('should not match the east (right) tile if its value is different', () => {
      board.desc[5] = 10;
      board.desc[6] = 20;
      const adj = [];
      detectAndClearTile1(board, 5, adj);
      expect(adj[0]).toBe(5);
      expect(adj.length).toBe(1);
    });

    it('should not match the west (left) tile if its value is different', () => {
      board.desc[5] = 10;
      board.desc[4] = 20;
      const adj = [];
      detectAndClearTile1(board, 5, adj);
      expect(adj[0]).toBe(5);
      expect(adj.length).toBe(1);
    });

    it('should not match the south (bottom) tile if its value is different', () => {
      board.desc[5] = 10;
      board.desc[15] = 20;
      const adj = [];
      detectAndClearTile1(board, 5, adj);
      expect(adj[0]).toBe(5);
      expect(adj.length).toBe(1);
    });

    it('should match the east (right) tile if its value matches', () => {
      board.desc[5] = 10;
      board.desc[6] = 10;
      const adj = [];
      detectAndClearTile1(board, 5, adj);
      expect(adj[0]).toBe(5);
      expect(adj.length).toBe(2);
    });

    it('should match the west (left) tile if its value matches', () => {
      board.desc[5] = 10;
      board.desc[4] = 10;
      const adj = [];
      detectAndClearTile1(board, 5, adj);
      expect(adj[0]).toBe(5);
      expect(adj.length).toBe(2);
    });

    it('should match the south (bottom) tile if its value matches', () => {
      board.desc[5] = 10;
      board.desc[15] = 10;
      const adj = [];
      detectAndClearTile1(board, 5, adj);
      expect(adj[0]).toBe(5);
      expect(adj.length).toBe(2);
    });

    it(
      "should not match the east (right) tile if it's on the east (right) " +
        'edge',
      () => {
        board.desc[9] = 10;
        board.desc[10] = 10;
        const adj = [];
        detectAndClearTile1(board, 9, adj);
        expect(adj[0]).toBe(9);
        expect(adj.length).toBe(1);
      },
    );

    it("should not match the west (left) tile if it's on the west (left) edge", () => {
      board.desc[9] = 10;
      board.desc[10] = 10;
      const adj = [];
      detectAndClearTile1(board, 10, adj);
      expect(adj[0]).toBe(10);
      expect(adj.length).toBe(1);
    });

    it('should not match the east (right) tile if skip is "right"', () => {
      board.desc[8] = 10;
      board.desc[9] = 10;
      const adj = [];
      detectAndClearTile1(board, 8, adj, [], 10, 'right');
      expect(adj[0]).toBe(8);
      expect(adj.length).toBe(1);
    });

    it('should not match the west (left) tile if skip is "left"', () => {
      board.desc[8] = 10;
      board.desc[9] = 10;
      const adj = [];
      detectAndClearTile1(board, 9, adj, [], 10, 'left');
      expect(adj[0]).toBe(9);
      expect(adj.length).toBe(1);
    });

    it('should not match tiles that are not divisible by 10', () => {
      board.desc[8] = 7;
      const adj = [];
      detectAndClearTile1(board, 9, adj, [], 10, 'left');
      expect(adj[0]).toBe(undefined);
      expect(adj.length).toBe(0);
    });

    it('should match the following case study (1)', () => {
      board = createBoard1(7, 4);
      board.desc[5] = 10;
      board.desc[11] = 10;
      board.desc[12] = 10;
      board.desc[15] = 10;
      board.desc[19] = 10;
      board.desc[20] = 10;
      board.desc[21] = 10;
      board.desc[22] = 10;
      board.desc[23] = 10;
      board.desc[24] = 10;
      board.desc[25] = 10;
      board.desc[26] = 10;
      const adj = detectAndClearTile1(board, 5);
      expect(adj.length).toBe(12);
    });
  });

  describe('detectAndClear2 function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it('should return 0 if given an empty board', () => {
      expect(detectAndClear2(board).total).toBe(0);
    });

    it('should return 0 if given a checkerboard', () => {
      board = checkerboard();
      expect(detectAndClear2(board).total).toBe(0);
    });
  });

  describe('gravityDropTile function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
    });

    it("should do nothing if it's in the top row", () => {
      const initBoard = board.desc.slice(0);

      gravityDropTile(board, 5);

      expect(board.desc).toEqual(initBoard);
    });

    it('should execute against the above tile', () => {
      board.desc[5] = 1;
      expect(board.desc[15]).toBe(0);
      gravityDropTile(board, 5);
      expect(board.desc[15]).toBe(1);
    });
  });

  describe('indexFromPoint function', () => {
    it('should return 0 for 0, 0', () => {
      expect(indexFromPoint(250, 0, 0)).toBe(0);
    });

    it('should return x if y is 0', () => {
      expect(indexFromPoint(5000, 45, 0)).toBe(45);
      expect(indexFromPoint(200, 5, 0)).toBe(5);
    });

    it('should return 10 if given a width of 10 a y of 1 and an x of 0', () => {
      expect(indexFromPoint(10, 0, 1)).toBe(10);
    });

    it('should return 11 if given a width of 10 a y of 1 and an x of 1', () => {
      expect(indexFromPoint(10, 1, 1)).toBe(11);
    });
  });

  describe('isOverlapping function', () => {
    let board;

    beforeEach(() => {
      board = createBoard1(10, 10);
      populateBoard(board);
    });

    it('should detect a basic overlap: 3x1', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(isOverlapping(board, block, 4, 9)).toBe(true);
    });

    it('should detect a basic overlap: 1x3', () => {
      const block = createBlock([[1, 1, 1]]);
      expect(isOverlapping(board, block, 4, 8)).toBe(true);
    });

    it('should detect a basic non-overlap: 3x1', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(isOverlapping(board, block, 4, 8)).toBe(false);
    });

    it('should detect a basic non-overlap: 1x3', () => {
      const block = createBlock([[1, 1, 1]]);
      expect(isOverlapping(board, block, 4, 7)).toBe(false);
    });

    it('should not include blank spaces on the object', () => {
      const block = createBlock([[0, 1, 1], [0, 1, 1], [0, 1, 1]]);

      expect(isOverlapping(board, block, 5, 1)).toBe(false);
    });

    it('should treat shadow offsets as zeros', () => {
      for (let i = 0; i < board.desc.length; i += 1) {
        if (board.desc[i] === 0) {
          if (i % 2 === 0) {
            board.desc[i] = SHADOW_OFFSET + 10;
          } else {
            board.desc[i] = SHADOW_OFFSET + 20;
          }
        }
      }
      const block = createBlock([[1, 1, 1]]);
      expect(isOverlapping(board, block, 4, 7)).toBe(false);
    });
  });

  describe('removeBlock function', () => {
    it('should remove a block to a board, 1x3', () => {
      const board = createBoard1(10, 10);
      addBlock(board, createBlock([[1], [2], [3]], 5, 0));
      removeBlock(board, createBlock([[1], [2], [3]], 5, 0));
      expect(board.desc[4]).toBe(0);
      expect(board.desc[5]).toBe(0);
      expect(board.desc[6]).toBe(0);
    });

    it('should remove a block to a board, 2x3 holes', () => {
      const board = createBoard1(10, 10);
      addBlock(board, createBlock([[1, 0], [0, 2], [3, 0]], 5, 0));
      removeBlock(board, createBlock([[1, 0], [0, 2], [3, 0]], 5, 0));
      expect(board.desc[4]).toBe(0);
      expect(board.desc[5]).toBe(0);
      expect(board.desc[6]).toBe(0);
      expect(board.desc[14]).toBe(0);
      expect(board.desc[15]).toBe(0);
      expect(board.desc[16]).toBe(0);
    });
  });
});

function populateBoard(board) {
  for (let i = 99; i > 89; i -= 1) {
    board.desc[i] = 1;
  }

  for (let i = 0; i < 10; i += 1) {
    board.desc[i] = 1;
  }

  for (let i = 0; i < 100; i += 10) {
    board.desc[i] = 1;
    board.desc[i + 9] = 1;
  }
}

function checkerboard() {
  const b = createBoard1(9, 9);
  for (let i = 0; i < b.desc.length; i += 2) {
    b.desc[i] = 1;
  }
  return b;
}
