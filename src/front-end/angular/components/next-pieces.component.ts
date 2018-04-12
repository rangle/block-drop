import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-next-pieces',
  host: {
    class: 'db ba bw2 b--angular-red mb4 shadow-angular-red',
  },
  template: `
    <h3 class="blue-black bg-angular-red f4 f2-m f1-l ma0 pt1 pt2-m pt3-l tc">NEXT</h3>
    <div class="pa2 pa3-ns">
      <div
        *ngFor="let p of preview; let i = index;"
        [ngClass]="i < (preview.length - 1) ? 'mb3' : ''"
      >
        <next-pieces-block
          [name]="p.name"
          [cols]="p.cols">
        </next-pieces-block>
        <hr class="ma0 mt3 bn shadow-angular-red bg-angular-red h0-25" *ngIf="i === 0">
      </div>
    </div>
  `,
})
export class NextPieces {
  @Input() preview: { name: string; cols: number[][] };
}
