/**
 * "Mounts" the game engine onto Redux.  This enhancer is *tightly* coupled to
 * this application
 */
import { Reducer, Store, StoreCreator } from 'redux';
import { IState } from '../reducers/root.reducer.shared';
import { create1 } from '../../engine/engine';
import { noop, partial } from '../../util';
import {
  pause,
  replaceConfig,
  replaceNextConfig,
  resume,
  updateBuffer,
  updateActivePiece,
  updatePreview,
  updateLevel,
  updateScore,
  updateLevelProgress,
  updateGameStatus,
} from '../actions/game.actions';

export interface EngineReferences {
  _int?: any;
  engine?: any;
  engines?: any[];
}

export interface StoreGameExtensions {
  controls(): any;
  create(): void;
  on(event: string, cb: Function);
  pause: () => void;
  resume: () => void;
  stop: () => void;
  start: () => void;
}

export interface EngineStore<T> extends Store<T> {
  game: StoreGameExtensions;
}

// this is not super permanent
export function createGame(references: EngineReferences,
                           store: Store<IState>) {

  references.engine =
    create1(Object.assign({}, store.getState().nextConfig));

  (<any>store).dispatch(replaceNextConfig(references.engine.config));
  (<any>store).dispatch(replaceConfig(references.engine.config));

  replaceConfig(references.engine.config);

  updateState();

  /** be sure to keep the references fresh, a partial would bind to ref */
  references.engine.on('redraw', updateState);

  function updateState() {
    (<any>store).dispatch(updateActivePiece(references.engine.activePiece()));
    (<any>store).dispatch(updateBuffer(references.engine.buffer));
    (<any>store).dispatch(updatePreview(references.engine.preview));
    (<any>store).dispatch(updateLevel(references.engine.level));
    (<any>store).dispatch(updateLevelProgress(references.engine.progress));
    (<any>store).dispatch(updateScore(references.engine.score));
  }
}

/**
 * The enhancer
 */
export function blockDropEngine(references: EngineReferences,
                                createStore: StoreCreator) {

  return (reducer: Reducer<IState>, state?: IState): EngineStore<IState> => {
    const vanillaStore = createStore<IState>(reducer, state);

    // start default game
    createGame(references, vanillaStore);

    let resumeGame = noop;
    let startGame = noop;

    function pauseGame() {
      if (resumeGame === noop) {
        const resumeRef = references.engine.pause();
        (<any>vanillaStore).dispatch(pause());

        resumeGame = () => {
          (<any>vanillaStore).dispatch(resume());
          resumeRef();
        };
      }
    }

    function stopGame() {
      if (startGame === noop) {
        references.engine.endGame();
        (<any>vanillaStore).dispatch(updateGameStatus(true));

        startGame = () => {
          (<any>vanillaStore).dispatch(updateGameStatus(false));
          references.engine.startGame();
        };
      }
    }

    return Object.assign({}, vanillaStore, {
      game: {
        controls: () => references.engine.controls,
        create:  partial(createGame, references, vanillaStore),
        on: (event: string, cb: Function) => references.engine.on(event, cb),
        pause: pauseGame,
        resume: () => {
          resumeGame();
          resumeGame = noop;
        },
        stop: stopGame,
        start: () => {
          startGame();
          startGame = noop;
        },
      },
    });
  };
}
