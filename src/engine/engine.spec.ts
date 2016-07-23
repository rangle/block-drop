import {
  validateConfig,
} from './engine';

describe('engine functions', () => {
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
