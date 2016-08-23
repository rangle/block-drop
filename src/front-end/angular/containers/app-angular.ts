import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { NgReduxRouter } from 'ng2-redux-router';
import { NgRedux, select } from 'ng2-redux';
import { store } from '../../store/store';
import { IState } from '../../reducers/root.reducer';
import { Game } from './game.container';
import { GameConfig } from './config.container';
import { Button, } from '../components';
import {
  flex,
  flexCol,
  flexNoWrap,
  verticalUiClass,
} from '../../styles';

import { ROUTES } from '../../constants';

@Component({
  directives: [
    Button,
    Game,
    GameConfig,
    ROUTER_DIRECTIVES,
  ],
  selector: 'bd-angular',
  template: `
    <div class="${flex} ${verticalUiClass}">
      <button *ngFor="let route of routes"
         [onClick]="changeScreen(route.path)"
         [value]="route.name"></button>
    </div>
    <router-outlet></router-outlet>
`,
})
export class App {
  styles = { };
  routes = ROUTES;

  constructor(private ngRedux: NgRedux<IState>,
              private ngReduxRouter: NgReduxRouter,
              private router: Router) {
    this.ngRedux.provideStore(store);
    this.ngReduxRouter.initialize(state => state.routing.angular);
    ngRedux.subscribe(() => {
      const game = ngRedux.getState().game;
      if (game.currentGameViewportDimensions.direction === 'row') {
        this.styles['flex-direction'] = 'row';
      } else {
        this.styles['flex-direction'] = 'column';
      }
    });
  }

  changeScreen(path: string) {
    return () => this.router.navigate([`/${path}`]);
  }
}

/**
<!--<bd-game class="${flex} ${flexNoWrap}" -->
<!--[ngStyle]="styles" *ngSwitchCase="'game'"></bd-game>-->
  <!--<bd-config class="${flex} ${flexCol}" *ngSwitchCase="'config'">-->
  <!--</bd-config>-->
**/
