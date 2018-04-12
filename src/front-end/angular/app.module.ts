import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { NgReduxRouterModule, NgReduxRouter } from '@angular-redux/router';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { LOCATION_STRATEGY } from '../constants';
import { EngineStore } from '../store/store';
import { Store, Viewport } from './opaque-tokens';
import { IState } from '../reducers/root.reducer.shared';

import { routes } from './routes-angular';

import * as components from './components';
import * as containers from './containers';
import { Resizer } from '../aspect-resizer';

function reduceModule(module: Object) {
  return Object.keys(module).reduce(
    (state, el) => state.concat([module[el]]),
    [],
  );
}

const componentsArr = reduceModule(components);
const containersArr = reduceModule(containers);

export function getAppModule(store: EngineStore, resizer: Resizer) {
  @NgModule({
    bootstrap: [containers.App],
    declarations: [...componentsArr, ...containersArr],
    imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      NgReduxModule,
      NgReduxRouterModule,
      RouterModule.forRoot(routes, { useHash: LOCATION_STRATEGY === 'hash' }),
    ],
    providers: [
      NgReduxRouter,
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: Viewport, useValue: resizer },
      { provide: Store, useValue: store },
    ],
  })
  class AppModule {
    constructor(private ngRedux: NgRedux<IState>) {
      this.ngRedux.provideStore(store);
    }
  }

  return AppModule;
}
