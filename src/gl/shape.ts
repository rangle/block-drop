import {
  Shape,
  ShapeConfig,
  DataDictionary,
  ProgramDictionary,
  Matrix3_1,
} from '../interfaces';

export function shapeConfigToShape(
  dataDict: DataDictionary,
  programDict: ProgramDictionary,
  config: ShapeConfig
): Shape {
  if (!dataDict[config.positionsDataName]) {
    throw new Error(
      'could not find position data for ' + config.positionsDataName
    );
  }
  if (!dataDict[config.coloursDataName]) {
    throw new Error('could not find colour data for ' + config.coloursDataName);
  }
  if (!programDict[config.programName]) {
    throw new Error('could not find program for ' + config.programName);
  }

  let normals;
  let lightDirection: Matrix3_1 = [10, 10, -10];
  if (config.normalsDataName) {
    if (!dataDict[config.normalsDataName]) {
      throw new Error('could not find normals for ' + config.normalsDataName);
    }
    normals = dataDict[config.normalsDataName];
    if (config.lightDirection) {
      lightDirection = config.lightDirection;
    }
  }

  return {
    colours: dataDict[config.coloursDataName],
    context: programDict[config.programName],
    lightDirection,
    normals,
    positions: dataDict[config.positionsDataName],
    vertexCount: dataDict[config.positionsDataName].length / 3,
  };
}
