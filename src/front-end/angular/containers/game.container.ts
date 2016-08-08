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
import { registerKeyControls } from '../../controls';
import { columnsFromBlock } from '../../../engine/block';
import {
  board,
  flexCol,
  flexGrowShrink,
  previewDebug,
} from '../../styles';

@Component({
  directives: [
    ActivePiece, Board, Debug, Button, NextPieces, InputDevice, Select
  ],
  selector: 'bd-game',
  template: `
    <board class="${board}" 
    [board]="board"
    [width]="boardWidth"
    ></board> 
    <div class="${previewDebug}">
      <bd-next-pieces class="${flexGrowShrink} ${flexCol}" 
      [preview]="preview"></bd-next-pieces>
      <bd-debug class="${flexGrowShrink}"></bd-debug>
    </div>
`,
})
export class Game implements OnInit, OnDestroy {
  board: number[] = [];
  boardWidth: number;
  deRegister: Function[] = [];
  preview: { name: string, cols: number[][]}[] = [];
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

  recomputeBoard() {
    // angular does *not* like getters do lots of mapping instead
    this.board = [];
    this.boardWidth = this.singletons.engine.config.width;
    const board = boardToArray(this.singletons.engine.buffer, this.boardWidth);

    let rows;

    board.forEach((el, i) => {
      if (i % this.boardWidth === 0) {
        rows = [];
      }
      rows.push(el);
      if (rows.length === this.boardWidth) {
        this.board.push(rows);
      }
    });
  }

  redraw() {
    this.recomputeBoard();

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
