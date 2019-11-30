import { ImageDictionary } from './interfaces';
import { loadImages, createGlContext } from './initialization';
import {
  dataDict,
  meshConfigs,
  materialTexturePaths,
  materialColours,
  programs,
  materialNormalPaths,
  materialSpecularPaths,
  materialDiffusePaths,
} from './configuration';
import { MeshProvider } from './gl/mesh-provider';
import { ProgramProvider } from './gl/program-provider';
import { Renderer } from './gl/renderer';
import { MaterialProvider } from './gl/material-provider';
import { MeshConfig, Lights, ShapeLite } from './gl/interfaces';
import { create1 } from './engine/engine';
import { objEach } from '@ch1/utility';
import { GameRendererBinding } from './game-renderer-binding';
import { createObjectPool } from './utility/object-pool';
import { createMatrix4_4 } from './matrix/matrix-4';
import { createMatrix3_1 } from './matrix/matrix-3';
import { LightsManager } from './lights-manager';

const lights: Lights = {
  directionals: [
    {
      direction: [3, 5, -10],
      ambient: [0.05, 0.05, 0.05],
      diffuse: [0.25, 0.25, 0.25],
      specular: [0.3, 0.3, 0.3],
    },
  ],
  points: [],
  spots: [],
};

main();

function main() {
  const { gl } = createGlContext();
  const imageDict: ImageDictionary = {};
  const programProvider = ProgramProvider.create(gl);

  const op3_1 = createObjectPool(createMatrix3_1);
  const op4_4 = createObjectPool(createMatrix4_4);
  const opCube = createObjectPool<ShapeLite>(() => ({
    material: '',
    mesh: '',
    preferredProgram: '',
    world: op4_4.malloc(),
    tag: '',
  }));

  const lightsManager = LightsManager.create(programProvider, lights, 2.2);

  programs.forEach(program => {
    programProvider.register(program.name, program.programConfig);
    if (program.useLights === false) {
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
        diffusePath: materialDiffusePaths[name]
          ? materialDiffusePaths[name]
          : '',
        normalPath: materialNormalPaths[name] ? materialNormalPaths[name] : '',
        specularPath: materialSpecularPaths[name]
          ? materialSpecularPaths[name]
          : '',
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
      materialProvider,
      op3_1,
      op4_4
    );
    renderer.lights = lights;
    (window as any).RENDERER = renderer;

    const engine = create1({
      debug: true,
      preview: 3,
      seed: 'hello-world',
    });

    const bindings = GameRendererBinding.create(
      opCube,
      op4_4,
      renderer,
      engine,
      lightsManager
    );
    bindings.start();
  });
}
