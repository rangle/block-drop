import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'score',
  template: `
    <div class="black bg-angular-red flex items-end mb4 ph3 pv1 shadow-angular-red">
      <div class="f6 fw3 mr2">SCORE</div>
      <div class="f2">{{ score }}</div>
    </div>
`,
})
export class Score {
  @Input() score: number;
}
