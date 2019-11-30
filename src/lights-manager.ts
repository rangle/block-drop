import { Dictionary } from '@ch1/utility';
import { ProgramProvider } from './gl/program-provider';
import {
  Lights,
  ShapeDirectionalLight,
  ShapePointLight,
  ShapeSpotLight,
} from './gl/interfaces';

export class LightsManager {
  static create(programProvider: ProgramProvider, lights: Lights, gamma = 2.2) {
    return new LightsManager(programProvider, lights, gamma);
  }

  private readonly lightsInit: {
    readonly directionals: number;
    readonly points: number;
    readonly spots: number;
  };

  private programs: Dictionary<string> = {};

  constructor(
    private programProvider: ProgramProvider,
    private lights: Lights,
    private gamma = 2.2
  ) {
    this.lightsInit = {
      directionals: lights.directionals.length,
      points: lights.points.length,
      spots: lights.spots.length,
    };
  }

  addDirectional(light: ShapeDirectionalLight) {
    return this.lights.directionals.push(light) - 1;
  }

  addPoint(light: ShapePointLight) {
    return this.lights.points.push(light) - 1;
  }

  addSpot(light: ShapeSpotLight) {
    return this.lights.spots.push(light) - 1;
  }

  getKey(name: string): string {
    const directionalCount = this.lights.directionals.length;
    const pointCount = this.lights.points.length;
    const spotCount = this.lights.spots.length;

    const prop = `${name}.${directionalCount}.${pointCount}.${spotCount}`;
    if (this.programs[prop]) {
      return this.programs[prop];
    }
    const values = {
      c_directionalLightCount: directionalCount + '',
      c_gamma: this.gamma + '',
      c_pointLightCount: pointCount + '',
      c_spotLightCount: spotCount + '',
    };
    const key = JSON.stringify(values);
    this.programs[prop] = key;
    this.programProvider.initialize(name, values, key);
    return key;
  }

  getLights() {
    return this.lights;
  }

  resetLights() {
    this.lights.directionals = this.lights.directionals.slice(
      0,
      this.lightsInit.directionals
    );
    this.lights.points = this.lights.points.slice(0, this.lightsInit.points);
    this.lights.spots = this.lights.spots.slice(0, this.lightsInit.spots);
  }
}
