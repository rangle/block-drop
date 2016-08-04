export const base = 'bd-float';
export const boardStyle = 'bd-clear bd-game bd-border bd-border-white ' +
  'bd-float bd-mono-font';
export const boxStyle = 'bd-border bd-border-white bd-margin-bottom ' +
  'bd-margin-left';
export const activeTile = `${base} bd-tile-active bd-border ` +
  `bd-border-green`;
export const emptyTile = `${base} bd-tile-empty bd-black`;

export const tileRed = `${activeTile} bd-red bd-bg-red`;
export const tileGreen = `${activeTile} bd-green bd-bg-green`;
export const tileBlue = `${activeTile} bd-blue bd-bg-blue`;

export function tileByNumber(val: number) {
  switch (val) {
    case 1:
      return tileGreen;
    case 2:
      return tileRed;
    case 3:
      return tileBlue;
    default:
      return tileGreen;
  }
}

