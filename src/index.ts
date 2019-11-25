import { ImageDictionary } from './interfaces';
import { loadImages, createGlContext } from './initialization';
import {
  dataDict,
  meshConfigs,
  materialTexturePaths,
  materialColours,
  programs,
} from './configuration';
import { identity4_4, translate4_4, scale4_4 } from './matrix/matrix-4';
import { MeshProvider } from './gl/mesh-provider';
import { ProgramProvider } from './gl/program-provider';
import { Renderer } from './gl/renderer';
import { MaterialProvider } from './gl/material-provider';
import { ShapeLite, Lights, MeshConfig } from './gl/interfaces';
import { KeyboardControl } from './keyboard-control';
import { create1 } from './engine/engine';
import { objEach } from '@ch1/utility';

const cubeSize = 20;

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

  const lightConfig = {
    c_directionalLightCount: '1',
    c_gamma: '2.2',
    c_pointLightCount: '1',
    c_spotLightCount: '1',
  };
  const lightConfigKey = JSON.stringify(lightConfig);

  programs.forEach(program => {
    programProvider.register(program.name, program.programConfig);
    if (program.useLights) {
      programProvider.initialize(program.name, lightConfig, lightConfigKey);
    } else {
      programProvider.initialize(program.name);
    }
  });

  const meshProvider = MeshProvider.create(gl, dataDict);
  objEach(meshConfigs, (meshConfig: MeshConfig, name?: string) => {
    if (!name) {
      return;
    }
    meshProvider.register(name, meshConfig, true);
  });

  loadImages(imageDict).then(() => {
    const materialProvider = MaterialProvider.create(gl, imageDict);
    objEach(materialTexturePaths, (path, name) => {
      if (!name) {
        return;
      }
      materialProvider.register(name, {
        diffusePath: '',
        normalPath: '',
        specularPath: '',
        texturePath: path,
        shiny: 32,
      });
    });

    objEach(materialColours, (colour, name) => {
      if (!name) {
        return;
      }
      materialProvider.register(name, colour);
    });

    const renderer = Renderer.create(
      gl,
      programProvider,
      meshProvider,
      materialProvider
    );
    renderer.lights = lights;
    renderer.shapes = shapes;
    (window as any).RENDERER = renderer;

    const engine = create1({
      debug: true,
      preview: 3,
      seed: 'hello-world',
    });

    engine.on('redraw', () => (gameRedraw = true));

    const controlStep = 10;
    const viewControls = KeyboardControl.create({
      '87': () => renderer.camera.trs.forward(controlStep),
      '65': () => renderer.camera.trs.strafeLeft(controlStep),
      '83': () => renderer.camera.trs.backward(controlStep),
      '58': () => renderer.camera.trs.strafeRight(controlStep),
      '81': () => renderer.camera.trs.up(controlStep),
      '69': () => renderer.camera.trs.down(controlStep),
      '219': () => renderer.camera.trs.rotateLeft(Math.PI / 16),
      '221': () => renderer.camera.trs.rotateRight(Math.PI / 16),
    });

    const gameControls = KeyboardControl.create({
      '37': engine.controls.moveLeft,
      '38': engine.controls.moveUp,
      '39': engine.controls.moveRight,
      '40': engine.controls.moveDown,
      '90': engine.controls.rotateLeft,
      '88': engine.controls.rotateRight,
    });

    viewControls.bind();
    gameControls.bind();

    let gameRedraw = false;

    renderer.shapes = shapes;

    renderer.camera.trs.setX(-129);
    renderer.camera.trs.setY(160);
    const render = () => {
      if (gameRedraw) {
        gameRedraw = false;
        const head = renderer.shapes.shift();
        const blocks = fullRedraw(engine);
        if (head) {
          blocks.unshift(head);
        }
        renderer.shapes = blocks;
      }
      renderer.render(lightConfigKey);
      requestAnimationFrame(render);
    };
    render();
  });
}

function fullRedraw(engine: any, blocks: ShapeLite[] = []) {
  for (let i = 0; i < engine.buffer.length; i += 1) {
    const el = engine.buffer[i];
    if (el !== 0) {
      const j = engine.config.width * engine.config.height - i;
      const y = cubeSize * Math.floor(j / engine.config.width) + cubeSize;
      const x = -cubeSize * (j % engine.config.width);
      const block = getBlockFromInt(el, x, y);
      blocks.push(block);
    }
  }

  return blocks;
}

function createCube(
  type: CubeType,
  x: number,
  y: number,
  z = 0,
  cs = cubeSize
): ShapeLite {
  return {
    material: textureFromCubeType(type),
    world: scale4_4(translate4_4(identity4_4(), x, y, z), cs, cs, cs),
    mesh: meshFromCubeType(type),
    programPreference: 'directionalPointSpotTexture',
  };
}

function textureFromCubeType(type: CubeType) {
  switch (type) {
    case CubeType.Red:
      return 'redTexture';
    case CubeType.Green:
      return 'greenTexture';
    case CubeType.Blue:
      return 'blueTexture';
    case CubeType.RedDash:
      return 'redTextureDash';
    case CubeType.GreenDash:
      return 'greenTextureDash';
    case CubeType.BlueDash:
      return 'blueTextureDash';
  }
}

function meshFromCubeType(type: CubeType) {
  switch (type) {
    case CubeType.Red:
      return 'redCube';
    case CubeType.Green:
      return 'greenCube';
    case CubeType.Blue:
      return 'blueCube';
    case CubeType.RedDash:
      return 'redCube';
    case CubeType.GreenDash:
      return 'greenCube';
    case CubeType.BlueDash:
      return 'blueCube';
  }
}

enum CubeType {
  RedDash,
  GreenDash,
  BlueDash,
  Red,
  Green,
  Blue,
}

export function getBlockFromInt(
  int: number,
  x: number,
  y: number,
  z = 0,
  cs = cubeSize
) {
  switch (int) {
    case 10:
      return createCube(CubeType.Green, x, y, z, cs);
    case 19:
      return createCube(CubeType.GreenDash, x, y, z, cs);
    case 20:
      return createCube(CubeType.Red, x, y, z, cs);
    case 29:
      return createCube(CubeType.RedDash, x, y, z, cs);
    case 30:
      return createCube(CubeType.Blue, x, y, z, cs);
    case 39:
      return createCube(CubeType.BlueDash, x, y, z, cs);
    default:
      return createCube(CubeType.Blue, x, y, z, cs);
  }
}
