import { Component, Input } from '@angular/core';

@Component({
  selector: 'score',
  host: {
    class:
      'blue-black bg-angular-red flex items-end mb2 mb4-ns ph2 ph3-ns pv1 shadow-angular-red',
  },
  template: `
    <div class="f6 f4-ns calibre-light mr2 mr3-ns mb2-ns">SCORE</div>
    <div class="f3 f2-m f1-l mt1 mt2-m mt3-l">{{ score }}</div>
`,
})
export class Score {
  @Input() score: number;
}
