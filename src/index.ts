import { ImageDictionary } from './interfaces';
import { loadImages, createGlContext } from './initialization';
import {
  dataDict,
  meshConfigs,
  materialTexturePaths,
  materialColours,
  programs,
} from './configuration';
import { MeshProvider } from './gl/mesh-provider';
import { ProgramProvider } from './gl/program-provider';
import { Renderer } from './gl/renderer';
import { MaterialProvider } from './gl/material-provider';
import { MeshConfig, Lights } from './gl/interfaces';
import { create1 } from './engine/engine';
import { objEach } from '@ch1/utility';
import { GameRendererBinding } from './game-renderer-binding';

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
      position: [0, 10, 0],
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
    (window as any).RENDERER = renderer;

    const engine = create1({
      debug: true,
      preview: 3,
      seed: 'hello-world',
    });

    const bindings = GameRendererBinding.create(renderer, engine, lights);
    bindings.start(lightConfigKey);
  });
}
