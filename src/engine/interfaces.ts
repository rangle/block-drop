
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

export interface NextBlockConfig {
  width?: number;
  height?: number;
  blockDescriptions?: BlockDescription[];
  createBlock?: (desc: Matrix, x?: number, y?: number, name?: string) => Block;
  preview?: number;
  seedRandom?: (seed: string, options?: Object) => () => number;
  randomMethod?: RandomMethod;
  seed?: string;
  spawn?: (boardWidth: number,
           boardHeight: number,
           block: Block) => Block;
}

export interface GameConfig extends NextBlockConfig {
  board?: Uint8Array;
  canRotateLeft?: (board: Board, block: Block) => boolean;
  canRotateRight?: (board: Board, block: Block) => boolean;
  createBoard?: (width: number, height: number) => Board;
  detectAndClear?: (board: Board) => number;
  name?: string;
  speed?: number;
}

export type Matrix = Array<number[]>;

export enum RandomMethod {
  RandomFromSet,
  Random,
}
