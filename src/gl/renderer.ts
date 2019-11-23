import {
  Provider,
  GlProgram,
  ProgramCompilerDescription,
  ShapeLite,
  Lights,
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
  ShapeDirectionalLight,
} from '../interfaces';
import { resize } from '../initialization';
import {
  perspective4_4,
  inverse4_4,
  multiply4_4,
  createMatrix4_4,
  transpose4_4,
} from '../matrix/matrix-4';
import { createMatrix3_1, normalize3_1 } from '../matrix/matrix-3';
import { createObjectPool } from '../utility/object-pool';
import { isMaterialTexture, isMaterialColour } from './shape';
import { Camera } from './camera';

type MeshProvider = Provider<Mesh, MeshConfig>;
type MaterialProvider = Provider<
  MaterialColourConfig | MaterialTexture,
  MaterialColourConfig | MaterialTextureConfig
>;
type ProgramProvider = Provider<GlProgram, ProgramCompilerDescription>;

const defaultProgram = 'vertexOnly';
const programsWithNoConfigs = ['textureOnly', defaultProgram];

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

  lights: Lights = {
    directionals: [],
    points: [],
    spots: [],
  };

  camera = Camera.create(this.op_3_1, this.op4_4);
  shapes: ShapeLite[] = [];

  private lastMesh: Mesh | null = null;
  private lastProgram: GlProgram | null = null;

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

  render(configKey: string) {
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

    const viewMatrix = inverse4_4(this.camera.get(), this.op4_4);
    const viewProjectionMatrix = multiply4_4(
      projectionMatrix,
      viewMatrix,
      this.op4_4
    );

    this.shapes.forEach(shape => {
      this.onEachShape(shape, configKey, viewProjectionMatrix);
    });

    this.op4_4.free(viewMatrix);
    this.op4_4.free(viewProjectionMatrix);
  }

  private getAndUseProgramFromShape(shape: ShapeLite, configKey: string) {
    const programName = shape.programPreference
      ? shape.programPreference
      : defaultProgram;
    const program =
      programsWithNoConfigs.indexOf(programName) >= 0
        ? this.programProvider.get(programName)
        : this.programProvider.get(programName, configKey);
    if (!program) {
      throw new RangeError('renderer: no default program registered');
    }

    if (this.lastProgram !== program) {
      this.lastProgram = program;
      this.gl.useProgram(program.program);
    }

    return this.lastProgram;
  }

  private getAndSetMeshFromShape(shape: ShapeLite, program: GlProgram) {
    const mesh = this.meshProvider.get(shape.mesh);
    if (!mesh) {
      throw new RangeError('renderer: no mesh registered named ' + shape.mesh);
    }

    if (this.lastMesh !== mesh) {
      this.lastMesh = mesh;
      program.attributes.a_position(mesh.a_position);
      if (program.attributes.a_colour && mesh.a_colour) {
        program.attributes.a_colour(mesh.a_colour);
      }

      if (program.attributes.a_texcoord && mesh.a_texcoord) {
        program.attributes.a_texcoord(mesh.a_texcoord);
      }

      if (program.attributes.a_normal && mesh.a_normal) {
        program.attributes.a_normal(mesh.a_normal);
      }
    }

    return this.lastMesh;
  }

  private getAndSetMaterialFromShape(shape: ShapeLite, program: GlProgram) {
    if (shape.material) {
      const material = this.materialProvider.get(shape.material);
      if (!material) {
        return;
      }
      if (isMaterialTexture(material)) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, material.texture);
        program.uniforms.u_texture(0);
      }
      if (program.uniforms.u_shiny) {
        program.uniforms.u_shiny(material.shiny);
      }
    }
  }

  private setLightRequirements(shape: ShapeLite, program: GlProgram) {
    if (shape.material) {
      const material = this.materialProvider.get(shape.material);
      if (isMaterialColour(material)) {
      }
    }
    if (program.uniforms.u_worldInverseTranspose) {
      const worldInverseMatrix = inverse4_4(shape.local, this.op4_4);
      const worldInverseTransposeMatrix = transpose4_4(
        worldInverseMatrix,
        this.op4_4
      );
      program.uniforms.u_worldInverseTranspose(worldInverseTransposeMatrix);
      this.op4_4.free(worldInverseTransposeMatrix);
      this.op4_4.free(worldInverseTransposeMatrix);
    }
    if (program.uniforms.u_viewWorldPosition) {
      program.uniforms.u_viewWorldPosition(this.camera.getPosition());
    }
  }

  private setDirectionalLight(
    light: ShapeDirectionalLight,
    program: GlProgram,
    i: number
  ) {
    const prefix = `u_dirLights[${i}].`;

    const direction = `${prefix}direction`;
    if (program.uniforms[direction]) {
      program.uniforms[direction](normalize3_1(light.direction, this.op_3_1));
    }

    const ambient = `${prefix}ambient`;
    if (program.uniforms[ambient]) {
      program.uniforms[ambient](light.ambient);
    }

    const diffuse = `${prefix}diffuse`;
    if (program.uniforms[diffuse]) {
      program.uniforms[diffuse](light.diffuse);
    }

    const specular = `${prefix}specular`;
    if (program.uniforms[specular]) {
      program.uniforms[specular](light.specular);
    }
  }

  private getAndSetLights(shape: ShapeLite, program: GlProgram) {
    this.setLightRequirements(shape, program);

    this.lights.directionals.forEach((light, i) => {
      this.setDirectionalLight(light, program, i);
    });
  }

  private onEachShape(
    shape: ShapeLite,
    configKey: string,
    viewProjectionMatrix: Matrix4_4
  ) {
    const program = this.getAndUseProgramFromShape(shape, configKey);

    const mesh = this.getAndSetMeshFromShape(shape, program);

    this.getAndSetMaterialFromShape(shape, program);

    this.getAndSetLights(shape, program);

    const worldViewProjection = multiply4_4(viewProjectionMatrix, shape.local);
    program.uniforms.u_worldViewProjection(worldViewProjection);

    const primitiveType = this.gl.TRIANGLES;
    this.gl.drawArrays(primitiveType, 0, mesh.vertexCount);

    this.op4_4.free(worldViewProjection);
  }
}
