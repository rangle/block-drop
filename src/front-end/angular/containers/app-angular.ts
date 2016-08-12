import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { store } from '../../store/store';
import { IState } from '../../reducers/root.reducer';
import { Game } from './game.container';
import { Observable } from 'rxjs/Rx';
import { changeScreen } from '../../actions/app.actions';
import { GameConfig } from './config.container';
import { Button, } from '../components';
import {
  flex,
  flexNoWrap,
  windowApplet,
  verticalUiClass,
} from '../../styles';

@Component({
  directives: [
    Button,
    Game,
    GameConfig,
  ],
  selector: 'bd-angular',
  template: `
    <div class="${flex} ${verticalUiClass}">
      <button *ngFor="let screen of (screens$ | async)"
         [onClick]="changeScreen(screen.id)"
         [value]="screen.name"></button>
    </div>
    <div [ngSwitch]="(currentScreen$ | async)">
      <bd-game class="${flex} ${flexNoWrap}" 
      [ngStyle]="styles" *ngSwitchCase="'game'"></bd-game>
      <bd-config class="${windowApplet}" *ngSwitchCase="'config'"></bd-config>
    </div>
`,
})
export class App {
  styles = { };
  @select(
    (state) => state.app.currentScreen) currentScreen$: Observable<number>;
  @select((state) => state.app.screens
    .filter((screen) => screen.id !== state.app.currentScreen )) screens$;

  constructor(private ngRedux: NgRedux<IState>) {
    this.ngRedux.provideStore(store);
    ngRedux.subscribe(() => {
      const game = ngRedux.getState().game;
      if (game.currentGameViewportDimensions.direction === 'row') {
        this.styles['flex-direction'] = 'row';
      } else {
        this.styles['flex-direction'] = 'column';
      }
    });
  }

  changeScreen(screen: string) {
    return () => this.ngRedux.dispatch(changeScreen(screen));
  }
}
