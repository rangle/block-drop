import { objReduce } from '@ch1/utility';
import { ImageDictionary } from './interfaces';
import { createLanguageState } from './languages';
import { createEventEmitter } from './utility/event';
import { materialTexturePaths } from './configuration';
declare const LOG_LEVEL: string;
const WebGLDebugUtils: any =
  LOG_LEVEL === 'debug'
    ? require('../vendor/webgl-debug').WebGLDebugUtils
    : undefined;

function body() {
  const canvas = window.document.createElement('canvas');
  const languages = window.document.createElement('span');
  const editor = window.document.createElement('section');
  const uiToGameState = createEventEmitter();

  languages.className = 'languages';
  window.document.body.appendChild(canvas);

  import('./languages')
    .then(lang => {
      const ls = createLanguageState();
      ls.on(() => (window.document.title = ls.current().meta.title));
      lang.main(languages, ls);
      window.document.body.appendChild(languages);
      return import('./editor').then(ed => {
        ed.main(editor, ls, uiToGameState);
        window.document.body.appendChild(editor);
        ls.set();
      });
    })
    .catch((e: Error) => {
      throw e;
    });

  return { canvas, uiToGameState };
}

function getContext(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('unable to get GL context');
  }
  return gl;
}

export function createGlContext() {
  const tree = body();
  const gl =
    LOG_LEVEL === 'debug'
      ? WebGLDebugUtils.makeDebugContext(getContext(tree.canvas))
      : getContext(tree.canvas);

  // set the clear colour
  gl.clearColor(0, 0, 0, 0);

  // enable cull face
  gl.enable(gl.CULL_FACE);

  // enable depth test
  gl.enable(gl.DEPTH_TEST);

  return { gl, tree };
}

export function loadImages(imageDict: ImageDictionary) {
  return Promise.all(
    objReduce(
      materialTexturePaths,
      (promises: Promise<void>[], texturePath) => {
        promises.push(
          new Promise((resolve, reject) => {
            const image = new Image();
            image.src = texturePath;
            image.addEventListener('load', () => {
              imageDict[texturePath] = image;
              resolve();
            });
            image.addEventListener('error', (e: any) => {
              reject(e);
            });
          })
        );
        return promises;
      },
      []
    )
  );
}

export function resize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

// export function getBlockFromInt(context: DrawContext, int: number) {
//   let config: SceneConfig;
//   switch (int) {
//     case 10:
//       config = blockConfig.green;
//       break;
//     case 19:
//       config = blockConfig.greenDash;
//       break;
//     case 20:
//       config = blockConfig.red;
//       break;
//     case 29:
//       config = blockConfig.redDash;
//       break;
//     case 30:
//       config = blockConfig.blue;
//       break;
//     case 39:
//       config = blockConfig.blueDash;
//       break;
//     default:
//       config = blockConfig.blue;
//       break;
//   }
//   return sceneConfigToNode(
//     context.opScene,
//     dataDict,
//     context.programDict,
//     context.imageDict,
//     context.textureDict,
//     context.bufferMap,
//     context.gl,
//     config,
//     context.op3_1,
//     context.op4_4
//   );
// }
