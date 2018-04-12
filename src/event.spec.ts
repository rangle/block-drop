import { createEventEmitter, emitFrom, onTo } from './event';

import { noop } from './util';

describe('event emitter functions', () => {
  describe('createEventEmitter', () => {
    it('should return an event emitter', () => {
      expect(typeof createEventEmitter().on).toBe('function');
      expect(typeof createEventEmitter().emit).toBe('function');
    });
  });

  describe('onTo function', () => {
    it('onTo should register a callback and message onto a dictionary', () => {
      const dict = <{ test: any }>{};
      onTo(dict, 'test', noop);
      expect(Object.keys(dict.test).length).toBe(1);
    });

    it('onTo should return a cleanup method', () => {
      const dict = <{ test: any }>{};
      const off = onTo(dict, 'test', noop);
      expect(Object.keys(dict.test).length).toBe(1);
      off();
      expect(dict.test).toBeUndefined();
    });
  });

  describe('emitFrom function', () => {
    it('should ignore non-existant channels', () => {
      expect(() => emitFrom({}, 'test')).not.toThrowError();
    });

    it('should run functions with arguments', () => {
      let called1 = 0;
      let called2 = 0;
      emitFrom(
        {
          test: {
            someUniqueId: arg => (called1 = arg),
            somethingElse: arg => (called2 = arg),
          },
        },
        'test',
        5,
      );
      expect(called1).toBe(5);
      expect(called2).toBe(5);
    });
  });
});
