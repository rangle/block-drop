/**
 * "Mounts" the game engine onto Redux.  This enhancer is *tightly* coupled to
 * this application
 */
import { Reducer, Store, StoreCreator } from 'redux';
import { IState } from '../reducers/root.reducer';
import { create1 } from '../../engine/engine';
import { partial } from '../../util';
import {
  changeConfig,
  replaceNextConfig,
  updateBuffer,
  updateActivePiece,
  updatePreview,
} from '../actions/game.actions';

export interface EngineReferences {
  engine?: any;
  engines?: any[];
}

export interface StoreGameExtensions {
  controls(): any;
  create(): void;
  on(event: string, cb: Function);
}

export interface EngineStore<T> extends Store<T> {
  game: StoreGameExtensions;
}

export function createGame(references: EngineReferences,
                           store: Store<IState>) {
  references.engine =
    create1(Object.assign({}, store.getState().nextConfig));

  (<any>store).dispatch(replaceNextConfig(references.engine.config));

  changeConfig(references.engine.config);

  updateState();

  /** be sure to keep the references fresh, a partial would bind to ref */
  references.engine.on('redraw', updateState);

  function updateState() {
    (<any>store).dispatch(updateActivePiece(references.engine.activePiece()));
    (<any>store).dispatch(updateBuffer(references.engine.buffer));
    (<any>store).dispatch(updatePreview(references.engine.preview));
  }
}

export function blockDropEngine(references: EngineReferences,
                                createStore: StoreCreator) {

  return (reducer: Reducer<IState>, state?: IState): EngineStore<IState> => {
    const vanillaStore = createStore<IState>(reducer, state);

    // start default game
    createGame(references, vanillaStore);

    return Object.assign({}, vanillaStore, {
      game: {
        controls: () => references.engine.controls,
        create:  partial(createGame, references, vanillaStore),
        on: (event: string, cb: Function) => references.engine.on(event, cb),
      },
    });
  };
}
