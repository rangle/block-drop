import { ImageDictionary } from './interfaces';
import {
  loadImages,
  createDrawContext,
  createGlContext,
} from './initialization';
import {
  programConfigDict,
  dataDict,
  meshConfigs,
  texturePaths,
} from './configuration';
import { drawLoop } from './render';
import { identity4_4, translate4_4, scale4_4 } from './matrix/matrix-4';
import { MeshProvider } from './gl/mesh-provider';
import { ProgramProvider } from './gl/program-provider';
import { Renderer } from './gl/renderer';
import { vertexOnly, textureOnly } from './program-configs';
import { MaterialProvider } from './gl/material-provider';
import { ShapeLite } from './gl/interfaces';

const shapes: ShapeLite[] = [
  {
    material: 'redDash',
    local: scale4_4(translate4_4(identity4_4(), -200, 0, 100), 20, 20, 20),
    programPreference: 'textureOnly',
    mesh: 'redCube',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 0, 0, 100), 20, 20, 20),
    mesh: 'greenCube',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 200, 0, 100), 20, 20, 20),
    mesh: 'blueCube',
  },
];

main2();

function main2() {
  const { gl } = createGlContext();
  const imageDict: ImageDictionary = {};

  const programProvider = ProgramProvider.create(gl);
  programProvider.register('default', vertexOnly);
  programProvider.initialize('default');
  programProvider.register('textureOnly', textureOnly);
  programProvider.initialize('textureOnly');

  const meshProvider = MeshProvider.create(gl, dataDict);
  shapes.forEach(shape => {
    meshProvider.register(shape.mesh, meshConfigs[shape.mesh], true);
  });

  loadImages(imageDict).then(() => {
    const materialProvider = MaterialProvider.create(gl, imageDict);
    shapes.forEach(shape => {
      if (shape.material) {
        const tp = (texturePaths as any)[shape.material] as string;
        materialProvider.register(shape.material, {
          diffusePath: '',
          normalPath: '',
          specularPath: '',
          texturePath: tp,
          shiny: 35,
        });
      }
    }, true);

    const renderer = Renderer.create(
      gl,
      programProvider,
      meshProvider,
      materialProvider
    );
    renderer.shapes = shapes;
    (window as any).RENDERER = renderer;

    const render = () => {
      renderer.render();
      requestAnimationFrame(render);
    };
    render();
  });
}

export function main() {
  try {
    const imageDict: ImageDictionary = {};
    loadImages(imageDict)
      .then(() => {
        const context = createDrawContext(programConfigDict, imageDict);
        drawLoop(context);
      })
      .catch((e: Error) => {
        throw e;
      });
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function error(message: string) {
  const err = window.document.createElement('div');
  err.innerHTML = message;

  return err;
}
