import { ShapeLite, Lights } from './gl/interfaces';
import { identity4_4, translate4_4, scale4_4 } from './matrix/matrix-4';
import { Renderer } from './gl/renderer';
import { KeyboardControl } from './keyboard-control';

const cubeSize = 20;

const shapes: ShapeLite[] = [
  //draw floor
  {
    material: 'blackColour',
    world: scale4_4(translate4_4(identity4_4(), 0, 0, 0), 10000, 1, 10000),
    mesh: 'blackCube',
    programPreference: 'directionalPointColour',
  },
];

export class GameRendererBinding {
  static create(renderer: Renderer, engine: any, lights: Lights) {
    return new GameRendererBinding(renderer, engine, lights);
  }

  private gameRedraw = false;

  constructor(
    private renderer: Renderer,
    private engine: any,
    private lights: Lights
  ) {
    renderer.shapes = shapes;
    engine.on('redraw', () => (this.gameRedraw = true));

    const midX = (-engine.config.width * cubeSize) / 2;
    renderer.camera.trs.setX(midX);
    renderer.camera.trs.setY(160);

    this.lights.points[0].position[0] = midX;

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
  }

  start(lightConfigKey: string) {
    const render = () => {
      if (this.gameRedraw) {
        this.gameRedraw = false;
        const head = this.renderer.shapes.shift();
        const blocks = fullRedraw(this.engine);
        if (head) {
          blocks.unshift(head);
        }
        this.renderer.shapes = blocks;
      }
      this.renderer.render(lightConfigKey);
      requestAnimationFrame(render);
    };
    render();
  }
}

function fullRedraw(engine: any, blocks: ShapeLite[] = []) {
  for (let i = 0; i < engine.buffer.length; i += 1) {
    const el = engine.buffer[i];
    if (el !== 0) {
      const j = engine.config.width * engine.config.height - i - 1;
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
