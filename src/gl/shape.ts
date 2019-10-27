import {
  Shape,
  ShapeConfig,
  DataDictionary,
  ProgramDictionary,
  BufferMap,
  ShapeDirectionalLight,
  ImageDictionary,
  TextureDictionary,
  MaterialTextureConfig,
} from '../interfaces';

function getOrCreateBuffer(
  gl: WebGLRenderingContext,
  bufferMap: BufferMap,
  dataDict: DataDictionary,
  name: string
) {
  if (!dataDict[name]) {
    throw new Error('could not find data for ' + name);
  }

  const foundValue = bufferMap.get(dataDict[name]);
  if (!foundValue) {
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error('could not make buffer for ' + name);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, dataDict[name], gl.STATIC_DRAW);
    bufferMap.set(dataDict[name], buffer);
    return buffer;
  } else {
    return foundValue;
  }
}

export function shapeConfigToShape(
  dataDict: DataDictionary,
  programDict: ProgramDictionary,
  imageDict: ImageDictionary,
  textureDict: TextureDictionary,
  bufferMap: BufferMap,
  gl: WebGLRenderingContext,
  config: ShapeConfig
): Shape {
  if (!programDict[config.programName]) {
    throw new Error('could not find program for ' + config.programName);
  }

  const positions = getOrCreateBuffer(
    gl,
    bufferMap,
    dataDict,
    config.mesh.verticiesDataName
  );

  let colours;
  if (config.mesh.coloursDataName) {
    colours = getOrCreateBuffer(
      gl,
      bufferMap,
      dataDict,
      config.mesh.coloursDataName
    );
  }

  let textures;
  let texture: undefined | WebGLTexture;
  if (isMaterialTextureConfig(config.material)) {
    textures = getOrCreateBuffer(
      gl,
      bufferMap,
      dataDict,
      config.mesh.textureCoordDataName
    );

    if (textureDict[config.material.texturePath]) {
      texture = textureDict[config.material.texturePath];
    } else {
      const attemptTexture = gl.createTexture();
      if (!attemptTexture) {
        throw new Error(
          'could not create texture ' + config.material.texturePath
        );
      }
      texture = attemptTexture;

      if (!imageDict[config.material.texturePath]) {
        throw new Error(
          'could not find image for texture ' + config.material.texturePath
        );
      }

      gl.bindTexture(gl.TEXTURE_2D, attemptTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageDict[config.material.texturePath]
      );
      gl.generateMipmap(gl.TEXTURE_2D);
      textureDict[config.material.texturePath] = texture;
    }
  }

  let normals;
  const lightDirectional: ShapeDirectionalLight[] = [];
  if (config.mesh.normalsDataName) {
    normals = getOrCreateBuffer(
      gl,
      bufferMap,
      dataDict,
      config.mesh.normalsDataName
    );
    if (config.lightDirectionalConfigs) {
      config.lightDirectionalConfigs.forEach(ldConfig => {
        lightDirectional.push({
          direction: ldConfig.direction,
          ambient: ldConfig.ambient || [1, 1, 1],
          diffuse: ldConfig.diffuse || [1, 1, 1],
          specular: ldConfig.specular || [1, 1, 1],
        });
      });
    }
  }

  return {
    a_colour: colours,
    a_normal: normals,
    a_position: positions,
    a_texcoord: textures,
    context: programDict[config.programName],
    lightDirectional,
    texture,
    vertexCount: dataDict[config.mesh.verticiesDataName].length / 3,
  };
}

// function isMaterialColourConfig(thing: any): thing is MaterialColourConfig {
//   if (thing.ambient) {
//     return true;
//   }
//   return false;
// }

function isMaterialTextureConfig(thing: any): thing is MaterialTextureConfig {
  if (thing.texturePath) {
    return true;
  }
  return false;
}
