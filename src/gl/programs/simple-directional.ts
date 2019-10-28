import { ProgramContextConfig } from '../../interfaces';

export const simpleDirectionalConfig: ProgramContextConfig = {
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
    fragment: 'simple-directional',
    vertex: 'simple-directional',
  },
  uniforms: [
    {
      name: 'u_matrix',
    },
    {
      name: 'u_dirLight[0].direction',
    },
    {
      name: 'u_worldInverseTranspose',
    },
  ],
};
