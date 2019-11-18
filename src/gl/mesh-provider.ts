import { MeshConfig, Mesh, DataDictionary } from '../interfaces';
import { Dictionary } from '@ch1/utility';
import { Provider } from './interfaces';

export class MeshProvider implements Provider<Mesh, MeshConfig> {
  static configsAreEqual(a: MeshConfig, b: MeshConfig) {
    if (a === b) {
      return true;
    }
    if (a.coloursDataName !== b.coloursDataName) {
      return false;
    }
    if (a.normalsDataName !== b.normalsDataName) {
      return false;
    }
    if (a.textureCoordDataName !== b.textureCoordDataName) {
      return false;
    }
    if (a.verticiesDataName !== b.verticiesDataName) {
      return false;
    }
    return true;
  }

  static create(gl: WebGLRenderingContext, dataDict: DataDictionary) {
    return new MeshProvider(gl, dataDict);
  }

  private configs: Dictionary<MeshConfig> = {};
  private meshes: Dictionary<Mesh> = {};

  constructor(
    private gl: WebGLRenderingContext,
    private dataDict: DataDictionary
  ) {}

  private getData(dataName: string): Float32Array | Uint8Array {
    if (!this.dataDict[dataName]) {
      throw new RangeError('MeshProvider: no data found for ' + dataName);
    }
    return this.dataDict[dataName];
  }

  private create(meshName: string): Mesh {
    const config = this.configs[meshName];
    if (config === undefined) {
      throw new Error('MeshProvider: no mesh registered named ' + meshName);
    }

    const a_colour = config.coloursDataName
      ? this.createAttributeBuffer(this.getData(config.coloursDataName)).buffer
      : undefined;

    const a_normal = config.normalsDataName
      ? this.createAttributeBuffer(this.getData(config.normalsDataName)).buffer
      : undefined;

    const a_texcoord = config.textureCoordDataName
      ? this.createAttributeBuffer(this.getData(config.textureCoordDataName))
          .buffer
      : undefined;

    const positionData = this.createAttributeBuffer(
      this.getData(config.verticiesDataName)
    );
    const a_position = positionData.buffer;

    const mesh: Mesh = {
      a_colour,
      a_normal,
      a_position,
      a_texcoord,
      vertexCount: positionData.data.length / 3,
    };

    this.meshes[meshName] = mesh;

    return mesh;
  }

  private createAttributeBuffer(data: Float32Array | Uint8Array) {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error('MeshProvider: unable to allocate gl buffer');
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

    return { buffer, data };
  }

  debug() {
    return '';
  }

  get(meshName: string): Mesh {
    const mesh = this.meshes[meshName];
    if (mesh) {
      return mesh;
    }
    return this.create(meshName);
  }

  register(meshName: string, meshConfig: MeshConfig, eager = false) {
    if (this.configs[meshName]) {
      if (
        MeshProvider.configsAreEqual(this.configs[meshName], meshConfig) ===
        false
      ) {
        console.warn('Overriding meshConfig ' + meshName);
      }
      this.configs[meshName] = meshConfig;
    } else {
      this.configs[meshName] = meshConfig;
      if (eager) {
        this.create(meshName);
      }
    }
  }
}
