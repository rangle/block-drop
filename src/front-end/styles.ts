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
});

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

export const tileBase = `${border} ${flex11auto}`;
export const activeTile = `${tileBase}`;
export const emptyTile = `${tileBase} ${colours.black} ${colours.borderBlack}`;

export const tileRed =
  `${activeTile} ${colours.bgRed} ${colours.red} ` + `${colours.borderRed}`;
export const tileGreen =
  `${activeTile} ${colours.bgGreen} ${colours.green} ` +
  `${colours.borderGreen}`;
export const tileBlue = `${activeTile} ${colours.bgBlue} ${colours.blue} ` +
  `${colours.borderBlue}`;
export const shadowBase = `${activeTile} ${colours.shadow} ` +
  `${colours.borderShadow}`;
export const tileShadowGreen = `${shadowBase} ${colours.bgShadowGreen}`;
export const tileShadowRed = `${shadowBase} ${colours.bgShadowRed}`;
export const tileShadowBlue = `${shadowBase} ${colours.bgShadowBlue}`;

export const board = `${monoFont} ` + `${flexGrowShrink31} ${flexCol}`;

export const previewDebug = `${flexGrowShrink} ${flexCol}`;

export function tileByNumber(val: number) {
  switch (val) {
    case 1:
      return tileGreen;
    case 2:
      return tileRed;
    case 3:
      return tileBlue;
    case 1 + SHADOW_OFFSET:
      return tileShadowGreen;
    case 2 + SHADOW_OFFSET:
      return tileShadowRed;
    case 3 + SHADOW_OFFSET:
      return tileShadowBlue;
    default:
      return tileGreen;
  }
}
