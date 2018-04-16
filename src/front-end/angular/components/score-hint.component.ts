import { Component, Input, HostBinding } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { tileColorByNumber } from '../../styles';

const jitterScale = 10;
@Component({
  selector: 'score-hint',
  host: {
    class: 'dib absolute'
  },
  template: `
    <div *ngIf="canShow()" [ngClass]="getClass">
      <div class="mbn-50 mln-50 dib">
        <span class="f6 o-50">{{ text }}</span>
        <span class="f3">+{{ score }}</span>
      </div>
    </div>
`,
})
export class ScoreHint {
  @Input() colour: 10 | 20 | 30 | -10;
  @Input() text: string = '';
  @Input() score: number;
  @Input() duration: number;
  @Input() startTime: number;
  @Input() delay: number;
  @Input() position: { xPercent: number, yPercent: number };
  @HostBinding('style') hostStyle: SafeStyle = '';
  jitterX: number;
  jitterY: number;

  ngOnInit() {
    this.jitterX = Math.floor(Math.random() * jitterScale) - jitterScale/2;
    this.jitterY = Math.floor(Math.random() * jitterScale) - jitterScale/2;
  }
  
  ngOnChanges() {
    /* eh... */
    this.hostStyle = this.sanitizer.bypassSecurityTrustStyle(
      `left: ${this.position.xPercent +this.jitterX}%; 
       bottom: ${this.position.yPercent + this.jitterY}%;`);
  }

  canShow() {
    if (this.score <= 0) {
      return false;
    }
    if ((Date.now() - this.startTime > 0) && (Date.now() - this.startTime < this.duration)) {
      return true;
    }
    return false;
  }

  get getClass() {
    return tileColorByNumber(this.colour) + ` animated animate-slow ${this.getDelayClass(this.delay)} fadeOutUp f1 `;
  }

  getDelayClass(delay: number) {
    if (delay < 1 && delay > 5 ) { return ''; }
    return 'animate-delay-' + Math.floor(delay);
  }

  constructor(private sanitizer: DomSanitizer) {}
}
