import {
  MaterialTextureConfig,
  MaterialColour,
  MaterialTexture,
} from './interfaces';

// function isMaterialColourConfig(thing: any): thing is MaterialColourConfig {
//   if (thing.ambient) {
//     return true;
//   }
//   return false;
// }

export function isMaterialTextureConfig(
  thing: any
): thing is MaterialTextureConfig {
  if (thing.texturePath) {
    return true;
  }
  return false;
}

export function isMaterialColour(thing: any): thing is MaterialColour {
  if (thing.diffuse) {
    if (!thing.normal) {
      return true;
    }
  }
  return false;
}

export function isMaterialTexture(thing: any): thing is MaterialTexture {
  if (thing.diffuse) {
    if (thing.normal) {
      return true;
    }
  }
  return false;
}
