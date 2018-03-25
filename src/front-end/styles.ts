import { deepFreeze } from '../util';

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
  bgShadow: 'bd-bg-shadow',
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
export const tileShadow = `${activeTile} ${colours.bgShadow} ` + 
`${colours.shadow} ${colours.borderShadow}`;

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
    case 9:
      return tileShadow;
    default:
      return tileGreen;
  }
}
