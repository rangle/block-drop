import {
  createBlock,
  spawn1,
} from './block';

import {
  createNextBlock,
  createNextBlockRandomSet,
  validateConfig,
} from './engine';

import {
  RandomMethod,
} from './interfaces';

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
        seedRandom: seedrandom,
        randomMethod: RandomMethod.Random,
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
      config.randomMethod = RandomMethod.RandomFromSet;
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

  describe('createNextBlockRandomSet function', () => {
    
  });
  
  describe('validateConfig', () => {
    it('should keep existing properties', () => {
      const config = { name: '1' };
      validateConfig({ name: 'default' }, config);
      expect(config.name).toBe('1');
    });

    it('should fill in missing properties', () => {
      const config = <{ name: string }>{ name: undefined };
      validateConfig({ name: 'default' }, config);
      expect(config.name).toBe('default');
    });
  });
});
