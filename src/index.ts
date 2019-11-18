import { ImageDictionary, Matrix4_4 } from './interfaces';
import {
  loadImages,
  createDrawContext,
  createGlContext,
} from './initialization';
import { programConfigDict, dataDict, meshConfigs } from './configuration';
import { drawLoop } from './render';
import {
  GlBindTypes,
  GlTypes,
  GlFragmentFunctionSnippets,
  GlVertexFunctionSnippets,
} from './gl/interfaces';
import { identity4_4, translate4_4, scale4_4 } from './matrix/matrix-4';
import { MeshProvider } from './gl/mesh-provider';
import { ProgramProvider } from './gl/program-provider';
import { Renderer } from './gl/renderer';

const programConfig = {
  fragmentDeclarations: [
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  fragmentFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlFragmentFunctionSnippets.Main1,
    },
  ],
  vertexDeclarations: [
    {
      bindType: GlBindTypes.Attribute,
      glType: 'FLOAT',
      name: 'a_position',
      varType: GlTypes.Vec4,
      normalize: false,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Attribute,
      glType: 'UNSIGNED_BYTE',
      name: 'a_colour',
      varType: GlTypes.Vec4,
      normalize: true,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_worldViewProjection',
      varType: GlTypes.Mat4,
    },
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  vertexFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlVertexFunctionSnippets.Main1,
    },
  ],
};

const shapes: { local: Matrix4_4; mesh: string }[] = [
  {
    local: scale4_4(translate4_4(identity4_4(), -200, 0, 100), 20, 20, 20),
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

  const programProvider = ProgramProvider.create(gl);
  programProvider.register('default', programConfig);
  programProvider.initialize('default');

  const meshProvider = MeshProvider.create(gl, dataDict);
  shapes.forEach(shape => {
    meshProvider.register(shape.mesh, meshConfigs[shape.mesh], true);
  });

  const renderer = Renderer.create(gl, programProvider, meshProvider);
  renderer.shapes = shapes;
  (window as any).RENDERER = renderer;

  const render = () => {
    renderer.render();
    requestAnimationFrame(render);
  };
  render();
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

// Returns a random integer from 0 to range - 1.
// function randomInt(range: number) {
//   return Math.floor(Math.random() * range);
// }
