import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { tileByNumber } from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tile',
  template: `
  <style>
    :host {
      display: flex;
      width: 100%;
    }
  </style>
  <div [ngClass]="value === 0 ? emptyTile : tileByNumber(value)">
    <ng-content></ng-content>
  </div>`,
})
export class Tile {
  @Input() value: number;
  tileByNumber: Function;

  constructor() {
    this.tileByNumber = tileByNumber;
  }
}
