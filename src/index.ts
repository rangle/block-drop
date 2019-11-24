import { ImageDictionary, MaterialColour } from './interfaces';
import {
  loadImages,
  createDrawContext,
  createGlContext,
} from './initialization';
import {
  programConfigDict,
  dataDict,
  meshConfigs,
  materialTexturePaths,
  materialColours,
} from './configuration';
import { drawLoop } from './render';
import { identity4_4, translate4_4, scale4_4 } from './matrix/matrix-4';
import { MeshProvider } from './gl/mesh-provider';
import { ProgramProvider } from './gl/program-provider';
import { Renderer } from './gl/renderer';
import {
  vertexOnly,
  textureOnly,
  directionalColour,
  directionalTexture,
  directionalPointColour,
  directionalPointTexture,
} from './gl/program-configs';
import { MaterialProvider } from './gl/material-provider';
import { ShapeLite, Lights } from './gl/interfaces';
import { KeyboardControl } from './keyboard-control';

const shapes: ShapeLite[] = [
  //draw floor
  {
    material: 'blackColour',
    local: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 10000, 1, 10000),
    mesh: 'blackCube',
    programPreference: 'directionalPointColour',
  },
  // front row
  {
    material: 'redTextureDash',
    local: scale4_4(translate4_4(identity4_4(), -200, 20, -100), 20, 20, 20),
    mesh: 'redCube',
    programPreference: 'textureOnly',
  },
  {
    material: 'greenColour',
    local: scale4_4(translate4_4(identity4_4(), 0, 20, -100), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointColour',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 200, 20, -100), 20, 20, 20),
    mesh: 'blueCube',
  },
  // middle row
  {
    material: 'redTexture',
    local: scale4_4(translate4_4(identity4_4(), -200, 20, 100), 20, 20, 20),
    mesh: 'redCube',
    programPreference: 'directionalTexture',
  },
  {
    material: 'blueTexture',
    local: scale4_4(translate4_4(identity4_4(), -35, 70, 50), 20, 20, 20),
    mesh: 'blueCube',
    programPreference: 'directionalPointTexture',
  },
  {
    material: 'greenColour',
    local: scale4_4(translate4_4(identity4_4(), 35, 70, 25), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointColour',
  },
  {
    material: 'greenColour',
    local: scale4_4(translate4_4(identity4_4(), 0, 20, 100), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointColour',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 200, 20, 100), 20, 20, 20),
    mesh: 'blueCube',
  },
  // back row
  {
    material: 'redTexture',
    local: scale4_4(translate4_4(identity4_4(), -200, 20, 200), 20, 20, 20),
    mesh: 'redCube',
    programPreference: 'directionalTexture',
  },
  {
    material: 'greenColour',
    local: scale4_4(translate4_4(identity4_4(), 0, 20, 200), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalColour',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 200, 20, 200), 20, 20, 20),
    mesh: 'blueCube',
  },
  // draw axis
  {
    local: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 10000, 1, 1),
    mesh: 'blackCube',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 1, 10000, 1),
    mesh: 'blackCube',
  },
  {
    local: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 1, 1, 10000),
    mesh: 'blackCube',
  },
];

const lights: Lights = {
  directionals: [
    {
      direction: [3, 5, -10],
      ambient: [0.05, 0.05, 0.05],
      diffuse: [0.85, 0.85, 0.85],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  points: [
    {
      position: [0, 75, 0],
      ambient: [0.05, 0.05, 0.05],
      diffuse: [13.9, 0.0, 0.0],
      specular: [0.9, 0.9, 0.9],
      constant: 1.0,
      linear: 0.014,
      quadratic: 0.0007,
    },
  ],
  spots: [],
};

main2();

function main2() {
  const { gl } = createGlContext();
  const imageDict: ImageDictionary = {};
  const programProvider = ProgramProvider.create(gl);
  programProvider.register('vertexOnly', vertexOnly);
  programProvider.initialize('vertexOnly');

  programProvider.register('textureOnly', textureOnly);
  programProvider.initialize('textureOnly');

  const lightConfig = { c_directionalLightCount: '1', c_pointLightCount: '1' };
  const lightConfigKey = JSON.stringify(lightConfig);

  programProvider.register('directionalColour', directionalColour);
  programProvider.initialize('directionalColour', lightConfig, lightConfigKey);

  programProvider.register('directionalTexture', directionalTexture);
  programProvider.initialize('directionalTexture', lightConfig, lightConfigKey);

  programProvider.register('directionalPointColour', directionalPointColour);
  programProvider.initialize(
    'directionalPointColour',
    lightConfig,
    lightConfigKey
  );

  programProvider.register('directionalPointTexture', directionalPointTexture);
  programProvider.initialize(
    'directionalPointTexture',
    lightConfig,
    lightConfigKey
  );

  const meshProvider = MeshProvider.create(gl, dataDict);
  shapes.forEach(shape => {
    meshProvider.register(shape.mesh, meshConfigs[shape.mesh], true);
  });

  loadImages(imageDict).then(() => {
    const materialProvider = MaterialProvider.create(gl, imageDict);
    shapes.forEach(shape => {
      if (shape.material) {
        const tp = (materialTexturePaths as any)[shape.material] as string;
        if (tp) {
          materialProvider.register(shape.material, {
            diffusePath: '',
            normalPath: '',
            specularPath: '',
            texturePath: tp,
            shiny: 32,
          });
          return;
        }
        const cp = (materialColours as any)[shape.material] as MaterialColour;
        if (cp) {
          materialProvider.register(shape.material, cp);
        }
      }
    }, true);

    const renderer = Renderer.create(
      gl,
      programProvider,
      meshProvider,
      materialProvider
    );
    renderer.lights = lights;
    renderer.shapes = shapes;
    (window as any).RENDERER = renderer;

    const controlStep = 10;
    const controls = KeyboardControl.create({
      '119': () => renderer.camera.forward(controlStep),
      '97': () => renderer.camera.strafeLeft(controlStep),
      '115': () => renderer.camera.backward(controlStep),
      '100': () => renderer.camera.strafeRight(controlStep),
      '113': () => renderer.camera.up(controlStep),
      '101': () => renderer.camera.down(controlStep),
      '91': () => renderer.camera.rotateLeft(Math.PI / 16),
      '93': () => renderer.camera.rotateRight(Math.PI / 16),
    });

    controls.bind();

    // renderer.camera.lookAt([0, 1, 1]);

    const render = () => {
      renderer.render(lightConfigKey);
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
