import '../../license';
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'ts-helpers';
import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { App } from'./containers/app-angular';

// Global styles
import '../styles/index.css';

// Production mode
declare const __PRODUCTION__: boolean;
declare const __TEST__: boolean;

if (__PRODUCTION__) {
  enableProdMode();
} else {
  require('zone.js/dist/long-stack-trace-zone');
}

// Finally bootstrap

bootstrap(App);
