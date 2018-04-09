import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgReduxRouter } from '@angular-redux/router';
import { NgRedux, select } from '@angular-redux/store';
import { IState } from '../../reducers/root.reducer.shared';

@Component({
  selector: 'bd-angular',
  host: {
    class: 'flex pa2 pa4-ns flex-auto',
  },
  template: `
    <router-outlet></router-outlet>
`,
})
export class App implements OnDestroy, OnInit {
  styles = {};
  @select(s => s.app.routes)
  routes$;
  private unsubscribe: Function;

  constructor(
    private ngRedux: NgRedux<IState>,
    private ngReduxRouter: NgReduxRouter,
    private router: Router,
  ) {}

  ngOnDestroy() {
    this.unsubscribe();
    this.ngReduxRouter.destroy();
  }

  ngOnInit() {
    this.unsubscribe = this.ngRedux.subscribe(() => {
      const game = this.ngRedux.getState().game;
      if (game.currentGameViewportDimensions.direction === 'row') {
        this.styles['flex-direction'] = 'row';
      } else {
        this.styles['flex-direction'] = 'column';
      }
    });
    this.ngReduxRouter.initialize(state => state.routing.angular);
  }

  changeScreen(path: string) {
    return () => this.router.navigate([`/${path}`]);
  }
}
