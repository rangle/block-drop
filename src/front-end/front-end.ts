import './angular/angular';
import './react/react';
import {
  deepFreeze,
  noop,
  partial,
} from '../util';
import { show, hide } from './elements';
import * as angular from './angular/angular';
import * as react from './react/react';
import {
  changeFramework as changeFrameworkA,
  changeMultiFramework,
} from './actions/app.actions';
import { store } from './store/store';

// no idea why editor dislikes store.dispatch :/
(<any>store).dispatch(changeMultiFramework(true));

// no idea why editor dislikes store.dispatch :/
const changeFramework = (offset: number) => (<any>store)
  .dispatch(changeFrameworkA(offset));

const APP_STATE = store.getState().app;
const ROOT = APP_STATE.elementRoot;
const VERSION = APP_STATE.version;
const SPLASH = APP_STATE.elementSplash;

const splash = document.getElementById(SPLASH);
const root = document.getElementById(ROOT);

const frameWorkDescs = APP_STATE.frameworkDescriptions;

const frameWorks = deepFreeze({
  'bd-root-angular': angular,
  'bd-root-react': react,
});

const elements = frameWorkDescs.reduce(
  (state, { id }) => {
    state[id] = document.getElementById(id);
    return state;
  },
  Object.create(null)
);

let listeners: Function[] = [];
let unmountCurrent = noop;
hide(root);
hideAll();

if ((<any>window).BLOCK_DROP) {
  console.warn('Block Drop currently only supports one installed instance per' +
    `page :( ... replacing ${(<any>window).BLOCK_DROP.version} with: ` +
    VERSION);
}
(<any>window).BLOCK_DROP = deepFreeze({
  version: VERSION,
  mount,
  unmount,
});


function hideAll() {
  Object.keys(elements).forEach((id) => hide(elements[id]));
}

function mount() {
  root.innerHTML = '';
  frameWorkDescs.forEach((fwDesc, i) => {
    const button = document.createElement('input');
    button.type = 'button';
    button.value = fwDesc.name;
    button.addEventListener('click', onClick);

    function onClick() {
      const el = elements[fwDesc.id];
      const fw = frameWorks[fwDesc.id];
      hideAll();
      unmountCurrent();
      fw.mount();
      show(el);
      unmountCurrent = partial(fw.unmount, el);
      changeFramework(i);
    }

    listeners.push(() => {
      button.removeEventListener('click', onClick);
    });

    root.appendChild(button);
  });
  hide(splash);
  show(root);
}

function unmount() {
  hide(root);
  hideAll();
  listeners.forEach((unsubscribe) => unsubscribe());
  listeners = [];
  root.innerHTML = '';
  show(splash);
}
