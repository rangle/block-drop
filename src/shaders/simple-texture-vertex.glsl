// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec2 a_texcoord;

// uniforms receive data on the fly
uniform mat4 u_matrix;

// varying to pass the attribute along
varying vec2 v_texcoord;

// all shaders have a main function
void main() {
  gl_Position = u_matrix * a_position;

  v_texcoord = a_texcoord;
}
