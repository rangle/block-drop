// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

struct DirLight {
  vec3 direction;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_surfaceToView;

uniform sampler2D u_texture;
uniform DirLight u_dirLight;
float shiny = 16.0; 


void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(u_dirLight.direction + surfaceToViewDirection);
  vec4 colour = texture2D(u_texture, v_texcoord);

  float light = dot(normal, u_dirLight.direction);
  float spec = 0.0;
  if (light > 0.0) {
    spec = pow(dot(normal, halfVector), shiny);
  }

  vec3 ambient = u_dirLight.ambient * colour.rgb;
  vec3 diffuse = light * u_dirLight.diffuse * colour.rgb;
  vec3 specular = spec * u_dirLight.specular * colour.rgb;

  gl_FragColor = vec4(ambient + diffuse + specular, colour.a);

}
