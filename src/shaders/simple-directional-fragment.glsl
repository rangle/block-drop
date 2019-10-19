// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

struct DirLight {
  vec3 direction;
};

varying vec4 v_colour;
varying vec3 v_normal;

uniform DirLight u_dirLight;
  
void main() {
  vec3 normal = normalize(v_normal);

  float light = dot(normal, u_dirLight.direction);
  gl_FragColor = v_colour;
  gl_FragColor.rgb *= light;
}
