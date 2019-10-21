import {
  Shape,
  ShapeConfig,
  DataDictionary,
  ProgramDictionary,
  BufferMap,
  ShapeDirectionalLight,
  ImageDictionary,
  TextureDictionary,
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
    config.positionsDataName
  );

  let colours;
  if (config.coloursDataName) {
    colours = getOrCreateBuffer(
      gl,
      bufferMap,
      dataDict,
      config.coloursDataName
    );
  }

  let textures;
  if (config.texturesDataName) {
    textures = getOrCreateBuffer(
      gl,
      bufferMap,
      dataDict,
      config.texturesDataName
    );
  }

  let texture: undefined | WebGLTexture;
  if (config.texturePath) {
    if (textureDict[config.texturePath]) {
      texture = textureDict[config.texturePath];
    } else {
      const attemptTexture = gl.createTexture();
      if (!attemptTexture) {
        throw new Error('could not create texture ' + config.texturePath);
      }
      texture = attemptTexture;

      if (!imageDict[config.texturePath]) {
        throw new Error(
          'could not find image for texture ' + config.texturePath
        );
      }

      gl.bindTexture(gl.TEXTURE_2D, attemptTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageDict[config.texturePath]
      );
      gl.generateMipmap(gl.TEXTURE_2D);
      textureDict[config.texturePath] = texture;
    }
  }

  let normals;
  const lightDirectional: ShapeDirectionalLight[] = [];
  if (config.normalsDataName) {
    normals = getOrCreateBuffer(
      gl,
      bufferMap,
      dataDict,
      config.normalsDataName
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
    vertexCount: dataDict[config.positionsDataName].length / 3,
  };
}
