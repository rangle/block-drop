import { Dictionary } from '@ch1/utility';
import {
  MaterialTextureConfig,
  MaterialColourConfig,
  MaterialColour,
  MaterialTexture,
  Provider,
} from './interfaces';
import { ImageDictionary } from '../interfaces';
import { isMaterialTextureConfig, isMaterialTexture } from './shape';

export class MaterialProvider
  implements
    Provider<
      MaterialColour | MaterialTexture,
      MaterialColourConfig | MaterialTextureConfig
    > {
  static textureConfigsAreEqual(
    a: MaterialTextureConfig,
    b: MaterialTextureConfig
  ) {
    if (a === b) {
      return true;
    }
    if (a.diffusePath !== b.diffusePath) {
      return false;
    }
    if (a.normalPath !== b.normalPath) {
      return false;
    }
    if (a.shiny !== b.shiny) {
      return false;
    }
    if (a.specularPath !== b.specularPath) {
      return false;
    }
    if (a.texturePath !== b.texturePath) {
      return false;
    }

    return true;
  }

  static create(gl: WebGLRenderingContext, imageDict: ImageDictionary) {
    return new MaterialProvider(gl, imageDict);
  }

  private configs: Dictionary<
    MaterialColourConfig | MaterialTextureConfig
  > = {};
  private materials: Dictionary<MaterialColour | MaterialTexture> = {};

  constructor(
    private gl: WebGLRenderingContext,
    private imageDict: ImageDictionary
  ) {}

  private createTexture(path: string): WebGLTexture {
    const attemptTexture = this.gl.createTexture();
    if (!attemptTexture) {
      throw new Error('MaterialProvider: could not create GL texture ' + path);
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, attemptTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.imageDict[path]
    );
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    return attemptTexture;
  }

  debug() {
    return '';
  }

  private create(materialName: string): MaterialColour | MaterialTexture {
    const config = this.configs[materialName];
    if (config === undefined) {
      throw new RangeError(
        'MaterialProvider: no config found for ' + materialName
      );
    }
    if (isMaterialTextureConfig(config)) {
      const texture = this.createTexture(config.texturePath);
      this.materials[materialName] = {
        diffuse: config.diffusePath
          ? this.createTexture(config.diffusePath)
          : texture,
        normal: config.normalPath
          ? this.createTexture(config.normalPath)
          : texture,
        specular: config.specularPath
          ? this.createTexture(config.specularPath)
          : texture,
        texture,
        shiny: config.shiny,
      };
      return this.materials[materialName];
    } else {
      this.materials[materialName] = config;
      return config;
    }
  }

  get(materialName: string) {
    if (this.materials[materialName]) {
      return this.materials[materialName];
    }
    return this.create(materialName);
  }

  register(
    materialName: string,
    config: MaterialColourConfig | MaterialTextureConfig,
    eager = false
  ) {
    const existing = this.configs[materialName];
    if (existing) {
      const existingIsTexture = isMaterialTexture(existing);
      const givenIsTexture = isMaterialTexture(config);
      if (existingIsTexture !== givenIsTexture) {
        throw new Error(
          'MaterialProvider: ' +
            materialName +
            ' differs by type from pre-registered value'
        );
      }
      if (existingIsTexture) {
        if (
          MaterialProvider.textureConfigsAreEqual(
            existing as MaterialTextureConfig,
            config as MaterialTextureConfig
          ) === false
        ) {
          throw new Error(
            'MaterialProvider: ' +
              materialName +
              ' differes by value from pre-registered value'
          );
        }
      }
      if (existingIsTexture) {
        return;
      }
      this.configs[materialName] = config;
    } else {
      this.configs[materialName] = config;
      if (eager) {
        this.create(materialName);
      }
    }
  }
}
