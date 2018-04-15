import { Component, Input } from '@angular/core';

@Component({
  selector: 'score-hint',
  host: {
    class: '',
    style: 'position absolute; top: 50%; left: 50%;',
  },
  template: `
    <div 
      *ngIf="canShow()"
      [ngClass]="getClass()"
    >+{{ score }}</div>
`,
})
export class ScoreHint {
  @Input() colour: 10 | 20 | 30 | -10;
  @Input() duration: number = 2000;
  @Input() score: number;
  @Input() startTime: number;

  canShow() {
    if (this.score <= 0) {
      return false;
    }
    if (Date.now() - this.startTime < this.duration) {
      return true;
    }
    return false;
  }

  colourFromInteger(value: number) {
    if (value === -10) {
      return 'brand-purple';
    }
    if (value === 10) {
      return 'vue-green';
    }
    if (value === 20) {
      return 'angular-red';
    }
    if (value === 30) {
      return 'react-blue';
    }
    return 'brand-purple';
  }

  getClass() {
    return this.colourFromInteger(this.colour) + ' animated fadeOut';
  }
}
