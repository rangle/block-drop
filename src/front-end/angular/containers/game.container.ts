import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { boardToArray } from '../../../util';
import { keyPress } from '../../actions/events.actions';
import { registerKeyControls } from '../../controls';
import { columnsFromBlock } from '../../../engine/block';
import {
  board,
  flexCol,
  flexGrowShrink,
  flexRow,
  flexShrink,
  gameViewportClass,
  previewDebug,
} from '../../styles';
import { Store, Viewport } from '../opaque-tokens';
import { EngineStore, IState } from '../../store/store';
import { Resizer } from '../../aspect-resizer';

@Component({
  selector: 'bd-game',
  template: `
    <board class="${board}" 
    [board]="(board$ | async)"
    [width]="boardWidth$ | async"
    [ngStyle]="styles ? styles : styles"
    ></board> 
    <div class="${previewDebug}">
      <bd-next-pieces class="${flexShrink} ${flexCol}" 
      [preview]="preview"></bd-next-pieces>
      <bd-debug 
      class="${flexGrowShrink}" 
      [keyCode]="(lastEvent$ | async).keyCode"></bd-debug>
    </div>
`,
})
export class Game implements AfterViewInit, OnInit, OnDestroy {
  @HostBinding('class') private gameViewportClass = gameViewportClass;
  @select(
    (s) => recomputeBoard(s.game.buffer, s.game.config.width)) board$;
  @select((s) => s.game.lastEvent) lastEvent$;
  private boardWidth$: number;
  private deRegister: Function[] = [];
  private preview: { name: string, cols: number[][]}[] = [];
  private styles = {};

  constructor(@Inject(Store) private store: EngineStore,
              @Inject(Viewport) private viewport: Resizer,
              private ngRedux: NgRedux<IState>,
              private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.viewport.resize();
  }

  private onStateChange(game) {
    this.styles['min-width'] = game.currentGameViewportDimensions.x + 'px';
    this.styles['min-height'] = game.currentGameViewportDimensions.y + 'px';
    this.styles['max-width'] = game.currentGameViewportDimensions.x + 'px';
    this.styles['max-height'] = game.currentGameViewportDimensions.y + 'px';
    this.gameViewportClass = gameViewportClass + ' ' + (game
        .currentGameViewportDimensions.direction === 'row' ?
        flexRow :
        flexCol);
  }

  ngOnInit() {
    const obsStateChange = this.ngRedux.select('game')
      .subscribe(this.onStateChange.bind(this));
    this.deRegister.push(obsStateChange.unsubscribe.bind(obsStateChange));
    this.deRegister.push(this.viewport.bind());
    // our events happen "outside" of angular.  Account for that:
    // this.deRegister.push(
    // this.store.game.on('redraw', this.cdRef.detectChanges.bind(this.cdRef)));

    const controls = this.store.game.controls();

    this.deRegister.push(registerKeyControls({
      37: controls.moveLeft,
      38: controls.moveUp,
      39: controls.moveRight,
      40: controls.moveDown,
      81: controls.rotateLeft,
      87: controls.rotateRight,
    }, (evt) => (<any>this.store.dispatch)(keyPress(evt))));

    this.redraw();
  }

  redraw() {
    const { preview } = this.store.getState().game;

    this.preview = preview.map((el) => ({
      name: el.name,
      cols: columnsFromBlock(el),
    }));
    // this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.deRegister.forEach((unsubscribe) => unsubscribe());
    this.deRegister = [];
  }

}

function recomputeBoard(buffer, width) {
  const newBoard = [];
  const board = boardToArray(buffer, width);

  let rows;

  board.forEach((el, i) => {
    if (i % width === 0) {
      rows = [];
    }
    rows.push(el);
    if (rows.length === width) {
      newBoard.push(rows);
    }
  });

  return newBoard;
}

