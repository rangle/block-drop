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

const ROOT = 'bd-root';
const VERSION = '0.0.1';
const SPLASH = 'bd-splash';

const splash = document.getElementById(SPLASH);
const root = document.getElementById(ROOT);

const frameWorkDescs = deepFreeze([
  { id: 'bd-root-angular', name: 'Angular 2' },
  { id: 'bd-root-react', name: 'React' },
]);

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
  frameWorkDescs.forEach((fwDesc) => {
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
