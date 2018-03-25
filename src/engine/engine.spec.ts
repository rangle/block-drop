import {
  createBlock,
} from './block';

import {
  createBoard1, addBlock,
} from './board';

import {
  clearCheck,
  createNextBlock,
  gameOver,
  paramsToFn,
  tryFnRedraw,
  updateBlock,
  forceValidateConfig,
} from './engine';

import {
  spawn1,
} from './rules';

import {
  noop,
} from '../util';

const seedrandom = require('seedrandom');

describe('engine functions', () => {
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
        { desc: [[1]], name: 't2' }, { desc: [[1]], name: 't3' },
        { desc: [[1]], name: 't3' }, { desc: [[1]], name: 't5' },
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

  describe('clearCheck function', () => {
    it('returns the result of detectAndClear', () => {
      const board = createBoard1(1, 5);
      expect(clearCheck({ 
        rowsCleared: 0,
        buffer: Uint8Array.from([1, 2, 3]),
      }, board, () => 77, false)).toBe(77);
    });
    
    it('should copy the board\'s buffer to buffer if rows were cleared', () => {
      const board = createBoard1(3, 3);
      board.desc[0] = 1;
      board.desc[3] = 1;
      const buffer = new Uint8Array(9);
      clearCheck({
        rowsCleared: 0,
        buffer,
      }, board, () => 3, false);
      expect(buffer[0]).toBe(1);
      expect(buffer[1]).toBe(0);
      expect(buffer[3]).toBe(1);
    });

    it('should *not* copy the board\'s buffer to buffer if rows were *not* ' +
      'cleared', () => {
      const board = createBoard1(3, 3);
      board.desc[0] = 1;
      board.desc[3] = 1;
      const buffer = new Uint8Array(9);
      clearCheck({
        rowsCleared: 0,
        buffer,
      }, board, () => 0, false);
      expect(buffer[0]).toBe(0);
      expect(buffer[1]).toBe(0);
      expect(buffer[3]).toBe(0);
    });
  });

  describe('paramsToFunction function', () => {
    it('should get the results of the given parameters and pass them into ' +
      'the given function', () => {
      let result = 0;
      const testFn1  = () => 5;
      const testFn2  = () => 3;
      const consumerFn = (arg1: number, arg2: number) => result = arg1 + arg2;
      const fn = paramsToFn<() => number>([testFn1, testFn2], consumerFn);
      fn();
      expect(result).toBe(8);
    });
    
    it('should honor variadic arguments', () => {
      const testFn  = () => 5;
      const consumerFn = (arg: number, val: number) => arg + val;
      const fn = paramsToFn<(val: number) => number>([testFn], consumerFn);
      expect(fn(3)).toBe(8);
      expect(fn(1)).toBe(6);
    });
    
    it('should return updated references', () => {
      let result = 0;
      let store = 5;
      const testFn  = () => store;
      const consumerFn = (arg: number) => result = arg;
      const fn = paramsToFn<() => number>([testFn], consumerFn);
      fn();
      expect(result).toBe(5);
      store = 7;
      fn();
      expect(result).toBe(7);
    });
  });

  describe('tryAndRotate function', () => {
    
  });

  describe('tryAndMove function', () => {
    
  });

  describe('gameOver function', () => {
    let board;
    let buffer;
    let games;
    
    beforeEach(() => {
      board = createBoard1(3, 3);
      board.desc[0] = 1;
      board.desc[3] = 1;
      buffer = Uint8Array.from(board.desc);
      games = [{
        activePieceHistory: [createBlock([[1, 1]])],
        activePiece: createBlock([[1]]),
        rowsCleared: 0,
      }]; 
    });
    
    it('should zero the board and the buffer', () => {
      gameOver(
        false, 
        () => board, 
        () => buffer, 
        { games, gameOvers: 0, history: [] } as any, 
        createBlock.bind(null, [[2]]), 
        noop
      );
      expect(board.desc[0]).toBe(0);
      expect(board.desc[3]).toBe(0);
      expect(buffer[0]).toBe(0);
      expect(buffer[3]).toBe(0);
    });
    
    it('should zero the board and the buffer in debug mode', () => {
      gameOver(
        true, 
        () => board, 
        () => buffer, 
        { games, gameOvers: 0, history: [] } as any,
        createBlock.bind(null, [[2]]), 
        noop
      );
      expect(board.desc[0]).toBe(0);
      expect(board.desc[3]).toBe(0);
      expect(buffer[0]).toBe(0);
      expect(buffer[3]).toBe(0);
    });
    
    it('should add a new game', () => {
      const state: any = { games, gameOvers: 0, history: [] };
      gameOver(true, () => board, () => buffer, state, 
        createBlock.bind(null, [[2]]), noop);
    expect(board.desc[0]).toBe(0);
    expect(board.desc[3]).toBe(0);
    expect(buffer[0]).toBe(0);
    expect(buffer[3]).toBe(0);
  });

    it('should add a new game', () => {
      const state: any = { games, gameOvers: 0, history: [] };
      gameOver(true, () => board, () => buffer, state, 
        createBlock.bind(null, [[2]]), noop);
      expect(state.games.length).toBe(2);
    }); 
    
    it('should emit a game-over notification', () => {
      let result = null;
      const state: any = { games, gameOvers: 0, history: [] };
      gameOver(true, () => board, () => buffer, state, 
        createBlock.bind(null, [[2]]), 
        (msg) => result = msg);
      expect(result).toBe('game-over');
    });
  });

  describe('tryFnRedraw function', () => {
    it('should run the function if can passes', () => {
      let result = 0;
      const can = () => true;
      const fn = () => result = 1;
      
      tryFnRedraw(can, fn, noop, { history: [], timer: 1 }, {});
      
      expect(result).toBe(1);
    });
    
    it('should not run the function is it does not pass', () => {
      let result = 0;
      const can = () => false;
      const fn = () => result = 1;

      tryFnRedraw(can, fn, noop, {}, {});

      expect(result).toBe(0);
    });
  });

  describe('updateBlock', () => {
    it('should update a block\'s position on the board', () => {
      const board = createBoard1(10, 10); 
      const block = createBlock([[1]]);
      block.x = 5;
      block.y = 5;
      addBlock(board, block);
      expect(board.desc[5 * 10 + 5]).toBe(1);
      expect(board.desc[0]).toBe(0);
      updateBlock(() => board, () => block, () => board.desc, false, () => {
        block.x = 0;
        block.y = 0;
      });
      expect(board.desc[5 * 10 + 5]).toBe(0);
      expect(board.desc[0]).toBe(1);
    });
  });
  
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
