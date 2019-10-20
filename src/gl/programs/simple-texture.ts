import { ProgramContextConfig } from '../../interfaces';

export const simpleTextureConfig: ProgramContextConfig = {
  attributes: [
    {
      name: 'a_texcoord',
      size: 2,
      type: 'FLOAT',
      normalize: false,
      stride: 0,
      offset: 0,
    },
    {
      name: 'a_position',
      size: 3,
      type: 'FLOAT',
      normalize: false,
      stride: 0,
      offset: 0,
    },
  ],
  shaderNames: {
    fragment: 'simple-texture',
    vertex: 'simple-texture',
  },
  uniforms: [
    {
      name: 'u_matrix',
    },
    {
      name: 'u_texture',
    },
  ],
};
