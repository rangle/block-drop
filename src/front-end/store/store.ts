import { root } from '../reducers/root.reducer';
import { createStore } from 'redux';
import { configInterfaces, create1 } from '../../engine/engine';
import { createEventEmitter } from '../../event';

export const debug = true;
export const preview = 3;

const events = createEventEmitter();

export interface Singletons {
  configInterfaces: any[];
  createEngine: Function;
  engine: any;
  on: (message: string, listener: Function) => any;
}

export const store = createStore(root,
  (<any>window).devToolsExtension && (<any>window).devToolsExtension()
);

export const singletons = {
  configInterfaces,
  createEngine: () => {
    singletons.engine = create1(
      Object.assign({}, store.getState().game.config));
    events.emit('update', singletons);
    events.emit('new-game');
    return singletons.engine;
  },
  engine: create1(Object.assign({}, store.getState().game.config)),
  on: events.on,
};
