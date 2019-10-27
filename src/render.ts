import { DrawContext, SceneGraph, Matrix4_4, Matrix3_1 } from './interfaces';
import {
  perspective4_4,
  lookAt4_4,
  inverse4_4,
  multiply4_4,
  transpose4_4,
} from './matrix/matrix-4';
import { objEach } from '@ch1/utility';
import { normalize3_1 } from './matrix/matrix-3';

export function drawLoop(context: DrawContext) {
  draw(context);
  let then = 0;
  const rotationSpeed = 1.2;

  const go = () => {
    requestAnimationFrame((now: number) => {
      const nowSeconds = now * 0.001;
      const deltaTime = nowSeconds - then;
      then = nowSeconds;
      if (context.doRedraw) {
        const newChildren: SceneGraph[] = [];
        for (let i = 0; i < context.engine.buffer.length; i += 1) {
          const el = context.engine.buffer[i];
          if (el !== 0) {
            const block = context.getBlockFromInt(context, el);
            const j =
              context.engine.config.width * context.engine.config.height - i;
            const y = 25 * Math.floor(j / context.engine.config.width) + 25;
            const x = 25 * (j % context.engine.config.width);
            block.translation[0] = x;
            block.translation[1] = y;
            newChildren.push(block);
          }
        }
        context.scene.children.forEach((child, i) => {
          if (i === 0) {
            return;
          }
          context.opScene.free(child);
        });
        context.scene.children.splice(1);
        newChildren.forEach(child => {
          child.updateLocalMatrix();
          child.setParent(context.scene);
        });
        context.sceneList = context.scene.toArray();
        context.doRedraw = false;
      }
      context.scene.rotation[1] += rotationSpeed * deltaTime;
      context.scene.updateLocalMatrix();
      context.scene.updateWorldMatrix();
      draw(context);
      go();
    });
  };
  go();
}

function draw(drawContext: DrawContext) {
  const {
    cameraPosition,
    cameraTarget,
    cameraUp,
    canvas,
    gl,
    op3_1,
    op4_4,
    resize,
    sceneList,
  } = drawContext;
  // resize/reset the viewport
  resize(gl.canvas as HTMLCanvasElement);

  // clip space to pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projectionMatrix = perspective4_4(
    (90 * Math.PI) / 180,
    canvas.clientWidth / canvas.clientHeight,
    1,
    5000,
    op4_4
  );

  const cameraMatrix = lookAt4_4(
    cameraPosition,
    cameraTarget,
    cameraUp,
    op4_4,
    op3_1
  );

  const viewMatrix = inverse4_4(cameraMatrix, op4_4);
  const viewProjectionMatrix = multiply4_4(projectionMatrix, viewMatrix, op4_4);

  sceneList.forEach(scene => {
    const { context, vertexCount } = scene.shape;
    // check/cache this
    if (drawContext.lastProgram !== context.program) {
      gl.useProgram(context.program);
      drawContext.lastProgram = context.program;
    }

    objEach(context.attributes, (attribute, name) => {
      const { location, normalize, offset, size, stride, type } = attribute;
      gl.enableVertexAttribArray(location);
      gl.bindBuffer(gl.ARRAY_BUFFER, (scene.shape as any)[name as string]);
      gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
    });

    const matrix = multiply4_4(viewProjectionMatrix, scene.worldMatrix, op4_4);
    gl.uniformMatrix4fv(context.uniforms.u_matrix.location, false, matrix);

    let worldInverseMatrix: Matrix4_4 | null = null;
    let worldInverseTransposeMatrix: Matrix4_4 | null = null;
    let normalizedDirection: Matrix3_1 | null = null;

    if (scene.shape.a_texcoord) {
      if (scene.shape.texture) {
        if (drawContext.lastTexture != scene.shape.texture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, scene.shape.texture);
          drawContext.lastTexture = scene.shape.texture;
        }
      }
      gl.uniform1i(context.uniforms.u_texture.location, 0);
    }

    if (scene.shape.a_normal) {
      worldInverseMatrix = inverse4_4(scene.worldMatrix, op4_4);
      worldInverseTransposeMatrix = transpose4_4(worldInverseMatrix, op4_4);
      gl.uniformMatrix4fv(
        context.uniforms.u_worldInverseTranspose.location,
        false,
        worldInverseTransposeMatrix
      );

      if (context.uniforms.u_viewWorldPosition) {
        gl.uniform3fv(
          context.uniforms.u_viewWorldPosition.location,
          cameraPosition
        );
      }

      if (context.uniforms.u_lightWorldPosition) {
        gl.uniform3fv(
          context.uniforms.u_lightWorldPosition.location,
          normalize3_1([-1, 1, -1], op3_1)
        );
      }

      if (context.uniforms.u_world) {
        gl.uniformMatrix4fv(
          context.uniforms.u_world.location,
          false,
          scene.worldMatrix
        );
      }

      if (scene.shape.lightDirectional.length) {
        if (context.uniforms['u_dirLight.direction']) {
          let normalizedDirection = normalize3_1(
            scene.shape.lightDirectional[0].direction,
            op3_1
          );
          gl.uniform3fv(
            context.uniforms['u_dirLight.direction'].location,
            normalizedDirection
          );
        }

        if (context.uniforms['u_dirLight.ambient']) {
          gl.uniform3fv(
            context.uniforms['u_dirLight.ambient'].location,
            scene.shape.lightDirectional[0].ambient
          );
        }

        if (context.uniforms['u_dirLight.diffuse']) {
          gl.uniform3fv(
            context.uniforms['u_dirLight.diffuse'].location,
            scene.shape.lightDirectional[0].diffuse
          );
        }

        if (context.uniforms['u_dirLight.specular']) {
          gl.uniform3fv(
            context.uniforms['u_dirLight.specular'].location,
            scene.shape.lightDirectional[0].specular
          );
        }
      }
    }

    // run the program
    const primitiveType = gl.TRIANGLES;

    gl.drawArrays(primitiveType, 0, vertexCount);

    // free scene memory
    op4_4.free(matrix);
    if (worldInverseMatrix) {
      op4_4.free(worldInverseMatrix);
    }
    if (worldInverseTransposeMatrix) {
      op4_4.free(worldInverseTransposeMatrix);
    }
    if (normalizedDirection) {
      op3_1.free(normalizedDirection);
    }
  });
  // free memory
  op4_4.free(projectionMatrix);
  op4_4.free(cameraMatrix);
  op4_4.free(viewMatrix);
  op4_4.free(viewProjectionMatrix);
}
