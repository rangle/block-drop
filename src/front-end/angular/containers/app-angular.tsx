import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { store } from '../../store/store';
import { Singletons } from '../singletons';
import { IState } from '../../reducers/root.reducer';
import {
  ActivePiece,
  Block,
  Board,
  InputDevice,
}  from '../components';
import { boardToArray } from '../../../util';
import { keyPress } from '../../actions/events.actions';
import { changeGameType } from '../../actions/game.actions';
import { Observable } from 'rxjs/Rx';
import { registerKeyControls } from '../../controls';
import {
  columnsFromBlock,
} from '../../../engine/block';


//     <ActivePiece p={ this.state.game.activePiece() } />


@Component({
  directives: [ActivePiece, Block, Board, InputDevice],
  selector: 'bd-angular',
  template: `
    <div class="bd-app">
      <h1>Block Drop</h1>
      <board [rowsCleared]="rowsCleared" [board]="board"></board> 
      <div class="bd-float">
        <select [ngModel]="(gameType$ | async)" 
        (change)="updateSelection($event.target.value)">
          <option *ngFor="let type of (gameTypes$ | async); let i = index" 
            [value]="i">
            {{ type }}
          </option> 
        </select>
        <div class="bd-float">
          <h2>Next:</h2>
          <block *ngFor="let p of preview" 
          [name]="p.name" 
          [cols]="p.cols"></block>
        </div>
        <div class="bd-debug bd-clear bd-float">
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
        </div>
      </div>
    </div>
`,
})
export class App implements OnInit, OnDestroy {
  activePiece: any;
  board: any = [];
  deRegister: Function[] = [];
  @select((s) => s.game.gameType) gameType$: Observable<string>;
  @select((s) => s.game.gameTypes) gameTypes$: Observable<string[]>;
  @select((s) => s.game.lastEvent) lastEvent$: Observable<{ keyCode: number}>;
  preview: any[] = [];
  rowsCleared: number = 0;
  stringify = JSON.stringify.bind(JSON);
  constructor(private ngRedux: NgRedux<IState>,
              private singletons: Singletons,
              private cdRef: ChangeDetectorRef) {
    this.ngRedux.provideStore(store);
  }

  ngOnInit() {
    this.deRegister
      .push(this.singletons.engine.on('redraw', this.redraw.bind(this)));

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
    this.preview = [];
    this.preview = this.singletons.engine.preview.map((el) => ({
      name: el.name,
      cols: columnsFromBlock(el),
    }));
    this.activePiece = this.singletons.engine.activePiece();
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.deRegister.forEach((unsubscribe) => unsubscribe());
    this.deRegister = [];
  }

  updateSelection(selection) {
    this.ngRedux.dispatch(changeGameType(selection));
  }
}
