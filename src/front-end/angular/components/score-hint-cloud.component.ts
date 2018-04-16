import { Component, Input, HostBinding } from '@angular/core';

function xFromIndex(width: number, index: number) {
  return ;
}


@Component({
  selector: 'score-hint-cloud',
  template: `
      <score-hint 
        [text]="'Score'"
        [startTime]="lastScoreUpdate + 10"
        [score]="lastClearScore"
        [position]="position"
        [duration]="scoreDuration"
        [colour]="-1">
      </score-hint>
      <score-hint 
        [text]="'Bonus'"
        [startTime]="lastScoreUpdate + 100"
        [score]="lastFwBonus"
        [position]="position"
        [duration]="scoreDuration"
        [colour]="-1">
      </score-hint>
      <score-hint 
        [text]="'Extra Bonus'"
        [startTime]="lastScoreUpdate + 200"
        [score]="lastFwBonusFw"
        [position]="position"
        [duration]="scoreDuration"
        [colour]="-1">
      </score-hint>
      <score-hint 
        [text]="'Overflow Bonus'"
        [startTime]="lastScoreUpdate + 300"
        [score]="lastOverflowBonus"
        [position]="position"
        [duration]="scoreDuration"
        [colour]="-1">
      </score-hint>
`,
})
export class ScoreHintCloud {
  @Input() lastOverflowBonus: number = 0;
  @Input() lastFwBonus: number = 0;
  @Input() lastFwBonusFw: number = 0;
  @Input() lastClearScore: number = 0;
  @Input() lastLevelScore: number = 0;
  @Input() lastScoreUpdate: number = 0;
  @Input() scoreDuration: number = 2000;
  @Input() firstAnimationBlock: number = -1;
  @Input() width: number = 0;
  @Input() height: number = 0;

  get position() {
    const x = 50;
    const y = 50;

    return { xPercent: x , yPercent: y };
  }
}
