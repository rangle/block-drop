import { deepFreeze, noop, partial } from '../util';
import { create } from './store/store';
import { root as rootReducer } from './reducers/root.reducer.complete';
import { show, hide, makeInvisible, makeVisible } from './elements';
import {
  bootstrapRoutes,
  changeFramework as changeFrameworkA,
  changeMultiFramework,
} from './actions/app.actions';
import { updateGameStatus } from './actions/game.actions';
import {
  EL_ROOT,
  EL_SPLASH,
  FRAMEWORK_DESCRIPTIONS,
  VERSION,
} from './constants';
import { init } from './aspect-resizer';
import './register-service-worker';

const store = create(rootReducer);
const resizer = init(store);

(<any>store).dispatch(bootstrapRoutes(window.location.pathname));

// no idea why editor dislikes store.dispatch :/
(<any>store).dispatch(changeMultiFramework(true));

// no idea why editor dislikes store.dispatch :/
const changeFramework = (offset: number) =>
  (<any>store).dispatch(changeFrameworkA(offset));

const memoPromise = promiser => {
  let p;
  return () => {
    if (p) {
      return p;
    }
    p = promiser();
    return p;
  };
};

const angular = memoPromise(() =>
  import(/* webpackChunkName: "angular" */ './angular/angular'),
);
const react = memoPromise(() =>
  import(/* webpackChunkName: "react" */ './react/react'),
);
const vue = memoPromise(() =>
  import(/* webpackChunkName: "vue" */ './vue/vue'),
);

const frameWorks = deepFreeze({
  'bd-root-angular': angular,
  'bd-root-react': react,
  'bd-root-vue': vue,
});

const frameworkElements = FRAMEWORK_DESCRIPTIONS.reduce((state, { id }) => {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error('block drop: no element found for ' + id);
  }
  state[id] = el;
  return state;
}, Object.create(null));

const splashEl = document.getElementById(EL_SPLASH);
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navButtons = document.querySelectorAll<HTMLButtonElement>(
  'header button',
);

let storeSub: Function = noop;
let unmountCurrent = noop;
makeInvisible(nav);
hideGame();

if ((<any>window).BLOCK_DROP) {
  console.warn(
    'Block Drop currently only supports one installed instance per' +
      `page :( ... replacing ${(<any>window).BLOCK_DROP.version} with: ` +
      VERSION,
  );
}
(<any>window).BLOCK_DROP = deepFreeze({
  version: VERSION,
  mount,
  unmount,
  loadFramework,
});

function hideGame() {
  Object.keys(frameworkElements).forEach(id => hide(frameworkElements[id]));
}

function mount() {
  storeSub = store.subscribe(() => {
    const state = store.getState();
    if (state.game.isStopped) {
      hideGame();
      unmountCurrent();
      unmountCurrent = noop;
      unmount();
      store.dispatch(updateGameStatus(false));
    }
  });

  hide(splashEl);
  makeVisible(nav);
  const initialFramework = 'bd-root-vue';
  loadFramework(
    document.getElementById('vue-toggle') as HTMLButtonElement,
    initialFramework,
  );
}

function unmount() {
  makeInvisible(nav);
  hideGame();
  show(splashEl);
  storeSub();
  storeSub = noop;
}

function loadFramework(button: HTMLButtonElement, anchorId: string) {
  disableAll(navButtons);
  setAllInactive(navButtons);
  frameWorks[anchorId]().then(framework => {
    store.game.start();
    hideGame();
    unmountCurrent();
    framework.mount(store, resizer);
    show(frameworkElements[anchorId]);
    unmountCurrent = partial(framework.unmount);
    changeFramework(FRAMEWORK_DESCRIPTIONS.findIndex(fw => fw.id === anchorId));
    enableAll(navButtons);
    setActive(button);
  });
}

function enableAll(buttons: NodeListOf<HTMLButtonElement>) {
  buttons.forEach(el => {
    el.disabled = false;
  });
}

function disableAll(buttons: NodeListOf<HTMLButtonElement>) {
  buttons.forEach(el => {
    el.disabled = true;
  });
}

function setActive(element: HTMLElement) {
  element.classList.add('ba');
}

function setAllInactive(buttons: NodeListOf<HTMLButtonElement>) {
  buttons.forEach(element => element.classList.remove('ba'));
}
