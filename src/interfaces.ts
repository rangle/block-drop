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

export type BooleanFunction = (...args: any[]) => boolean;

export interface Board1 extends Board {
  descBuffer: Uint8Array;
}

export interface Dictionary<T> {
  [id: string]: T;
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface FunctionsCollection<T extends Function> {
  default(): T;
  get(name: string): T;
  list(): string;
  register(name: string, func: T): void;
}

export interface MapBaseConfig {
  width: number;
  height: number;
  depth?: number;
}

export interface NextBlockConfig extends MapBaseConfig {
  blockDescriptions: BlockDescription[];
  createBlock: string;
  preview: number;
  seedRandom: string;
  randomMethod: RandomMethod | string;
  seed: string;
  spawn: string;
}

export interface GameRules {
  clearDelay: number;
  connectedBlocks: number;
  dropOnUp: boolean;
  enableShadow: boolean;
  baseLevelScore: number;
  tileScoreMultiplier: number;
  nextLevelMultiplier: number;
  speed: number;
  speedMultiplier: number;
}

export interface GameControlConfig {
  canMoveUp: string;
  canMoveDown: string;
  canMoveLeft: string;
  canMoveRight: string;
  canRotateLeft: string;
  canRotateRight: string;
  gamePadPollInterval: number;
}
export interface GameConfig
  extends NextBlockConfig,
    GameRules,
    GameControlConfig {
  debug: boolean;
  checkForLoss: string;
  createBoard: string;
  detectAndClear: string;
  name: string;
  startingFramework: 10 | 20 | 30;
  tick: string;
}

export type GameConfigOptions = { [P in keyof GameConfig]?: GameConfig[P] };

export type Matrix = Array<number[]>;

export type SeedRandom = (seed: string, ...args: any[]) => () => number;

export type RandomMethod = 'randomFromSet' | 'random';

export type SignedTypedArray = Int8Array | Int16Array | Int32Array;
export type UnsignedTypedArray = Uint8Array | Uint16Array | Uint32Array;
export type TypedArray = UnsignedTypedArray | SignedTypedArray;

export interface GameState {
  activePiece: Block;
  cascadeCount: number;
  conf: GameConfig;
  isEnded: boolean;
  isClearDelay: boolean;
  level: number;
  levelPrev: number;
  nextLevelThreshold: number;
  rowsCleared: number;
  rowsClearedPrev: number;
  score: number;
  tilesCleared: number;
  tilesClearedPrev: number;
}

export interface GameControls {
  endGame(): void;
  incrementFramework?: () => void;
  decrementFramework?: () => void;
  moveDown(): void;
  moveLeft(): void;
  moveRight(): void;
  moveUp(): void;
  pause?: () => void;
  rotateLeft(): void;
  rotateRight(): void;
  setFramework?: (fw: number) => void;
}

export interface Game {
  state: GameState;
  controls: GameControls;
  activeFramework: () => 10 | 20 | 30;
  board: Board;
  canMoveDown(): boolean;
  canMoveLeft(): boolean;
  canMoveRight(): boolean;
  canMoveUp(): boolean;
  canRotateLeft(): boolean;
  canRotateRight(): boolean;
  clearCheck(
    markOffset?: number,
  ): { total: number; breakdown: { fw: 10 | 20 | 30; total: number }[] };
  clearNonSolids(): void;
  detectAndClear: (
    markOffset?: number,
  ) => { breakdown: { fw: 10 | 20 | 30; total: number }[]; total: number };
  emit: <T>(channel: string, payload?: T) => any;
  gameOver: () => any;
  gravityDrop: () => any;
  moveBlock(axis: 'x' | 'y', quantity: number): any;
  newBlock: () => any;
  nextBlock: () => Block;
  tick: (delta: number) => any;
}
