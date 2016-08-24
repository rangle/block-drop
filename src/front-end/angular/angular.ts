import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'ts-helpers';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { partial } from '../../util';
import '../../license';
import '../aspect-resizer';
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

  return platformBrowserDynamic().bootstrapModule(AppModule)
    .then((ref) => {
      isStarting = false;
      appRef = ref;
    }).catch((err) => {
      /* tslint:disable no-console */
      console.log(`failed to bootstrap angular 2: ${err.message}`);
      console.log(err.stack);
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
