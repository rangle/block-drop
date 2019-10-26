import { ProgramContextConfig } from '../../interfaces';

export const simpleDirPointMixConfig: ProgramContextConfig = {
  attributes: [
    {
      name: 'a_colour',
      size: 3,
      type: 'UNSIGNED_BYTE',
      normalize: true,
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
    fragment: 'simple-dir_point_mix',
    vertex: 'simple-dir_point_mix',
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
      name: 'u_dirLight.direction',
    },
    {
      name: 'u_dirLight.ambient',
    },
    {
      name: 'u_dirLight.diffuse',
    },
    {
      name: 'u_dirLight.specular',
    },
    {
      name: 'u_lightWorldPosition',
    },
  ],
};
