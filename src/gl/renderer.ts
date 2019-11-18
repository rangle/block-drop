import {
  Provider,
  GlProgram,
  ProgramCompilerDescription,
  ShapeLite,
} from './interfaces';
import {
  MeshConfig,
  Mesh,
  ObjectPool,
  Matrix4_4,
  Matrix3_1,
  MaterialColourConfig,
  MaterialTextureConfig,
  MaterialTexture,
} from '../interfaces';
import { resize } from '../initialization';
import {
  perspective4_4,
  lookAt4_4,
  inverse4_4,
  multiply4_4,
  createMatrix4_4,
} from '../matrix/matrix-4';
import { createMatrix3_1 } from '../matrix/matrix-3';
import { createObjectPool } from '../utility/object-pool';
import { isMaterialTexture } from './shape';

type MeshProvider = Provider<Mesh, MeshConfig>;
type MaterialProvider = Provider<
  MaterialColourConfig | MaterialTexture,
  MaterialColourConfig | MaterialTextureConfig
>;
type ProgramProvider = Provider<GlProgram, ProgramCompilerDescription>;

export class Renderer {
  static create(
    gl: WebGLRenderingContext,
    programProvider: ProgramProvider,
    meshProvider: MeshProvider,
    materialProvider: MaterialProvider,
    op_3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
  ) {
    return new Renderer(
      gl,
      programProvider,
      meshProvider,
      materialProvider,
      op_3_1,
      op4_4
    );
  }

  shapes: ShapeLite[] = [];

  cameraPosition: Matrix3_1 = [1, 300, -200];
  cameraUpDirection: Matrix3_1 = [0, 1, 0];
  cameraTarget: Matrix3_1 = [0, 1, 0];

  constructor(
    private gl: WebGLRenderingContext,
    private programProvider: ProgramProvider,
    private meshProvider: MeshProvider,
    private materialProvider: MaterialProvider,
    private op_3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    private op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
  ) {}

  debug() {
    return {
      programProvider: this.programProvider.debug(),
    };
  }

  render() {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    resize(canvas);

    // clip space to pixel space
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = perspective4_4(
      (90 * Math.PI) / 180,
      canvas.clientWidth / canvas.clientHeight,
      1,
      5000,
      this.op4_4
    );

    const cameraMatrix = lookAt4_4(
      this.cameraPosition,
      this.cameraTarget,
      this.cameraUpDirection,
      this.op4_4,
      this.op_3_1
    );

    const viewMatrix = inverse4_4(cameraMatrix, this.op4_4);
    const viewProjectionMatrix = multiply4_4(
      projectionMatrix,
      viewMatrix,
      this.op4_4
    );

    this.shapes.forEach(shape => {
      const programName = shape.programPreference
        ? shape.programPreference
        : 'default';
      const program = this.programProvider.get(programName);
      this.gl.useProgram(program.program);

      const mesh = this.meshProvider.get(shape.mesh);
      program.attributes.a_position(mesh.a_position);

      if (program.attributes.a_colour && mesh.a_colour) {
        program.attributes.a_colour(mesh.a_colour);
      }

      if (program.attributes.a_texcoord && mesh.a_texcoord) {
        program.attributes.a_texcoord(mesh.a_texcoord);
      }

      if (shape.material) {
        const material = this.materialProvider.get(shape.material);
        if (isMaterialTexture(material)) {
          this.gl.activeTexture(this.gl.TEXTURE0);
          this.gl.bindTexture(this.gl.TEXTURE_2D, material.texture);
          program.uniforms.u_texture(0);
        }
      }

      const worldViewProjection = multiply4_4(
        viewProjectionMatrix,
        shape.local
      );
      program.uniforms.u_worldViewProjection(worldViewProjection);

      const primitiveType = this.gl.TRIANGLES;
      this.gl.drawArrays(primitiveType, 0, mesh.vertexCount);

      this.op4_4.free(worldViewProjection);
    });

    this.op4_4.free(cameraMatrix);
    this.op4_4.free(viewMatrix);
    this.op4_4.free(viewProjectionMatrix);
  }
}
