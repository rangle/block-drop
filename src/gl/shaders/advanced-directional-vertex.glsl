// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec4 a_colour;
attribute vec3 a_normal;

// uniforms receive data on the fly
uniform vec3 u_viewWorldPosition;
uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

// varying to pass the attribute along
varying vec4 v_colour;
varying vec3 v_normal;
varying vec3 v_surfaceToView;

// all shaders have a main function
void main() {
  gl_Position = u_matrix * a_position;
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_colour = a_colour;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_surfaceToView = normalize(u_viewWorldPosition - surfaceWorldPosition);
}
