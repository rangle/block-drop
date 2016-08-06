import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Rx';

import { ActivePiece } from './active-piece.component';
import { InputDevice } from './input-device.component';

import { Singletons } from '../singletons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [InputDevice, ActivePiece],
  selector: 'bd-debug',
  template: `
    <input-device [lastKeyCode]="(lastEvent$ | async).keyCode"> 
    </input-device>
    <active-piece [centreX]="activePiece.centreX"
      [centreY]="activePiece.centreY"
      [desc]="stringify(activePiece.desc, null, 2)"
      [height]="activePiece.height"
      [name]="activePiece.name"
      [width]="activePiece.width"
      [x]="activePiece.x"
      [y]="activePiece.y"></active-piece>
  `,
})
export class Debug {
  @Input() activePiece;
  @select((s) => s.game.lastEvent) lastEvent$: Observable<{ keyCode: number}>;
  stringify = JSON.stringify.bind(JSON);
  constructor(private singletons: Singletons) {
    this.activePiece = this.singletons.engine.activePiece();
  }
}
