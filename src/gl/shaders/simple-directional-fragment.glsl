// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

struct DirLight {
  vec3 direction;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

varying vec4 v_colour;
varying vec3 v_normal;

uniform DirLight u_dirLight[${directionalLightCount}];
  
void main() {
  vec3 normal = normalize(v_normal);

  float light = 0.0;
  for (int i = 0; i < ${directionalLightCount}; i += 1) {
    light += dot(normal, u_dirLight[i].direction);
  }
  gl_FragColor = v_colour;
  gl_FragColor.rgb *= light;
}
