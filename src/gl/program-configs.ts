import {
  GlBindTypes,
  GlTypes,
  GlFragmentFunctionSnippets,
  ProgramCompilerDescription,
  GlFunctionDescription,
  Declaration,
} from './interfaces';
import { GlVertexFunctionSnippets } from './interfaces';

const vColour = {
  bindType: GlBindTypes.Varying,
  name: 'v_colour',
  varType: GlTypes.Vec4,
};

const vNormal = {
  bindType: GlBindTypes.Varying,
  name: 'v_normal',
  varType: GlTypes.Vec3,
};

const vSurfaceToView = {
  bindType: GlBindTypes.Varying,
  name: 'v_surfaceToView',
  varType: GlTypes.Vec3,
};

const aPosition = {
  bindType: GlBindTypes.Attribute,
  glType: 'FLOAT',
  name: 'a_position',
  varType: GlTypes.Vec4,
  normalize: false,
  offset: 0,
  size: 3,
  stride: 0,
};

const aNormal = {
  bindType: GlBindTypes.Attribute,
  glType: 'FLOAT',
  name: 'a_normal',
  varType: GlTypes.Vec3,
  normalize: false,
  offset: 0,
  size: 3,
  stride: 0,
};

const aColour = {
  bindType: GlBindTypes.Attribute,
  glType: 'UNSIGNED_BYTE',
  name: 'a_colour',
  varType: GlTypes.Vec4,
  normalize: true,
  offset: 0,
  size: 3,
  stride: 0,
};

const vTexCoord = {
  bindType: GlBindTypes.Varying,
  name: 'v_texcoord',
  varType: GlTypes.Vec2,
};

const DirLight: Declaration = {
  bindType: GlBindTypes.Uniform,
  length: [
    createVec3u('direction'),
    createVec3u('ambient'),
    createVec3u('diffuse'),
    createVec3u('specular'),
  ],
  name: 'DirLight',
  varType: GlTypes.StructDeclaration,
};

const uDirLights = {
  bindType: GlBindTypes.Uniform,
  length: 1,
  name: 'u_dirLight_dirLights',
  varType: GlTypes.Struct,
};

const uWorldViewProjection = {
  bindType: GlBindTypes.Uniform,
  name: 'u_worldViewProjection',
  varType: GlTypes.Mat4,
};

const uWorld = {
  bindType: GlBindTypes.Uniform,
  name: 'u_world',
  varType: GlTypes.Mat4,
};

const uWorldInverseTranspose = {
  bindType: GlBindTypes.Uniform,
  name: 'u_worldInverseTranspose',
  varType: GlTypes.Mat4,
};

const uViewWorldPosition = createVec3u('u_viewWorldPosition');

const uTexture = {
  bindType: GlBindTypes.Uniform,
  name: 'u_texture',
  varType: GlTypes.Sampler2d,
};

const aTexCoord = {
  bindType: GlBindTypes.Attribute,
  glType: 'FLOAT',
  name: 'a_texcoord',
  varType: GlTypes.Vec2,
  normalize: false,
  offset: 0,
  size: 2,
  stride: 0,
};

const moveColour = {
  declarations: [],
  name: 'moveColour',
  returnType: GlTypes.Void,
  snippet: GlVertexFunctionSnippets.MoveColour,
};

const moveTexture = {
  declarations: [],
  name: 'moveTexture',
  returnType: GlTypes.Void,
  snippet: GlVertexFunctionSnippets.MoveTexture,
};

const moveDirLight = {
  declarations: [
    {
      ...uWorldInverseTranspose,
      name: 'worldInverseTranspose',
    },
    {
      ...uViewWorldPosition,
      name: 'viewWorldPosition',
    },
    {
      name: 'surfaceWorldPosition',
      varType: GlTypes.Vec3,
    },
  ],
  name: 'moveDirLight',
  returnType: GlTypes.Void,
  snippet: GlVertexFunctionSnippets.MoveDirLight,
};

const calcDir: GlFunctionDescription<GlFragmentFunctionSnippets> = {
  declarations: [
    {
      name: 'colour',
      varType: GlTypes.Vec4,
    },
    {
      name: 'normal',
      varType: GlTypes.Vec3,
    },
    {
      name: 'surfaceToViewDirection',
      varType: GlTypes.Vec3,
    },
    {
      name: 'dirLight_dirLight',
      varType: GlTypes.Struct,
    },
    {
      name: 'shiny',
      varType: GlTypes.Float,
    },
  ],
  name: 'calcDir',
  returnType: GlTypes.Vec3,
  snippet: GlFragmentFunctionSnippets.CalcDirFragment1,
};

export const vertexOnly: ProgramCompilerDescription = {
  fragmentDeclarations: [vColour],
  fragmentFunctions: [createMain(GlFragmentFunctionSnippets.Main1)],
  vertexDeclarations: [aPosition, aColour, uWorldViewProjection, vColour],
  vertexFunctions: [createMain(GlVertexFunctionSnippets.Main1)],
};

export const textureOnly: ProgramCompilerDescription = {
  fragmentDeclarations: [vTexCoord, uTexture],
  fragmentFunctions: [createMain(GlFragmentFunctionSnippets.Main2)],
  vertexDeclarations: [aPosition, aTexCoord, uWorldViewProjection, vTexCoord],
  vertexFunctions: [createMain(GlVertexFunctionSnippets.Main2)],
};

export const directionalColour: ProgramCompilerDescription = {
  fragmentDeclarations: [
    DirLight,
    uDirLights,
    vColour,
    vNormal,
    vSurfaceToView,
  ],
  fragmentFunctions: [calcDir, createMain(GlFragmentFunctionSnippets.Main3)],
  vertexDeclarations: [
    aPosition,
    aColour,
    aNormal,
    uViewWorldPosition,
    uWorld,
    uWorldInverseTranspose,
    uWorldViewProjection,
    vColour,
    vNormal,
    vSurfaceToView,
  ],
  vertexFunctions: [
    createMain(GlVertexFunctionSnippets.Main3),
    moveColour,
    moveDirLight,
  ],
};

export const directionalTexture: ProgramCompilerDescription = {
  fragmentDeclarations: [
    DirLight,
    uDirLights,
    uTexture,
    vNormal,
    vTexCoord,
    vSurfaceToView,
  ],
  fragmentFunctions: [calcDir, createMain(GlFragmentFunctionSnippets.Main4)],
  vertexDeclarations: [
    aPosition,
    aTexCoord,
    aNormal,
    uViewWorldPosition,
    uWorld,
    uWorldInverseTranspose,
    uWorldViewProjection,
    vNormal,
    vTexCoord,
    vSurfaceToView,
  ],
  vertexFunctions: [
    createMain(GlVertexFunctionSnippets.Main4),
    moveTexture,
    moveDirLight,
  ],
};

function createMain<
  T extends GlFragmentFunctionSnippets | GlVertexFunctionSnippets
>(snippet: T): GlFunctionDescription<T> {
  return {
    declarations: [],
    name: 'main',
    returnType: GlTypes.Void,
    snippet: snippet,
  };
}

function createVec3u(name: string) {
  return {
    bindType: GlBindTypes.Uniform,
    name,
    varType: GlTypes.Vec3,
  };
}
