import { root } from '../reducers/root.reducer';
import { createStore } from 'redux';
import { create1 } from '../../engine/engine';

export interface Singletons {
  engine: any;
}

export const store = createStore(root,
  (<any>window).devToolsExtension && (<any>window).devToolsExtension()
);

export const singletons = {
  engine: create1({
    debug: true,
    preview: 3,
  }),
};
