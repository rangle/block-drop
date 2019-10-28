import { ProgramContextConfig } from '../../interfaces';

export const advancedDirectionalSimpleTextureConfig: ProgramContextConfig = {
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
    {
      name: 'a_normal',
      size: 3,
      type: 'FLOAT',
      normalize: false,
      stride: 0,
      offset: 0,
    },
  ],
  shaderNames: {
    fragment: 'advanced-directional-simple-texture',
    vertex: 'advanced-directional-simple-texture',
  },
  uniforms: [
    {
      name: 'u_matrix',
    },
    {
      name: 'u_world',
    },
    {
      name: 'u_viewWorldPosition',
    },
    {
      name: 'u_worldInverseTranspose',
    },
    {
      name: 'u_dirLight[0].direction',
    },
    {
      name: 'u_dirLight[0].ambient',
    },
    {
      name: 'u_dirLight[0].diffuse',
    },
    {
      name: 'u_dirLight[0].specular',
    },
    {
      name: 'u_texture',
    },
  ],
};
