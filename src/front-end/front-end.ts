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
import {
  EL_ROOT,
  EL_SPLASH,
  FRAMEWORK_DESCRIPTIONS,
  VERSION,
} from './constants';

// no idea why editor dislikes store.dispatch :/
(<any>store).dispatch(changeMultiFramework(true));

// no idea why editor dislikes store.dispatch :/
const changeFramework = (offset: number) => (<any>store)
  .dispatch(changeFrameworkA(offset));

const splash = document.getElementById(EL_SPLASH);
const root = document.getElementById(EL_ROOT);

const frameWorks = deepFreeze({
  'bd-root-angular': angular,
  'bd-root-react': react,
});

const elements = FRAMEWORK_DESCRIPTIONS.reduce(
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
  FRAMEWORK_DESCRIPTIONS.forEach((fwDesc, i) => {
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
