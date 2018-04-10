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
  borderBlue: 'bd-border-blue',
  borderGreen: 'bd-border-green',
  borderRed: 'bd-border-red',
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
const gone = 'bd-bg-gone-animation';

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

export const tileBase = `flex-auto`;
export const activeTile = `${tileBase} ba bw1`;
export const emptyTile = `${tileBase}`;

export const tileDefault =
  `${activeTile} ${colours.bgWrong} ` + `${colours.borderRed}`;
export const tileRed =
  `${activeTile} bg-angular-red ${colours.borderRed}`;
export const tileGreen =
  `${activeTile} bg-vue-green ${colours.borderGreen}`;
export const tileBlue = `${activeTile} bg-react-blue ${colours.borderBlue}`;
export const shadowBase = `${activeTile} ${colours.shadow} ` +
  `${colours.borderShadow}`;
// TODO: wants to be the same as the base but with transparency
export const tileShadowGreen = `${shadowBase} ${colours.bgShadowGreen}`;
export const tileShadowRed = `${shadowBase} ${colours.bgShadowRed}`;
export const tileShadowBlue = `${shadowBase} ${colours.bgShadowBlue}`;

export const goneBase = `${activeTile} ${gone} ` +
  `${colours.borderShadow}`;
export const tileGoneGreen = `${goneBase} ${colours.bgGoneGreen}`;
export const tileGoneRed = `${goneBase} ${colours.bgGoneRed}`;
export const tileGoneBlue = `${goneBase} ${colours.bgGoneBlue}`;

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
