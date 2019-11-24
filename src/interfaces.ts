import { Dictionary } from '@ch1/utility';
import { ProgramContextAttributeBase } from './gl/interfaces';
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
 * GL Programs
 *
 *
 */

export interface ShaderDictionary {
  [key: string]: {
    fragment: string;
    vertex: string;
  };
}

export type ImageDictionary = Dictionary<HTMLImageElement>;
export type TextureDictionary = Dictionary<WebGLTexture>;

export interface ProgramContextAttributeConfig
  extends ProgramContextAttributeBase {
  type: string;
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
 * UI
 *
 *
 */
export type Translations = Dictionary<Translation>;
export type Translation = Dictionary<Dictionary<string>>;

export interface LanguageState {
  currentCode(): string;
  current(): Translation;
  on(callback: (...args: any[]) => void): () => void;
  set(languageCode?: string): void;
}

export type UiToGameState = EventEmitter;

/**
 *
 *
 * Event Emitter
 *
 *
 */
export interface EventEmitter {
  emit(message: string, ...args: any[]): void;
  on(message: string, callback: EventHandler): () => void;
}

export interface EventHandler {
  (...args: any[]): void;
}
