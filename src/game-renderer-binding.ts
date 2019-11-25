import { ShapeLite, Lights } from './gl/interfaces';
import { identity4_4, translate4_4, scale4_4 } from './matrix/matrix-4';
import { Renderer } from './gl/renderer';
import { KeyboardControl } from './keyboard-control';
import { ObjectPool, Matrix4_4 } from './interfaces';

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
  static create(
    opShape: ObjectPool<ShapeLite>,
    op4_4: ObjectPool<Matrix4_4>,
    renderer: Renderer,
    engine: any,
    lights: Lights
  ) {
    return new GameRendererBinding(opShape, op4_4, renderer, engine, lights);
  }

  private gameRedraw = false;

  constructor(
    private opShape: ObjectPool<ShapeLite>,
    private op4_4: ObjectPool<Matrix4_4>,
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
      '68': () => renderer.camera.trs.strafeRight(controlStep),
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

  private createCube(
    type: CubeType,
    x: number,
    y: number,
    z = 0,
    cs = cubeSize
  ): ShapeLite {
    const cube = this.opShape.malloc();
    cube.material = textureFromCubeType(type);
    cube.mesh = meshFromCubeType(type);
    cube.world = scale4_4(
      translate4_4(identity4_4(this.op4_4), x, y, z, this.op4_4),
      cs,
      cs,
      cs,
      this.op4_4
    );
    cube.programPreference = 'directionalPointSpotTexture';

    return cube;
  }

  private getBlockFromInt(
    int: number,
    x: number,
    y: number,
    z = 0,
    cs = cubeSize
  ) {
    switch (int) {
      case 10:
        return this.createCube(CubeType.Green, x, y, z, cs);
      case 19:
        return this.createCube(CubeType.GreenDash, x, y, z, cs);
      case 20:
        return this.createCube(CubeType.Red, x, y, z, cs);
      case 29:
        return this.createCube(CubeType.RedDash, x, y, z, cs);
      case 30:
        return this.createCube(CubeType.Blue, x, y, z, cs);
      case 39:
        return this.createCube(CubeType.BlueDash, x, y, z, cs);
      default:
        return this.createCube(CubeType.Blue, x, y, z, cs);
    }
  }

  private fullRedraw(engine: any, blocks: ShapeLite[] = []) {
    for (let i = 0; i < engine.buffer.length; i += 1) {
      const el = engine.buffer[i];
      if (el !== 0) {
        const j = engine.config.width * engine.config.height - i - 1;
        const y = cubeSize * Math.floor(j / engine.config.width) + cubeSize;
        const x = -cubeSize * (j % engine.config.width);
        const block = this.getBlockFromInt(el, x, y);
        blocks.push(block);
      }
    }

    return blocks;
  }

  start(lightConfigKey: string) {
    let last = 0;
    const render = (now: number) => {
      if (!last) {
        last = now;
      }
      const since = now - last;
      last = now;
      if (since > 2000) {
        console.log('slowing down!!! redraws taking too long');
        requestAnimationFrame(render);
        return;
      }

      if (this.gameRedraw) {
        this.gameRedraw = false;
        const head = this.renderer.shapes.shift();
        this.renderer.shapes.forEach(shape => {
          this.opShape.free(shape);
        });
        const blocks = this.fullRedraw(this.engine);
        if (head) {
          blocks.unshift(head);
        }
        this.renderer.shapes = blocks;
      }
      this.renderer.render(lightConfigKey);
      requestAnimationFrame(render);
    };
    render(0);
  }
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
