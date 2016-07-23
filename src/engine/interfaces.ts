
/**
 * x/y refer to board positions (if the block is active) always measured from
 * the block's top left, even after rotation
 */
export interface Block {
  centreX: number;
  centreY: number;
  desc: Matrix;
  descUp: Matrix;
  descDown: Matrix;
  descLeft: Matrix;
  descRight: Matrix;
  height: number;
  name: string;
  width: number;
  orientation: Direction;
  x: number;
  y: number;
}

export interface BlockDescription {
  desc: Matrix;
  name?: string;
}

export interface Board {
  width: number;
  height: number;
  desc: Uint8Array;
}

export interface Board1 extends Board {
  descBuffer: Uint8Array; 
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface GameConfig {
  width?: number;
  height?: number;
  board?: Uint8Array;
  blockDescriptions?: BlockDescription[];
  canRotateLeft?: (board: Board, block: Block) => boolean;
  canRotateRight?: (board: Board, block: Block) => boolean;
  createBlock?: (desc: Matrix, x?: number, y?: number) => Block;
  createBoard?: (width: number, height: number) => Board;
  detectAndClear?: (board: Board) => number;
  name?: string;
  randomMethod?: RandomMethod;
  seed?: string;
  seedRandom?: (seed: string, options?: Object) => () => number;
  spawn?: (boardWidth: number,
           boardHeight: number,
           block: Block) => Block;
  speed?: number;
}

export type Matrix = Array<number[]>;

export enum RandomMethod {
  RandomFromSet,
  Random,
}
