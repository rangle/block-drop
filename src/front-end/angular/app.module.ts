import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { NgRedux } from 'ng2-redux';
import { NgReduxRouter } from 'ng2-redux-router';
import { LOCATION_STRATEGY } from '../constants';
import { store } from '../store/store';
import { Store } from './opaque-tokens';

import { routes } from './routes-angular';

import * as components from './components';
import * as containers from './containers';

function reduceModule(module: Object) {
  return Object.keys(module)
    .reduce((state, el) => state.concat([module[el]]), []);
}

const componentsArr = reduceModule(components);
const containersArr = reduceModule(containers);

@NgModule({
  bootstrap:    [ containers.App ],
  declarations: [
    ...componentsArr,
    ...containersArr,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: LOCATION_STRATEGY === 'hash' }),
  ],
  providers: [
    NgRedux,
    { provide: Store, useValue: store },
    NgReduxRouter,
    { provide: APP_BASE_HREF, useValue : '/' },
  ],
})
export class AppModule { }
