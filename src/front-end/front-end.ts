import { deepFreeze, noop, partial } from '../util';
import { create, EngineStore } from './store/store';
import { root as rootReducer } from './reducers/root.reducer.complete';
import { show, hide, makeInvisible, makeVisible } from './elements';
import {
  bootstrapRoutes,
  changeFramework as changeFrameworkA,
  changeMultiFramework,
} from './actions/app.actions';
import { updateGameStatus } from './actions/game.actions';
import { EL_SPLASH, FRAMEWORK_DESCRIPTIONS, VERSION } from './constants';
import { init } from './aspect-resizer';
import './register-service-worker';

const store: EngineStore = create(rootReducer) as EngineStore;
const resizer = init(store);

const availableFrameworks = {
  vue: FRAMEWORK_DESCRIPTIONS[0],
  angular: FRAMEWORK_DESCRIPTIONS[1],
  react: FRAMEWORK_DESCRIPTIONS[2],
};

const defaultInitialFramework = availableFrameworks.vue;

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

/**
 * Pre-Load Lazy bundles
 *
 * One day we could make a scheduler or something for this
 * for now loadAll works just as well :P
 */
angular();
react();
vue();

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
const nav = document.querySelector('nav');
const navButtons = document.querySelectorAll<HTMLButtonElement>(
  'header button',
);

let storeSub: Function = noop;
let unmountCurrent = noop;
makeInvisible(nav);
hideGame();

store.game.on('fw-switch', loadFrameworkByNumber);

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

function determineInitialFramework(
  frameworkString: string = defaultInitialFramework.name,
) {
  let initialFramework;
  switch (frameworkString) {
    case 'vue':
      initialFramework = availableFrameworks.vue.id;
      break;
    case 'angular':
      initialFramework = availableFrameworks.angular.id;
      break;
    case 'react':
      initialFramework = availableFrameworks.react.id;
      break;
    default:
      initialFramework = defaultInitialFramework.id;
  }
  return initialFramework;
}

function determineInitialToggleElement(
  frameworkString: string = defaultInitialFramework.name,
) {
  let initialToggleElement;
  switch (frameworkString) {
    case 'vue':
      initialToggleElement = availableFrameworks.vue.toggleElement;
      break;
    case 'angular':
      initialToggleElement = availableFrameworks.angular.toggleElement;
      break;
    case 'react':
      initialToggleElement = availableFrameworks.react.toggleElement;
      break;
    default:
      initialToggleElement = defaultInitialFramework.toggleElement;
  }
  return initialToggleElement;
}

function mount(framework: string) {
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
  const initialFramework = determineInitialFramework(framework);
  loadFramework(
    document.getElementById(
      determineInitialToggleElement(framework),
    ) as HTMLButtonElement,
    initialFramework,
    20,
  );
  store.game.controls().setFramework(20);
}

function unmount() {
  makeInvisible(nav);
  hideGame();
  show(splashEl);
  storeSub();
  storeSub = noop;
}

function loadFrameworkByNumber(number: number) {
  switch (number) {
    case 20:
      return loadFramework(
        document.getElementById('angular-toggle') as HTMLButtonElement,
        'bd-root-angular',
        20,
      );
    case 30:
      return loadFramework(
        document.getElementById('react-toggle') as HTMLButtonElement,
        'bd-root-react',
        30,
      );
    default:
      return loadFramework(
        document.getElementById('vue-toggle') as HTMLButtonElement,
        'bd-root-vue',
        10,
      );
  }
}

function loadFramework(
  button: HTMLButtonElement,
  anchorId: string,
  fwNumber: 10 | 20 | 30,
) {
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
    store.game.controls().setFramework(fwNumber);
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
