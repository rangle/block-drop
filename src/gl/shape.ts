import {
  Shape,
  ShapeConfig,
  DataDictionary,
  ProgramDictionary,
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
  return {
    colours: dataDict[config.coloursDataName],
    context: programDict[config.programName],
    positions: dataDict[config.positionsDataName],
    vertexCount: dataDict[config.positionsDataName].length / 3,
  };
}
