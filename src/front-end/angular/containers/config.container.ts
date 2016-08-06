import { changeConfig } from '../../actions/game.actions';
import { IState } from '../../reducers/root.reducer';

import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import {
  Button,
  Select,
} from '../components';

import { NgRedux, select } from 'ng2-redux';

import { Observable } from 'rxjs/Rx';

import { Singletons } from '../singletons';

@Component({
  directives: [
    Button,
    Select,
  ],
  selector: 'bd-config',
  template: `
    <div *ngFor="let i of configInterfaces">
      <div [ngSwitch]="i.type">
          <bd-select *ngSwitchCase="'select'"
          [model]="(detectClear$ | async)" 
          (update)="updateSelection($event, i.prop)"
          [options]="i.options()"></bd-select>
      </div>  
    </div>
    <button [onClick]="createGame" value="New Game"></button> 
`,
})
export class GameConfig {
  @select((s) => s.game.config.detectAndClear) detectClear$: Observable<string>;
  createGame: Function;
  configInterfaces: any[];

  constructor(private ngRedux: NgRedux<IState>,
              private singletons: Singletons) {
    this.configInterfaces = singletons.configInterfaces;
    this.createGame = singletons.createEngine;
  }

  updateSelection(selection, prop) {
    this.ngRedux.dispatch(changeConfig(prop, selection));
  }
}
