import { deepFreeze } from '../util';
import { SHADOW_OFFSET } from '../engine/board';

const colours = deepFreeze({
  black: 'bd-black',
  blue: 'bd-blue',
  red: 'bd-red',
  green: 'bd-blue',
  bgGreen: 'bd-bg-green',
  bgBlue: 'bd-bg-blue',
  bgRed: 'bd-bg-red',
  bgWrong: 'bd-bg-wrong',
  borderBlack: 'bd-border-black',
  borderBlue: 'b--react-blue ',
  borderGreen: 'b--vue-green ',
  borderRed: 'b--angular-red',
  borderWhite: 'bd-border-white',
  shadow: 'bd-shadow',
  borderShadow: 'bd-bg-border-shadow',
  bgShadowGreen: 'bd-bg-shadow-green',
  bgShadowRed: 'bd-bg-shadow-red',
  bgShadowBlue: 'bd-bg-shadow-blue',
  bgGoneGreen: 'bd-bg-gone-green',
  bgGoneRed: 'bd-bg-gone-red',
  bgGoneBlue: 'bd-bg-gone-blue',
});
const gone = 'animated bounceOut';

export const verticalUiClass = 'bd-vert-ui';
export const border = 'bd-border';

export const monoFont = 'bd-mono-font';

export const flex = 'bd-flex';
export const flex01auto = 'bd-flex-0-1-auto';
export const flex11auto = 'bd-flex-1-1-auto';
export const flex31auto = 'bd-flex-3-1-auto';
export const flexCol = 'bd-flex-col';
export const flexRow = 'bd-flex-row';

export const flexNoWrap = `bd-flex-nowrap`;

export const flexGrowRow = `${flex} ${flexRow} ${flex11auto} ${flexNoWrap}`;
export const flexGrowCol = `${flex} ${flexCol} ${flex11auto} ${flexNoWrap}`;

export const gameViewportClass = `${flex} ${flexNoWrap}`;

export const justifyAround = 'bd-flex-justify-around';
export const flexShrink =
  `${flex} ${flex01auto} ${flexNoWrap} ` + `${justifyAround}`;
export const flexGrowShrink =
  `${flex} ${flex11auto} ${flexNoWrap} ` + `${justifyAround}`;
export const flexGrowShrink31 =
  `${flex} ${flex31auto} ${flexNoWrap} ` + `${justifyAround}`;

export const tileBase = `flex-auto ba bw1`;
export const activeTile = `${tileBase}`;
export const emptyTile = `${tileBase} b--transparent`;

export const tileDefault = `${activeTile} b--transparent`;
export const tileRed = `${activeTile} ${colours.borderRed} skin-angular-red`;
export const tileGreen = `${activeTile} ${colours.borderGreen} skin-vue-green`;
export const tileBlue = `${activeTile} ${colours.borderBlue} skin-react-blue`;

export const shadowBase = `${tileBase} o-40`;
export const tileShadowRed = `${shadowBase} ${
  colours.borderRed
} skin-angular-red-shadow`;
export const tileShadowGreen = `${shadowBase} ${
  colours.borderGreen
} skin-vue-green-shadow`;
export const tileShadowBlue = `${shadowBase} ${
  colours.borderBlue
} skin-react-blue-shadow`;

export const goneBase = `${activeTile} ${gone} b--transparent`;
export const tileGoneRed = `${goneBase} skin-angular-red`;
export const tileGoneGreen = `${goneBase} skin-vue-green`;
export const tileGoneBlue = `${goneBase} skin-react-blue`;

export const board = `${monoFont} ` + `${flexGrowShrink31} ${flexCol}`;

export const previewDebug = `${flexGrowShrink} ${flexCol}`;

export function tileByNumber(val: number) {
  switch (val) {
    case 10:
      return tileGreen;
    case 11:
      return tileGoneGreen;
    case 20:
      return tileRed;
    case 21:
      return tileGoneRed;
    case 30:
      return tileBlue;
    case 31:
      return tileGoneBlue;
    case 10 + SHADOW_OFFSET:
      return tileShadowGreen;
    case 20 + SHADOW_OFFSET:
      return tileShadowRed;
    case 30 + SHADOW_OFFSET:
      return tileShadowBlue;
    default:
      return tileDefault;
  }
}
