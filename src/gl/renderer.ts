import {
  GlProgram,
  MaterialColourConfig,
  MaterialTextureConfig,
  MaterialTexture,
  MeshConfig,
  Mesh,
  Provider,
  ProgramCompilerDescription,
  ShapeDirectionalLight,
  ShapeLite,
  ShapePointLight,
  Lights,
  ShapeSpotLight,
} from './interfaces';
import { ObjectPool, Matrix4_4, Matrix3_1 } from '../interfaces';
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
    this.op4_4.free(projectionMatrix);
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
      this.gl.useProgram(program.program);
    }

    return program;
  }

  private getAndSetMeshFromShape(shape: ShapeLite, program: GlProgram) {
    const mesh = this.meshProvider.get(shape.mesh);
    if (!mesh) {
      throw new RangeError('renderer: no mesh registered named ' + shape.mesh);
    }

    if (this.lastMesh !== mesh || this.lastProgram !== program) {
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

    return mesh;
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
        program.uniforms['u_material.texture'](0);
        program.uniforms['u_material.diffuse'](0);
        program.uniforms['u_material.specular'](0);
      } else {
        program.uniforms['u_material.ambient'](material.ambient);
        program.uniforms['u_material.diffuse'](material.diffuse);
        program.uniforms['u_material.specular'](material.specular);
      }
      program.uniforms['u_material.shiny'](material.shiny);
    } else {
      if (program.uniforms['u_material.ambient']) {
        program.uniforms['u_material.ambient']([1, 1, 1]);
      }
      if (program.uniforms['u_material.diffuse']) {
        program.uniforms['u_material.diffuse']([1, 1, 1]);
      }
      if (program.uniforms['u_material.specular']) {
        program.uniforms['u_material.specular']([1, 1, 1]);
      }
      if (program.uniforms['u_material.shiny']) {
        program.uniforms['u_material.shiny'](32);
      }
    }
  }

  private setLightRequirements(shape: ShapeLite, program: GlProgram) {
    if (shape.material) {
      const material = this.materialProvider.get(shape.material);
      if (isMaterialColour(material)) {
      }
    }
    if (program.uniforms.u_world) {
      program.uniforms.u_world(shape.local);
    }
    if (program.uniforms.u_worldInverseTranspose) {
      const worldInverseMatrix = inverse4_4(shape.local, this.op4_4);
      const worldInverseTransposeMatrix = transpose4_4(
        worldInverseMatrix,
        this.op4_4
      );
      program.uniforms.u_worldInverseTranspose(worldInverseTransposeMatrix);
      this.op4_4.free(worldInverseMatrix);
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

  private setPointLight(light: ShapePointLight, program: GlProgram, i: number) {
    const prefix = `u_pointLights[${i}].`;

    const position = `${prefix}position`;
    if (program.uniforms[position]) {
      program.uniforms[position](light.position);
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

    const constant = `${prefix}constant`;
    if (program.uniforms[constant]) {
      program.uniforms[constant](light.constant);
    }

    const linear = `${prefix}linear`;
    if (program.uniforms[linear]) {
      program.uniforms[linear](light.linear);
    }

    const quadratic = `${prefix}quadratic`;
    if (program.uniforms[quadratic]) {
      program.uniforms[quadratic](light.quadratic);
    }
  }

  private setSpotLight(light: ShapeSpotLight, program: GlProgram, i: number) {
    const prefix = `u_spotLights[${i}].`;

    const direction = `${prefix}direction`;
    if (program.uniforms[direction]) {
      program.uniforms[direction](light.direction);
    }

    const position = `${prefix}position`;
    if (program.uniforms[position]) {
      program.uniforms[position](light.position);
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

    const constant = `${prefix}constant`;
    if (program.uniforms[constant]) {
      program.uniforms[constant](light.constant);
    }

    const linear = `${prefix}linear`;
    if (program.uniforms[linear]) {
      program.uniforms[linear](light.linear);
    }

    const quadratic = `${prefix}quadratic`;
    if (program.uniforms[quadratic]) {
      program.uniforms[quadratic](light.quadratic);
    }

    const cutOff = `${prefix}cutOff`;
    if (program.uniforms[cutOff]) {
      program.uniforms[cutOff](light.cutOff);
    }

    const outerCutOff = `${prefix}outerCutOff`;
    if (program.uniforms[outerCutOff]) {
      program.uniforms[outerCutOff](light.outerCutOff);
    }
  }

  private getAndSetLights(shape: ShapeLite, program: GlProgram) {
    this.setLightRequirements(shape, program);

    this.lights.directionals.forEach((light, i) => {
      this.setDirectionalLight(light, program, i);
    });

    this.lights.points.forEach((light, i) => {
      this.setPointLight(light, program, i);
    });

    this.lights.spots.forEach((light, i) => {
      this.setSpotLight(light, program, i);
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

    const worldViewProjection = multiply4_4(
      viewProjectionMatrix,
      shape.local,
      this.op4_4
    );
    program.uniforms.u_worldViewProjection(worldViewProjection);

    this.lastProgram = program;
    this.lastMesh = mesh;

    const primitiveType = this.gl.TRIANGLES;
    this.gl.drawArrays(primitiveType, 0, mesh.vertexCount);

    this.op4_4.free(worldViewProjection);
  }
}
