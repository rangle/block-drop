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
import { Dictionary } from '@ch1/utility';
import { MaterialColourConfig, MeshConfig } from './gl/interfaces';
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
const blueTexturePath = require('../assets/blue-2048-2048.png');
const greenTexturePath = require('../assets/green-2048-2048.png');
const redTexturePath = require('../assets/red-2048-2048.png');
const blueDashTexturePath = require('../assets/dash-blue-2048-2048.png');
const greenDashTexturePath = require('../assets/dash-green-2048-2048.png');
const redDashTexturePath = require('../assets/dash-red-2048-2048.png');

export const materialTexturePaths = {
  blueTexture: blueTexturePath,
  greenTexture: greenTexturePath,
  redTexture: redTexturePath,
  blueTextureDash: blueDashTexturePath,
  greenTextureDash: greenDashTexturePath,
  redTextureDash: redDashTexturePath,
};

const greenShinyMaterialColour: MaterialColourConfig = {
  ambient: [45 / 255, 201 / 255, 51 / 255],
  diffuse: [45 / 255, 201 / 255, 51 / 255],
  specular: [45 / 255, 201 / 255, 51 / 255],
  shiny: 128,
};

const blackShinyMaterialColour: MaterialColourConfig = {
  ambient: [0.01, 0.01, 0.01],
  diffuse: [0.1, 0.1, 0.1],
  specular: [0.3, 0.3, 0.3],
  shiny: 32,
};

export const materialColours = {
  blackColour: blackShinyMaterialColour,
  greenColour: greenShinyMaterialColour,
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

export const programs = [
  {
    name: 'vertexOnly',
    programConfig: vertexOnly,
    useLights: false,
  },
  {
    name: 'textureOnly',
    programConfig: textureOnly,
    useLights: false,
  },
  {
    name: 'directionalColour',
    programConfig: directionalColour,
    useLights: true,
  },
  {
    name: 'directionalTexture',
    programConfig: directionalTexture,
    useLights: true,
  },
  {
    name: 'directionalPointColour',
    programConfig: directionalPointColour,
    useLights: true,
  },
  {
    name: 'directionalPointTexture',
    programConfig: directionalPointTexture,
    useLights: true,
  },
  {
    name: 'directionalPointSpotColour',
    programConfig: directionalPointSpotColour,
    useLights: true,
  },
  {
    name: 'directionalPointSpotTexture',
    programConfig: directionalPointSpotTexture,
    useLights: true,
  },
];
