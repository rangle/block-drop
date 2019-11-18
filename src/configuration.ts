import {
  ShaderDictionary,
  ShapeConfig,
  SceneConfig,
  MeshConfig,
  MaterialColourConfig,
  MaterialTextureConfig,
} from './interfaces';
import {
  fColours,
  fPositions,
  cubeColours,
  cubePositions,
  fNormals,
  cubeNormals,
  cubeBlack,
  cubeBlue,
  cubeGreen,
  cubeRed,
  cubeTextures,
  colouredCubeTextures,
} from './gl/shape-generator';
import { simpleConfig } from './gl/programs/simple';
import { simpleDirectionalConfig } from './gl/programs/simple-directional';
import { advancedDirectionalConfig } from './gl/programs/advanced-directional';
import { advancedDirectionalSimpleTextureConfig } from './gl/programs/advanced-directional-simple-texture';
import { simpleTextureConfig } from './gl/programs/simple-texture';
import { simpleDirPointMixConfig } from './gl/programs/simple-dir_point_mix';
import { Dictionary } from '@ch1/utility';
const blueTexturePath = require('../assets/blue-2048-2048.png');
const greenTexturePath = require('../assets/green-2048-2048.png');
const redTexturePath = require('../assets/red-2048-2048.png');
const blueDashTexturePath = require('../assets/dash-blue-2048-2048.png');
const greenDashTexturePath = require('../assets/dash-green-2048-2048.png');
const redDashTexturePath = require('../assets/dash-red-2048-2048.png');

export const texturePaths = {
  blue: blueTexturePath,
  green: greenTexturePath,
  red: redTexturePath,
  blueDash: blueDashTexturePath,
  greenDash: greenDashTexturePath,
  redDash: redDashTexturePath,
};

export const shaderDict: ShaderDictionary = {
  'advanced-directional-simple-texture': {
    fragment: require('./gl/shaders/advanced-directional-simple-texture-fragment.glsl'),
    vertex: require('./gl/shaders/advanced-directional-simple-texture-vertex.glsl'),
  },
  'advanced-directional': {
    fragment: require('./gl/shaders/advanced-directional-fragment.glsl'),
    vertex: require('./gl/shaders/advanced-directional-vertex.glsl'),
  },
  simple: {
    fragment: require('./gl/shaders/simple-fragment.glsl'),
    vertex: require('./gl/shaders/simple-vertex.glsl'),
  },
  'simple-dir_point_mix': {
    fragment: require('./gl/shaders/simple-dir_point_mix-fragment.glsl'),
    vertex: require('./gl/shaders/simple-dir_point_mix-vertex.glsl'),
  },
  'simple-directional': {
    fragment: require('./gl/shaders/simple-directional-fragment.glsl'),
    vertex: require('./gl/shaders/simple-directional-vertex.glsl'),
  },
  'simple-texture': {
    fragment: require('./gl/shaders/simple-texture-fragment.glsl'),
    vertex: require('./gl/shaders/simple-texture-vertex.glsl'),
  },
};

export const dataDict = {
  fColours: fColours(),
  fNormals: fNormals(),
  fPositions: fPositions(),
  cubeBlack: cubeBlack(),
  cubeBlue: cubeBlue(),
  cubeColours: cubeColours(),
  cubeGreen: cubeGreen(),
  cubeNormals: cubeNormals(),
  cubePositions: cubePositions(),
  cubeRed: cubeRed(),
  cubeTextures: cubeTextures(),
  colouredCubeTextures: colouredCubeTextures(),
};

const blackCubeMesh: MeshConfig = {
  coloursDataName: 'cubeBlack',
  normalsDataName: 'cubeNormals',
  textureCoordDataName: 'colouredCubeTextures',
  verticiesDataName: 'cubePositions',
};

const blueCubeMesh: MeshConfig = {
  coloursDataName: 'cubeBlue',
  normalsDataName: 'cubeNormals',
  textureCoordDataName: 'colouredCubeTextures',
  verticiesDataName: 'cubePositions',
};

const greenCubeMesh: MeshConfig = {
  coloursDataName: 'cubeGreen',
  normalsDataName: 'cubeNormals',
  textureCoordDataName: 'colouredCubeTextures',
  verticiesDataName: 'cubePositions',
};

const redCubeMesh: MeshConfig = {
  coloursDataName: 'cubeRed',
  normalsDataName: 'cubeNormals',
  textureCoordDataName: 'colouredCubeTextures',
  verticiesDataName: 'cubePositions',
};

export const meshConfigs: Dictionary<MeshConfig> = {
  blackCube: blackCubeMesh,
  blueCube: blueCubeMesh,
  greenCube: greenCubeMesh,
  redCube: redCubeMesh,
};

const blackShinyMaterialColour: MaterialColourConfig = {
  ambient: [0.01, 0.01, 0.01],
  diffuse: [0.01, 0.01, 0.01],
  specular: [0.01, 0.01, 0.01],
  shiny: 32,
};

const blueShinyMaterialTexture: MaterialTextureConfig = {
  diffusePath: blueTexturePath,
  normalPath: blueTexturePath,
  specularPath: blueTexturePath,
  texturePath: blueTexturePath,
  shiny: 32,
};

const greenShinyMaterialTexture: MaterialTextureConfig = {
  diffusePath: greenTexturePath,
  normalPath: greenTexturePath,
  specularPath: greenTexturePath,
  texturePath: greenTexturePath,
  shiny: 32,
};

const redShinyMaterialColour: MaterialColourConfig = {
  ambient: [0.7, 0.01, 0.03],
  diffuse: [0.7, 0.01, 0.03],
  specular: [0.7, 0.01, 0.03],
  shiny: 32,
};

const greenDashShinyMaterialTexture: MaterialTextureConfig = {
  diffusePath: greenDashTexturePath,
  normalPath: greenDashTexturePath,
  specularPath: greenDashTexturePath,
  texturePath: greenDashTexturePath,
  shiny: 32,
};

const blueDashShinyMaterialTexture: MaterialTextureConfig = {
  diffusePath: blueDashTexturePath,
  normalPath: blueDashTexturePath,
  specularPath: blueDashTexturePath,
  texturePath: blueDashTexturePath,
  shiny: 32,
};

const redDashShinyMaterialTexture: MaterialTextureConfig = {
  diffusePath: redDashTexturePath,
  normalPath: redDashTexturePath,
  specularPath: redDashTexturePath,
  texturePath: redDashTexturePath,
  shiny: 32,
};

const cubeBlackConfig: ShapeConfig = {
  lightDirectionalConfigs: [
    {
      direction: [10, 10, -10],
    },
  ],
  material: blackShinyMaterialColour,
  mesh: blackCubeMesh,
  programName: 'simple-directional',
};

const cubeBlueConfig: ShapeConfig = {
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  material: blueShinyMaterialTexture,
  mesh: blueCubeMesh,
  programName: 'advanced-directional-simple-texture',
};

const cubeGreenConfig: ShapeConfig = {
  material: greenShinyMaterialTexture,
  mesh: greenCubeMesh,
  programName: 'simple-texture',
};

const cubeRedConfig: ShapeConfig = {
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  material: redShinyMaterialColour,
  mesh: redCubeMesh,
  programName: 'simple-dir_point_mix',
};

const cubeBlueDashConfig: ShapeConfig = {
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.9, 0.9, 0.9],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  material: blueDashShinyMaterialTexture,
  mesh: blueCubeMesh,
  programName: 'advanced-directional-simple-texture',
};

const cubeGreenDashConfig: ShapeConfig = {
  material: greenDashShinyMaterialTexture,
  mesh: greenCubeMesh,
  programName: 'simple-texture',
};

const cubeRedDashConfig: ShapeConfig = {
  material: redDashShinyMaterialTexture,
  mesh: redCubeMesh,
  programName: 'simple-texture',
};

export const sceneConfig: SceneConfig[] = [
  {
    children: [
      {
        children: [],
        name: 'the block',
        initialScale: [5000, 1, 5000],
        initialTranslation: [0, -1, 0],
        shape: cubeBlackConfig,
      },
    ],
    name: 'the void',
  },
];

export const blockConfig: Dictionary<SceneConfig> = {
  blue: {
    children: [],
    name: 'blue block',
    initialScale: [25, 25, 25],
    shape: cubeBlueConfig,
  },
  green: {
    children: [],
    name: 'green block',
    initialScale: [25, 25, 25],
    shape: cubeGreenConfig,
  },
  red: {
    children: [],
    name: 'red block',
    initialScale: [25, 25, 25],
    shape: cubeRedConfig,
  },
  blueDash: {
    children: [],
    name: 'blue block',
    initialScale: [25, 25, 25],
    shape: cubeBlueDashConfig,
  },
  greenDash: {
    children: [],
    name: 'green block',
    initialScale: [25, 25, 25],
    shape: cubeGreenDashConfig,
  },
  redDash: {
    children: [],
    name: 'red block',
    initialScale: [25, 25, 25],
    shape: cubeRedDashConfig,
  },
};

export const programConfigDict = {
  'advanced-directional-simple-texture': advancedDirectionalSimpleTextureConfig,
  'advanced-directional': advancedDirectionalConfig,
  simple: simpleConfig,
  'simple-dir_point_mix': simpleDirPointMixConfig,
  'simple-directional': simpleDirectionalConfig,
  'simple-texture': simpleTextureConfig,
};
