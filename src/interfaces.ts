import { Dictionary } from '@ch1/utility';
/**
 *
 *
 * Matrices
 *
 *
 */
export type Matrix3_1 = [number, number, number];
export type Matrix3_2 = [number, number, number, number, number, number];
export type Matrix3_3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export type Matrix4_1 = [number, number, number, number];
export type Matrix4_4 = Float32Array;

export interface DataDictionary {
  [key: string]: Float32Array | Uint8Array;
}

/**
 *
 *
 * GL Shapes
 *
 *
 */
export interface ShapeConfig {
  positionsDataName: string;
  coloursDataName: string;
  lightDirection?: Matrix3_1;
  programName: string;
  normalsDataName?: string;
}

export interface Shape {
  a_colour: WebGLBuffer;
  context: ProgramContext;
  lightDirection: Matrix3_1;
  a_normal?: WebGLBuffer;
  a_position: WebGLBuffer;
  vertexCount: number;
}

export type BufferMap = Map<Float32Array | Uint8Array, WebGLBuffer>;

/**
 *
 *
 * GL Programs
 *
 *
 */

export interface ProgramDictionary {
  [key: string]: ProgramContext;
}

export interface ShaderDictionary {
  [key: string]: {
    fragment: string;
    vertex: string;
  };
}
export interface ProgramContextAttributeBase {
  name: string;
  normalize: boolean;
  size: number;
  stride: number;
  offset: number;
}

export interface ProgramContextAttributeConfig
  extends ProgramContextAttributeBase {
  type: string;
}

export interface ProgramContextConfig {
  attributes: ProgramContextAttributeConfig[];
  shaderNames: {
    fragment: string;
    vertex: string;
  };
  uniforms: {
    name: string;
  }[];
}

export interface ProgramContextAttribute extends ProgramContextAttributeBase {
  buffer: WebGLBuffer;
  location: number;
  type: number;
}

export interface ProgramContextUniform {
  name: string;
  location: WebGLUniformLocation;
}

export interface ProgramContext {
  attributes: Dictionary<ProgramContextAttribute>;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  shaders: {
    fragment: WebGLShader;
    vertex: WebGLShader;
  };
  uniforms: Dictionary<ProgramContextUniform>;
}

/**
 *
 *
 * Scene Graph
 *
 *
 */
export interface TRS {
  rotation: Matrix3_1;
  scale: Matrix3_1;
  translation: Matrix3_1;
}
export interface SceneGraph extends TRS {
  children: SceneGraph[];
  localMatrix: Matrix4_4;
  name: string;
  op3_1: ObjectPool<Matrix3_1>;
  op4_4: ObjectPool<Matrix4_4>;
  parent: SceneGraph | null;
  shape?: Shape;
  worldMatrix: Matrix4_4;
  setParent(parent: null | SceneGraph): void;
  toArray(): SceneGraphShape[];
  updateLocalMatrix(): void;
  updateWorldMatrix(): void;
  walk(callback: (s: SceneGraph) => void): void;
}

export interface SceneGraphShape extends SceneGraph {
  shape: Shape;
}

export interface SceneConfig {
  children: SceneConfig[];
  initialRotation?: Matrix3_1;
  initialScale?: Matrix3_1;
  initialTranslation?: Matrix3_1;
  name: string;
  shape?: ShapeConfig;
}

/**
 *
 *
 * Object Pool
 *
 */
export interface ObjectPool<T> {
  free(obj: T): void;
  malloc(): T;
}

/**
 *
 *
 * Engine
 *
 *
 */

export type Matrix = Array<number[]>;

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

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface Board {
  width: number;
  height: number;
  desc: Uint8Array;
}

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
    markOffset?: number
  ): { total: number; breakdown: { fw: 10 | 20 | 30; total: number }[] };
  clearNonSolids(): void;
  detectAndClear: (
    markOffset?: number
  ) => { breakdown: { fw: 10 | 20 | 30; total: number }[]; total: number };
  emit: <T>(channel: string, payload?: T) => any;
  gameOver: (restartGame?: boolean) => any;
  gravityDrop: () => any;
  moveBlock(axis: 'x' | 'y', quantity: number): any;
  newBlock: () => any;
  nextBlock: () => Block;
  tick: (delta: number) => any;
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
  gamePadThrottleInterval: number;
}

export type GameConfigOptions = { [P in keyof GameConfig]?: GameConfig[P] };

export type RandomMethod = 'randomFromSet' | 'random';

export interface BlockDescription {
  desc: Matrix;
  name?: string;
}

export interface Board1 extends Board {
  descBuffer: Uint8Array;
}

export type SignedTypedArray = Int8Array | Int16Array | Int32Array;
export type UnsignedTypedArray = Uint8Array | Uint16Array | Uint32Array;
export type TypedArray = UnsignedTypedArray | SignedTypedArray;

export type BooleanFunction = (...args: any[]) => boolean;

export interface FunctionsCollection<T extends Function> {
  default(): T;
  get(name: string): T;
  list(): string;
  register(name: string, func: T): void;
}

export type SeedRandom = (seed: string, ...args: any[]) => () => number;
