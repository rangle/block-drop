// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec4 a_colour;

// uniforms receive data on the fly
uniform mat4 u_matrix;

// varying to pass the attribute along
varying vec4 v_colour;

// all shaders have a main function
void main() {
  gl_Position = u_matrix * a_position;

  v_colour = a_colour;
}
