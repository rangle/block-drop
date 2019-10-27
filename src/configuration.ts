import { ShaderDictionary, ShapeConfig, SceneConfig } from './interfaces';
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
// const redTexturePath = require('../assets/red-2048-2048.png');
const blueDashTexturePath = require('../assets/dash-blue-2048-2048.png');
const greenDashTexturePath = require('../assets/dash-green-2048-2048.png');
const redDashTexturePath = require('../assets/dash-red-2048-2048.png');

export const shaderDict: ShaderDictionary = {
  'advanced-directional-simple-texture': {
    fragment: require('./shaders/advanced-directional-simple-texture-fragment.glsl'),
    vertex: require('./shaders/advanced-directional-simple-texture-vertex.glsl'),
  },
  'advanced-directional': {
    fragment: require('./shaders/advanced-directional-fragment.glsl'),
    vertex: require('./shaders/advanced-directional-vertex.glsl'),
  },
  simple: {
    fragment: require('./shaders/simple-fragment.glsl'),
    vertex: require('./shaders/simple-vertex.glsl'),
  },
  'simple-dir_point_mix': {
    fragment: require('./shaders/simple-dir_point_mix-fragment.glsl'),
    vertex: require('./shaders/simple-dir_point_mix-vertex.glsl'),
  },
  'simple-directional': {
    fragment: require('./shaders/simple-directional-fragment.glsl'),
    vertex: require('./shaders/simple-directional-vertex.glsl'),
  },
  'simple-texture': {
    fragment: require('./shaders/simple-texture-fragment.glsl'),
    vertex: require('./shaders/simple-texture-vertex.glsl'),
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

const cubeBlackConfig: ShapeConfig = {
  coloursDataName: 'cubeBlack',
  lightDirectionalConfigs: [
    {
      direction: [10, 10, -10],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'simple-directional',
  normalsDataName: 'cubeNormals',
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
  positionsDataName: 'cubePositions',
  programName: 'advanced-directional-simple-texture',
  normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: blueTexturePath,
};

const cubeGreenConfig: ShapeConfig = {
  // coloursDataName: 'cubeGreen',
  // lightDirectionalConfigs: [
  //   {
  //     direction: [10, 10, -10],
  //   },
  // ],
  positionsDataName: 'cubePositions',
  programName: 'simple-texture',
  // normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: greenTexturePath,
};

const cubeRedConfig: ShapeConfig = {
  coloursDataName: 'cubeRed',
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'simple-dir_point_mix',
  normalsDataName: 'cubeNormals',
  // texturesDataName: 'colouredCubeTextures',
  // texturePath: redTexturePath,
};

const cubeBlueDashConfig: ShapeConfig = {
  coloursDataName: 'cubeBlue',
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.9, 0.9, 0.9],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'advanced-directional-simple-texture',
  normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: blueDashTexturePath,
};

const cubeGreenDashConfig: ShapeConfig = {
  // coloursDataName: 'cubeGreen',
  // lightDirectionalConfigs: [
  //   {
  //     direction: [10, 10, -10],
  //   },
  // ],
  positionsDataName: 'cubePositions',
  programName: 'simple-texture',
  // normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: greenDashTexturePath,
};

const cubeRedDashConfig: ShapeConfig = {
  // coloursDataName: 'cubeRed',
  // lightDirectionalConfigs: [
  //   {
  //     direction: [10, 10, -10],
  //   },
  // ],
  positionsDataName: 'cubePositions',
  programName: 'simple-texture',
  // normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: redDashTexturePath,
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
