import { clearCheck, createGame1, updateBlock } from './game';
import { addBlock, createBoard1 } from './board';
import { createBlock } from './block';
import { noop } from '../util';

describe('game functions', () => {
  describe('createGame1', () => {
    it('should return an object', () => {
      expect(
        createGame1(
          {},
          noop,
          new Uint8Array([]),
          createBoard1(1, 1),
          noop,
          noop,
          noop,
        ),
      ).toBeTruthy();
    });
  });

  describe('clearCheck function', () => {
    it('returns the result of detectAndClear', () => {
      const board = createBoard1(1, 5);
      expect(
        clearCheck(Uint8Array.from([1, 2, 3]), board, () => 77, false),
      ).toBe(77);
    });

    it("should copy the board's buffer to buffer if rows were cleared", () => {
      const board = createBoard1(3, 3);
      board.desc[0] = 1;
      board.desc[3] = 1;
      const buffer = new Uint8Array(9);
      clearCheck(buffer, board, () => 3, false);
      expect(buffer[0]).toBe(1);
      expect(buffer[1]).toBe(0);
      expect(buffer[3]).toBe(1);
    });

    it(
      "should *not* copy the board's buffer to buffer if rows were *not* " +
        'cleared',
      () => {
        const board = createBoard1(3, 3);
        board.desc[0] = 1;
        board.desc[3] = 1;
        const buffer = new Uint8Array(9);
        clearCheck(buffer, board, () => 0, false);
        expect(buffer[0]).toBe(0);
        expect(buffer[1]).toBe(0);
        expect(buffer[3]).toBe(0);
      },
    );
  });

  describe('updateBlock', () => {
    it("should update a block's position on the board", () => {
      const board = createBoard1(10, 10);
      const block = createBlock([[1]]);
      block.x = 5;
      block.y = 5;
      addBlock(board, block);
      expect(board.desc[5 * 10 + 5]).toBe(1);
      expect(board.desc[0]).toBe(0);
      updateBlock(board, block, board.desc, false, () => {
        block.x = 0;
        block.y = 0;
      });
      expect(board.desc[5 * 10 + 5]).toBe(0);
      expect(board.desc[0]).toBe(1);
    });
  });
});
