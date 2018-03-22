import { IState } from '../reducers/root.reducer.shared';
export { IState } from '../reducers/root.reducer.shared';
import { applyMiddleware, compose, createStore } from 'redux';
import {
  blockDropEngine,
  EngineStore as GEngineStore,
} from './engine.enhancer';
import { partial } from '../../util';
import { routeBindingMiddleware } from './route-binding.middleware';

export type EngineStore = GEngineStore<IState>;

const references = Object.create(null);

const engineEnhancer = partial(blockDropEngine, references);

const devTools =
  (<any>window).devToolsExtension && (<any>window).devToolsExtension();

export function create(root) {
 return <GEngineStore<IState>>createStore<IState>(
      root, devTools ?
        compose(
          engineEnhancer, applyMiddleware(routeBindingMiddleware as any), devTools) :
        compose(engineEnhancer, applyMiddleware(routeBindingMiddleware as any))
    );
}
