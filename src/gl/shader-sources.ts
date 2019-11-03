import { Dictionary } from '@ch1/utility';
import calcDir1 from './shader-snippets/calc-dir.fragment.1.glsl';
import mainFragment1 from './shader-snippets/main.fragment.1.glsl';
import mainVertex1 from './shader-snippets/main.vertex.1.glsl';

export const shaderSources: Dictionary<string> = {
  'calc-dir.fragment.1.glsl': calcDir1,
  'main.fragment.1.glsl': mainFragment1,
  'main.vertex.1.glsl': mainVertex1,
};
