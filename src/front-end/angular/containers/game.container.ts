import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Singletons } from '../singletons';
import { IState } from '../../reducers/root.reducer';
import {
  ActivePiece,
  Board,
  Button,
  Debug,
  InputDevice,
  NextPieces,
  Select,
}  from '../components';
import { boardToArray } from '../../../util';
import { keyPress } from '../../actions/events.actions';
import { Observable } from 'rxjs/Rx';
import { registerKeyControls } from '../../controls';
import {
  columnsFromBlock,
} from '../../../engine/block';

@Component({
  directives: [
    ActivePiece, Board, Debug, Button, NextPieces, InputDevice, Select
  ],
  selector: 'bd-game',
  template: `
    <div class="bd-game-window">
      <board [rowsCleared]="rowsCleared" [board]="board"></board> 
      <div class="bd-float">
        <div class="bd-float">
          <bd-next-pieces [preview]="preview"></bd-next-pieces>
        </div>
        <div class="bd-debug bd-clear bd-float">
          <bd-debug></bd-debug>
        </div>
      </div>
    </div>
`,
})
export class Game implements OnInit, OnDestroy {
  board: any = [];
  deRegister: Function[] = [];
  preview: { name: string, cols: number[][]}[] = [];
  rowsCleared: number = 0;
  constructor(private ngRedux: NgRedux<IState>,
              private singletons: Singletons,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    const localRedraw = this.redraw.bind(this);
    this.deRegister
      .push(this.singletons.engine.on('redraw', localRedraw));

    this.deRegister.push(this.singletons.on('new-game', localRedraw));

    const { controls } = this.singletons.engine;

    this.deRegister.push(registerKeyControls({
      37: controls.moveLeft,
      38: controls.moveUp,
      39: controls.moveRight,
      40: controls.moveDown,
      81: controls.rotateLeft,
      87: controls.rotateRight,
    }, (evt) => this.ngRedux.dispatch(keyPress(evt))));

    this.redraw();
  }

  redraw() {
    // angular does *not* like getters do lots of mapping instead
    this.board = boardToArray(
      this.singletons.engine.buffer,
      this.singletons.engine.config.width);
    this.rowsCleared = this.singletons.engine.rowsCleared;
    this.preview = this.singletons.engine.preview.map((el) => ({
      name: el.name,
      cols: columnsFromBlock(el),
    }));
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.deRegister.forEach((unsubscribe) => unsubscribe());
    this.deRegister = [];
  }

}
