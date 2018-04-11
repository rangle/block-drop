import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { recomputeBoard } from '../../../util';
import { keyPress } from '../../actions/events.actions';
import { registerKeyControls } from '../../controls';
import { columnsFromBlock } from '../../../engine/block';
import { Store, Viewport } from '../opaque-tokens';
import { EngineStore, IState } from '../../store/store';
import { Resizer } from '../../aspect-resizer';

@Component({
  selector: 'bd-game',
  host: {
    class: 'flex flex-auto',
  },
  template: `
    <board *ngIf="!(isPaused$ | async)"
      [board]="(board$ | async)"
      [level]="level$ | async"
      [width]="boardWidth$ | async"
    ></board> 
    <div class="w-third">
      <score [score]="score$ | async"></score>
      <bd-next-pieces *ngIf="!(isPaused$ | async)"
        [preview]="preview"
      >
      </bd-next-pieces>
      <div class="flex flex-wrap justify-between man1 man2-ns">
        <bd-button 
          class="flex-auto ma1 ma2-ns"
          *ngIf="(isPaused$ | async)" 
          [value]="resumeLabel"
          [onClick]="resume">
        </bd-button>
        <bd-button 
          class="flex-auto ma1 ma2-ns"
          *ngIf="!(isPaused$ | async)" 
          [value]="pauseLabel"
          [onClick]="pause">
        </bd-button>
        <bd-button 
          class="flex-auto ma1 ma2-ns"
          value="Done"
          [onClick]="done">
        </bd-button>
      </div>
    </div>
`,
})
export class Game implements AfterViewInit, OnInit, OnDestroy {
  @select(s => recomputeBoard(s.game.buffer, s.game.config.width))
  board$;
  @select(s => s.game.lastEvent)
  lastEvent$;
  @select(s => s.game.isPaused)
  isPaused$;
  @select(s => s.game.score)
  score$;
  @select(s => s.game.level)
  level$;
  boardWidth$: number;
  deRegister: Function[] = [];
  pause: Function;
  done: Function;
  pauseLabel = 'Pause';
  preview: { name: string; cols: number[][] }[] = [];
  resume: Function;
  resumeLabel = 'Resume';

  constructor(
    @Inject(Store) private store: EngineStore,
    @Inject(Viewport) private viewport: Resizer,
    private ngRedux: NgRedux<IState>,
    private cdRef: ChangeDetectorRef,
  ) {
    this.pause = this.store.game.pause;
    this.resume = this.store.game.resume;
    this.done = this.store.game.stop;
  }

  ngAfterViewInit() {
    this.viewport.resize();
  }

  private onStateChange() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    const obsStateChange = this.ngRedux
      .select('game')
      .subscribe(this.onStateChange.bind(this));
    this.deRegister.push(obsStateChange.unsubscribe.bind(obsStateChange));
    this.deRegister.push(this.viewport.bind());
    // our events happen "outside" of angular.  Account for that:
    // this.deRegister.push(
    // this.store.game.on('redraw', this.cdRef.detectChanges.bind(this.cdRef)));

    const controls = this.store.game.controls();

    this.deRegister.push(
      registerKeyControls(
        {
          37: controls.moveLeft,
          38: controls.moveUp,
          39: controls.moveRight,
          40: controls.moveDown,
          81: controls.rotateLeft,
          87: controls.rotateRight,
        },
        evt => (<any>this.store.dispatch)(keyPress(evt)),
      ),
    );

    this.redraw();
  }

  redraw() {
    const { preview } = this.store.getState().game;

    this.preview = preview.map(el => ({
      name: el.name,
      cols: columnsFromBlock(el),
    }));
    // this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.deRegister.forEach(unsubscribe => unsubscribe());
    this.deRegister = [];
  }
}
