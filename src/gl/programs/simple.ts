import { ProgramContextConfig } from '../../interfaces';

export const simpleConfig: ProgramContextConfig = {
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
  ],
  shaderNames: {
    fragment: 'simple',
    vertex: 'simple',
  },
  uniforms: [
    {
      name: 'u_matrix',
    },
  ],
};
