// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec4 a_colour;
attribute vec3 a_normal;

// uniforms receive data on the fly
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

// varying to pass the attribute along
varying vec4 v_colour;
varying vec3 v_normal;

// all shaders have a main function
void main() {
  gl_Position = u_matrix * a_position;

  v_colour = a_colour;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
