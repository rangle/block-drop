import {
  GlBindTypes,
  GlTypes,
  GlFragmentFunctionSnippets,
} from './gl/interfaces';
import { GlVertexFunctionSnippets } from './gl/interfaces';

export const vertexOnly = {
  fragmentDeclarations: [
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  fragmentFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlFragmentFunctionSnippets.Main1,
    },
  ],
  vertexDeclarations: [
    {
      bindType: GlBindTypes.Attribute,
      glType: 'FLOAT',
      name: 'a_position',
      varType: GlTypes.Vec4,
      normalize: false,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Attribute,
      glType: 'UNSIGNED_BYTE',
      name: 'a_colour',
      varType: GlTypes.Vec4,
      normalize: true,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_worldViewProjection',
      varType: GlTypes.Mat4,
    },
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  vertexFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlVertexFunctionSnippets.Main1,
    },
  ],
};

export const textureOnly = {
  fragmentDeclarations: [
    {
      bindType: GlBindTypes.Varying,
      name: 'v_texcoord',
      varType: GlTypes.Vec2,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_texture',
      varType: GlTypes.Sampler2d,
    },
  ],
  fragmentFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlFragmentFunctionSnippets.Main2,
    },
  ],
  vertexDeclarations: [
    {
      bindType: GlBindTypes.Attribute,
      glType: 'FLOAT',
      name: 'a_position',
      varType: GlTypes.Vec4,
      normalize: false,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Attribute,
      glType: 'UNSIGNED_BYTE',
      name: 'a_texcoord',
      varType: GlTypes.Vec2,
      normalize: false,
      offset: 0,
      size: 2,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_worldViewProjection',
      varType: GlTypes.Mat4,
    },
    {
      bindType: GlBindTypes.Varying,
      name: 'v_texcoord',
      varType: GlTypes.Vec2,
    },
  ],
  vertexFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlVertexFunctionSnippets.Main2,
    },
  ],
};
