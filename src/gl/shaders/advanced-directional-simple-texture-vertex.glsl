// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

// uniforms receive data on the fly
uniform vec3 u_viewWorldPosition;
uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

// varying to pass the attribute along
varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_surfaceToView;

// all shaders have a main function
void main() {
  gl_Position = u_matrix * a_position;
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_texcoord = a_texcoord;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_surfaceToView = normalize(u_viewWorldPosition - surfaceWorldPosition);
}
