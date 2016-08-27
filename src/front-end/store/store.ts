import { IState } from '../reducers/root.reducer.shared';
import { compose, createStore } from 'redux';
import {
  blockDropEngine,
  EngineStore as GEngineStore,
} from './engine.enhancer';
import { partial } from '../../util';

export type EngineStore = GEngineStore<IState>;

const references = Object.create(null);

const engineEnhancer = partial(blockDropEngine, references);

const devTools =
  (<any>window).devToolsExtension && (<any>window).devToolsExtension();

export function create(root) {
 return <GEngineStore<IState>>createStore<IState>(
      root, devTools ?
        compose(engineEnhancer, devTools) :
        engineEnhancer
    );
}
