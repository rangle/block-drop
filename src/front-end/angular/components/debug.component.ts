/**
 * NOTE: this component is relatively "smart".  Normally active piece would
 * be passed in but Angular doesn't like objects that don't follow the "narrow"
 * path and it's easier to just import the activePiece here.  At least for now
 */
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Store } from '../opaque-tokens';
import { EngineStore } from '../../store/store';
import { ActivePiece } from './active-piece.component';
import { InputDevice } from './input-device.component';
import { O_EMPTY_BLOCK } from '../../constants';

@Component({
  selector: 'bd-debug',
  template: `
    <input-device [lastKeyCode]="keyCode"> 
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
export class Debug implements OnDestroy, OnInit {
  @Input() keyCode;
  stringify = JSON.stringify.bind(JSON);
  private activePiece = O_EMPTY_BLOCK;
  private destroyers: Function[] = [];

/**
 * NOTE: this component is relatively "smart".  Normally active piece would
 * be passed in but Angular doesn't like objects that don't follow the "narrow"
 * path and it's easier to just import the activePiece here.  At least for now
 */
constructor(@Inject(Store) private store: EngineStore,
            private cd: ChangeDetectorRef) {}

  ngOnDestroy() {
    this.destroyers.forEach((unsub) => unsub());
    this.destroyers = [];
  }

  ngOnInit() {
    this.destroyers.push(this.store.subscribe(() => {
      this.activePiece = this.store.getState().game.activePiece;
      this.cd.detectChanges();
    }));
  }
}
