import { Component } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { store } from '../../store/store';
import { IState } from '../../reducers/root.reducer';

@Component({
  selector: 'bd-angular',
  template: `
Hello world
`,
})
export class App {
  constructor(private ngRedux: NgRedux<IState>) {
    this.ngRedux.provideStore(store);
  }
}
