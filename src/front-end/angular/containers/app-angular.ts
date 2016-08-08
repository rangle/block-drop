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
  flexCol,
  flex11auto,
  windowApp,
  windowApplet,
} from '../../styles';

const angularApplet = `${flex} ${flexCol} ${flex11auto}`;

@Component({
  directives: [
    Button,
    Game,
    GameConfig,
  ],
  selector: 'bd-angular',
  template: `
    <button *ngFor="let screen of (screens$ | async)"
       [onClick]="changeScreen(screen.id)"
       [value]="screen.name"></button>
    <div class="${angularApplet}" [ngSwitch]="(currentScreen$ | async)">
      <bd-game class="${windowApplet}" *ngSwitchCase="'game'"></bd-game>
      <bd-config class="${windowApplet}" *ngSwitchCase="'config'"></bd-config>
    </div>
`,
})
export class App {
  @select(
    (state) => state.app.currentScreen) currentScreen$: Observable<number>;
  @select((state) => state.app.screens
    .filter((screen) => screen.id !== state.app.currentScreen )) screens$;

  constructor(private ngRedux: NgRedux<IState>) {
    this.ngRedux.provideStore(store);
  }

  changeScreen(screen: string) {
    return () => this.ngRedux.dispatch(changeScreen(screen));
  }
}
