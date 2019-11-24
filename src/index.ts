import { ImageDictionary } from './interfaces';
import { loadImages, createGlContext } from './initialization';
import {
  dataDict,
  meshConfigs,
  materialTexturePaths,
  materialColours,
} from './configuration';
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
  directionalPointSpotColour,
  directionalPointSpotTexture,
} from './gl/program-configs';
import { MaterialProvider } from './gl/material-provider';
import { ShapeLite, Lights, MaterialColour } from './gl/interfaces';
import { KeyboardControl } from './keyboard-control';

const shapes: ShapeLite[] = [
  //draw floor
  {
    material: 'blackColour',
    world: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 10000, 1, 10000),
    mesh: 'blackCube',
    programPreference: 'directionalPointColour',
  },
  // front row
  {
    material: 'redTextureDash',
    world: scale4_4(translate4_4(identity4_4(), -200, 20, -100), 20, 20, 20),
    mesh: 'redCube',
    programPreference: 'textureOnly',
  },
  {
    material: 'greenColour',
    world: scale4_4(translate4_4(identity4_4(), 0, 20, -100), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointColour',
  },
  {
    world: scale4_4(translate4_4(identity4_4(), 200, 20, -100), 20, 20, 20),
    mesh: 'blueCube',
  },
  // middle row
  {
    material: 'redTexture',
    world: scale4_4(translate4_4(identity4_4(), -200, 20, 100), 20, 20, 20),
    mesh: 'redCube',
    programPreference: 'directionalTexture',
  },
  {
    material: 'blueTexture',
    world: scale4_4(translate4_4(identity4_4(), -35, 70, 50), 20, 20, 20),
    mesh: 'blueCube',
    programPreference: 'directionalPointTexture',
  },
  {
    material: 'greenColour',
    world: scale4_4(translate4_4(identity4_4(), 35, 70, 25), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointColour',
  },
  {
    material: 'greenColour',
    world: scale4_4(translate4_4(identity4_4(), 0, 20, 100), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointColour',
  },
  {
    material: 'blueTexture',
    world: scale4_4(translate4_4(identity4_4(), 200, 20, 100), 20, 20, 20),
    mesh: 'blueCube',
    programPreference: 'directionalPointSpotTexture',
  },
  // back row
  {
    material: 'redTexture',
    world: scale4_4(translate4_4(identity4_4(), -200, 20, 200), 20, 20, 20),
    mesh: 'redCube',
    programPreference: 'directionalTexture',
  },
  {
    material: 'greenColour',
    world: scale4_4(translate4_4(identity4_4(), 0, 20, 200), 20, 20, 20),
    mesh: 'greenCube',
    programPreference: 'directionalPointSpotColour',
  },
  {
    material: 'blueTexture',
    world: scale4_4(translate4_4(identity4_4(), 200, 20, 200), 20, 20, 20),
    mesh: 'blueCube',
    programPreference: 'directionalPointSpotTexture',
  },
  // draw axis
  {
    world: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 10000, 1, 1),
    mesh: 'blackCube',
  },
  {
    world: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 1, 10000, 1),
    mesh: 'blackCube',
  },
  {
    world: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 1, 1, 10000),
    mesh: 'blackCube',
  },
];

const lights: Lights = {
  directionals: [
    {
      direction: [3, 5, -10],
      ambient: [0.05, 0.05, 0.05],
      diffuse: [0.25, 0.25, 0.25],
      specular: [0.3, 0.3, 0.3],
    },
  ],
  points: [
    {
      position: [0, 75, 0],
      ambient: [0.05, 0.05, 0.05],
      diffuse: [5.9, 0.0, 0.0],
      specular: [0.9, 0.9, 0.9],
      constant: 1.0,
      linear: 0.014,
      quadratic: 0.0007,
    },
  ],
  spots: [
    {
      direction: [20, 10, -100],
      position: [225, 35, 225],
      ambient: [0.05, 0.05, 0.05],
      diffuse: [5.9, 5.9, 5.9],
      specular: [0.9, 0.9, 0.9],
      constant: 1.0,
      linear: 0.014,
      quadratic: 0.0007,
      cutOff: Math.PI / 4,
      outerCutOff: Math.PI / 2,
    },
  ],
};

main();

function main() {
  const { gl } = createGlContext();
  const imageDict: ImageDictionary = {};
  const programProvider = ProgramProvider.create(gl);
  programProvider.register('vertexOnly', vertexOnly);
  programProvider.initialize('vertexOnly');

  programProvider.register('textureOnly', textureOnly);
  programProvider.initialize('textureOnly');

  const lightConfig = {
    c_directionalLightCount: '1',
    c_gamma: '2.2',
    c_pointLightCount: '1',
    c_spotLightCount: '1',
  };
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

  programProvider.register(
    'directionalPointSpotColour',
    directionalPointSpotColour
  );
  programProvider.initialize(
    'directionalPointSpotColour',
    lightConfig,
    lightConfigKey
  );

  programProvider.register(
    'directionalPointSpotTexture',
    directionalPointSpotTexture
  );
  programProvider.initialize(
    'directionalPointSpotTexture',
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
      '119': () => renderer.camera.trs.forward(controlStep),
      '97': () => renderer.camera.trs.strafeLeft(controlStep),
      '115': () => renderer.camera.trs.backward(controlStep),
      '100': () => renderer.camera.trs.strafeRight(controlStep),
      '113': () => renderer.camera.trs.up(controlStep),
      '101': () => renderer.camera.trs.down(controlStep),
      '91': () => renderer.camera.trs.rotateLeft(Math.PI / 16),
      '93': () => renderer.camera.trs.rotateRight(Math.PI / 16),
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
