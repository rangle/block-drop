import {
  columnsFromBlock,
  createBlock,
  forEach,
  rotateLeft,
  rotateRight,
} from './block';

import { Direction } from '../interfaces';

describe('block functions', () => {
  describe('columnsFromBlock', () => {
    it('should turn a block into a matrix organized by columns', () => {
      const block = createBlock([[1, 1, 1]]);
      const cols = columnsFromBlock(block);
      expect(cols.length).toBe(3);
    });
  });

  describe('createBlock', () => {
    it('should throw if given a desc that is not an array', () => {
      expect(() => createBlock(<Array<number[]>>{})).toThrowError();
    });

    it('should throw if a given desc has no length', () => {
      expect(() => createBlock([])).toThrowError();
    });

    it("should throw if given a desc's second dimension is not an array", () => {
      expect(() => createBlock([<Array<number>>{}])).toThrowError();
    });

    it('should throw if a given descs second dimension has no length', () => {
      expect(() => createBlock([[]])).toThrowError();
    });

    it('should return a block with an immutable description', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.desc[0] = [5])).toThrowError();
    });

    it('should return a block a *mutable reference* to the description', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.desc = [[]])).not.toThrowError();
    });

    it('should return a block with an immutable descUp', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descUp[0] = [5])).toThrowError();
    });

    it('should return a block an immutable reference to descUp', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descUp = [[]])).toThrowError();
    });

    it('should return a block with an immutable descDown', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descDown[0] = [5])).toThrowError();
    });

    it('should return a block an immutable reference to descDown', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descDown = [[]])).toThrowError();
    });

    it('should return a block with an immutable descLeft', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descLeft[0] = [5])).toThrowError();
    });

    it('should return a block an immutable reference to descLeft', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descLeft = [[]])).toThrowError();
    });

    it('should return a block with an immutable descRight', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descRight[0] = [5])).toThrowError();
    });

    it('should return a block an immutable reference to descRight', () => {
      const block = createBlock([[1], [1], [1]]);
      expect(() => (block.descRight = [[]])).toThrowError();
    });
  });

  describe('forEach function', () => {
    it('should iterate over each element in the block', () => {
      let result = [];
      const block = createBlock([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      forEach(block, el => {
        result.push(el);
      });
      expect(result).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
    });

    it('should call back with board positions', () => {
      let result = [];
      const block = createBlock([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 0, 0);
      forEach(block, (_, x, y) => {
        result.push({ x, y });
      });
      expect(result).toEqual([
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]);
    });

    it('should call back with four length board positions', () => {
      let result = [];
      const block = createBlock(
        [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0, 1, 2]],
        0,
        0,
      );
      forEach(block, (_, x, y) => {
        result.push({ x, y });
      });
      expect(result).toEqual([
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 2, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]);
    });

    it('should call back with five length board positions', () => {
      let result = [];
      const block = createBlock(
        [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0, 1, 2], [3, 4, 5]],
        0,
        0,
      );
      forEach(block, (_, x, y) => {
        result.push({ x, y });
      });
      expect(result).toEqual([
        { x: -2, y: -1 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 2, y: -1 },
        { x: -2, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: -2, y: 1 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]);
    });

    it('should call back with iterator positions', () => {
      let result = [];
      const block = createBlock([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      forEach(block, (_, __, ___, i, j) => {
        result.push({ x: i, y: j });
      });
      expect(result).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ]);
    });

    it('should handle four lengths iterator positions', () => {
      let result = [];
      const block = createBlock([[1, 2, 3], [4, 5, 6], [7, 8, 9], [0, 1, 2]]);
      forEach(block, (_, __, ___, i, j) => {
        result.push({ x: i, y: j });
      });
      expect(result).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
      ]);
    });
  });

  describe('rotateLeft function', () => {
    let block;

    beforeEach(() => {
      block = createBlock([[1], [1], [1]]);
    });

    it('should rotate from up to left', () => {
      rotateLeft(block);
      expect(block.orientation).toBe(Direction.Left);
      expect(block.width).toBe(1);
      expect(block.desc).toBe(block.descLeft);
      expect(block.centreX).toBe(0);
      expect(block.centreY).toBe(1);
    });

    it('should rotate from left to down', () => {
      rotateLeft(block);
      rotateLeft(block);
      expect(block.orientation).toBe(Direction.Down);
      expect(block.width).toBe(3);
      expect(block.desc).toBe(block.descDown);
      expect(block.centreX).toBe(1);
      expect(block.centreY).toBe(0);
    });

    it('should rotate from down to right', () => {
      rotateLeft(block);
      rotateLeft(block);
      rotateLeft(block);
      expect(block.orientation).toBe(Direction.Right);
      expect(block.width).toBe(1);
      expect(block.desc).toBe(block.descRight);
      expect(block.centreX).toBe(0);
      expect(block.centreY).toBe(1);
    });

    it('should rotate from right to up', () => {
      rotateLeft(block);
      rotateLeft(block);
      rotateLeft(block);
      rotateLeft(block);
      expect(block.orientation).toBe(Direction.Up);
      expect(block.width).toBe(3);
      expect(block.desc).toBe(block.descUp);
      expect(block.centreX).toBe(1);
      expect(block.centreY).toBe(0);
    });
  });

  describe('rotateRight function', () => {
    let block;

    beforeEach(() => {
      block = createBlock([[1], [1], [1]]);
    });

    it('should rotate from up to right', () => {
      rotateRight(block);
      expect(block.orientation).toBe(Direction.Right);
      expect(block.width).toBe(1);
      expect(block.desc).toBe(block.descRight);
      expect(block.centreX).toBe(0);
      expect(block.centreY).toBe(1);
    });

    it('should rotate from right to down', () => {
      rotateRight(block);
      rotateRight(block);
      expect(block.orientation).toBe(Direction.Down);
      expect(block.width).toBe(3);
      expect(block.desc).toBe(block.descDown);
      expect(block.centreX).toBe(1);
      expect(block.centreY).toBe(0);
    });

    it('should rotate from down to left', () => {
      rotateRight(block);
      rotateRight(block);
      rotateRight(block);
      expect(block.orientation).toBe(Direction.Left);
      expect(block.width).toBe(1);
      expect(block.desc).toBe(block.descLeft);
      expect(block.centreX).toBe(0);
      expect(block.centreY).toBe(1);
    });

    it('should rotate from left to up', () => {
      rotateRight(block);
      rotateRight(block);
      rotateRight(block);
      rotateRight(block);
      expect(block.orientation).toBe(Direction.Up);
      expect(block.width).toBe(3);
      expect(block.desc).toBe(block.descUp);
      expect(block.centreX).toBe(1);
      expect(block.centreY).toBe(0);
    });
  });
});
