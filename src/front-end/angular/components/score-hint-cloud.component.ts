import { Component, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

function xFromIndex(width: number, index: number) {
  return index % width;
}

function yFromIndex(width: number, index: number) {
  return Math.floor(index / width);
}

@Component({
  selector: 'score-hint-cloud',
  host: {
    class: '',
    style: 'position: absolute;',
  },
  template: `
      <score-hint 
        [duration]="scoreDuration"
        [startTime]="lastScoreUpdate"
        [score]="lastClearScore" 
      ></score-hint>
      <score-hint 
        [duration]="scoreDuration"
        [startTime]="lastScoreUpdate"
        [score]="lastLevelScore" 
      ></score-hint>
      <score-hint 
        [duration]="scoreDuration"
        [startTime]="lastScoreUpdate"
        [score]="lastOverflowBonus" 
        colour="-10"
      ></score-hint>
      <score-hint 
        [duration]="scoreDuration"
        [startTime]="lastScoreUpdate"
        [score]="lastFwBonus" 
        [colour]="lastFwBonusFw"
      ></score-hint>
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
  @HostBinding('style')
  get style() {
    if (this.firstAnimationBlock <= 0) {
      return '';
    }
    const x = xFromIndex(this.width, this.firstAnimationBlock);
    const y = yFromIndex(this.width, this.firstAnimationBlock);
    const style = `
      position: absolute; 
      bottom: ${x / this.width * 100}%; 
      right: ${y / this.height * 100}%
      z-index: 1000;
    `;

    console.log('style', style);

    /** Hope this isn't a problem := */
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
  constructor(private sanitizer: DomSanitizer) {}
}
