import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'next-pieces-block',
  template: `
    <div>
      <div class="flex justify-center"
        *ngFor="let row of cols; trackBy: trackCol">
        <div class="flex h2 w2"
          *ngFor="let tile of row; let i = index; trackBy: trackRow"
          [ngClass]="i < (row.length - 1) ? 'mr2' : ''"
        >
          <tile [value]="tile"></tile>
        </div>
      </div>
    </div>
`,
})
export class NextPiecesBlock {
  @Input() cols: number[][];
  @Input() name: string;

  trackCol(index: number) {
    return index;
  }

  trackRow(index: number, value: number) {
    return value;
  }
}
