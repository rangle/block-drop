import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { boardToArray, recomputeBoard } from '../../../util';
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
    <board *ngIf="!(isPaused$ | async)"
    class="${board}" 
    [board]="(board$ | async)"
    [width]="boardWidth$ | async"
    [ngStyle]="styles ? styles : styles"
    ></board> 
    <div class="${previewDebug}">
      <bd-button 
      *ngIf="(isPaused$ | async)" 
      [value]="resumeLabel"
      [onClick]="resume">
      </bd-button>
      <bd-button 
      *ngIf="!(isPaused$ | async)" 
      [value]="pauseLabel"
      [onClick]="pause">
      </bd-button>
      <bd-next-pieces *ngIf="!(isPaused$ | async)"
      class="${flexShrink} ${flexCol}" 
      [preview]="preview">
      </bd-next-pieces>
    </div>
`,
})
export class Game implements AfterViewInit, OnInit, OnDestroy {
  @HostBinding('class') private gameViewportClass = gameViewportClass;
  @select(
    (s) => recomputeBoard(s.game.buffer, s.game.config.width)) board$;
  @select((s) => s.game.lastEvent) lastEvent$;
  @select((s) => s.game.isPaused) isPaused$;
  private boardWidth$: number;
  private deRegister: Function[] = [];
  private pause: Function;
  private pauseLabel = 'Pause';
  private preview: { name: string, cols: number[][]}[] = [];
  private resume: Function;
  private resumeLabel = 'Resume';
  private styles = {};

  constructor(@Inject(Store) private store: EngineStore,
              @Inject(Viewport) private viewport: Resizer,
              private ngRedux: NgRedux<IState>,
              private cdRef: ChangeDetectorRef) {
    this.pause = this.store.game.pause;
    this.resume = this.store.game.resume;
  }

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

    this.cdRef.detectChanges();
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
