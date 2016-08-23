import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'ts-helpers';
import { enableProdMode, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { provideForms } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { App } from'./containers/app-angular';
import { NgRedux } from 'ng2-redux';
import { NgReduxRouter } from 'ng2-redux-router';
import { routes } from './routes-angular';
import { partial } from '../../util';
import { LOCATION_STRATEGY } from '../constants';
import '../../license';
import '../aspect-resizer';
import { store } from '../store/store';
import { Store } from './opaque-tokens';
// Global styles
import '../styles/index.css';


// Production mode
declare const __PRODUCTION__: boolean;
declare const __STAND_ALONE__: boolean;

if (__PRODUCTION__) {
  enableProdMode();
} else {
  require('zone.js/dist/long-stack-trace-zone');
}

const UNMOUNT_RETRY = 50;
let appRef = null;
let isStarting = false;
let timeOut = null;

if (__STAND_ALONE__) {
  mount();
}

export function mount() {
  if (appRef || isStarting) {
    return;
  }
  isStarting = true;

  return bootstrap(App, [
    NgRedux,
    { provide: Store, useValue: store },
    NgReduxRouter,
    provide(APP_BASE_HREF, { useValue : '/' }),
    provideForms(),
    provideRouter(routes, { useHash: LOCATION_STRATEGY === 'hash' }),
  ])
    .then((ref) => {
      isStarting = false;
      appRef = ref;
    });
}

export function unmount(element: HTMLElement) {
  if (appRef) {
    appRef.destroy();
    appRef = null;
    const el = document.createElement('bd-angular');
    element.appendChild(el);
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }
  } else if (isStarting) {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    timeOut = setTimeout(partial(unmount, element), UNMOUNT_RETRY);
  }
}
