import { createBlock } from './block';

import {
  createNextBlock,
  // gameOver,
  forceValidateConfig,
  create1Controls,
} from './engine';

import { spawn1 } from './rules';
import { noop } from '../util';

describe('engine functions', () => {
  describe('create1Controls', () => {
    it('should map controls to the current game', () => {
      let didRun = false;
      const c = create1Controls(
        {
          board: { desc: [] },
          game: {
            state: {
              activePiece: {},
            },
          },
          history: [],
        },
        () => ({
          moveDown: () => {
            didRun = true;
            return true;
          },
        }),
        noop,
      );
      c.moveDown();
      expect(didRun).toBe(true);
    });
  });
  describe('createNextBlock function', () => {
    let config;

    beforeEach(() => {
      config = {
        width: 10,
        height: 10,
        blockDescriptions: [{ desc: [[1]], name: 'test' }],
        createBlock,
        preview: 0,
        seedRandom: 'xor4096',
        randomMethod: 'random',
        seed: 'test',
        spawn: spawn1,
      };
    });

    it('should skip previews if c.preview is 0 using Random', () => {
      const preview = [];
      const nb = createNextBlock(config, preview);

      nb();
      expect(preview.length).toBe(0);
      nb();
      expect(preview.length).toBe(0);
    });

    it('should skip previews if c.preview is 0 using RandomFromSet', () => {
      const preview = [];
      config.randomMethod = 'randomFromSet';
      const nb = createNextBlock(config, preview);

      nb();
      expect(preview.length).toBe(0);
      nb();
      expect(preview.length).toBe(0);
    });

    it('should preview if preview is > 0', () => {
      const preview = [];
      config.preview = 2;
      const nb = createNextBlock(config, preview);
      expect(preview.length).toBe(1);
      nb();
      expect(preview.length).toBe(1);
    });

    it('should preview a subset', () => {
      const preview = [];
      config.preview = 2;
      config.blockDescriptions = config.blockDescriptions.concat([
        { desc: [[1]], name: 't2' },
        { desc: [[1]], name: 't3' },
        { desc: [[1]], name: 't3' },
        { desc: [[1]], name: 't5' },
      ]);
      const nb = createNextBlock(config, preview);
      expect(preview.length).toBe(2);
      nb();
      expect(preview.length).toBe(2);
    });

    it('preview argument is optional', () => {
      expect(() => createNextBlock(config)).not.toThrow();
    });
  });

  describe('tryAndRotate function', () => {});

  describe('tryAndMove function', () => {});

  // describe('gameOver function', () => {
  //   let board;
  //   let buffer;
  //   let games;

  //   beforeEach(() => {
  //     board = createBoard1(3, 3);
  //     board.desc[0] = 1;
  //     board.desc[3] = 1;
  //     buffer = Uint8Array.from(board.desc);
  //     games = [{
  //       activePieceHistory: [createBlock([[1, 1]])],
  //       activePiece: createBlock([[1]]),
  //       rowsCleared: 0,
  //     }];
  //   });

  //   it('should zero the board and the buffer', () => {
  //     gameOver(
  //       false,
  //       () => board,
  //       () => buffer,
  //       { games, gameOvers: 0, history: [] } as any,
  //       createBlock.bind(null, [[2]]),
  //       noop
  //     );
  //     expect(board.desc[0]).toBe(0);
  //     expect(board.desc[3]).toBe(0);
  //     expect(buffer[0]).toBe(0);
  //     expect(buffer[3]).toBe(0);
  //   });

  //   it('should zero the board and the buffer in debug mode', () => {
  //     gameOver(
  //       true,
  //       () => board,
  //       () => buffer,
  //       { games, gameOvers: 0, history: [] } as any,
  //       createBlock.bind(null, [[2]]),
  //       noop
  //     );
  //     expect(board.desc[0]).toBe(0);
  //     expect(board.desc[3]).toBe(0);
  //     expect(buffer[0]).toBe(0);
  //     expect(buffer[3]).toBe(0);
  //   });

  //   it('should add a new game', () => {
  //     const state: any = { games, gameOvers: 0, history: [] };
  //     gameOver(true, () => board, () => buffer, state,
  //       createBlock.bind(null, [[2]]), noop);
  //   expect(board.desc[0]).toBe(0);
  //   expect(board.desc[3]).toBe(0);
  //   expect(buffer[0]).toBe(0);
  //   expect(buffer[3]).toBe(0);
  // });

  //   it('should add a new game', () => {
  //     const state: any = { games, gameOvers: 0, history: [] };
  //     gameOver(true, () => board, () => buffer, state,
  //       createBlock.bind(null, [[2]]), noop);
  //     expect(state.games.length).toBe(2);
  //   });

  //   it('should emit a game-over notification', () => {
  //     let result = null;
  //     const state: any = { games, gameOvers: 0, history: [] };
  //     gameOver(true, () => board, () => buffer, state,
  //       createBlock.bind(null, [[2]]),
  //       (msg) => result = msg);
  //     expect(result).toBe('game-over');
  //   });
  // });

  describe('forceValidateConfig', () => {
    it('should keep existing properties', () => {
      const config = { name: '1' };
      forceValidateConfig({ name: 'default' }, config);
      expect(config.name).toBe('1');
    });

    it('should fill in missing properties', () => {
      const config = <{ name: string }>{ name: undefined };
      forceValidateConfig({ name: 'default' }, config);
      expect(config.name).toBe('default');
    });
  });
});
