import {
  Shape,
  ShapeConfig,
  DataDictionary,
  ProgramDictionary,
  BufferMap,
  ShapeDirectionalLight,
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
  const colours = getOrCreateBuffer(
    gl,
    bufferMap,
    dataDict,
    config.coloursDataName
  );

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
    context: programDict[config.programName],
    lightDirectional,
    a_normal: normals,
    a_position: positions,
    vertexCount: dataDict[config.positionsDataName].length / 3,
  };
}
