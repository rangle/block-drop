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
varying vec3 v_surfaceToView;

uniform DirLight u_dirLight;
float shiny = 16.0; 

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(u_dirLight.direction + surfaceToViewDirection);

  float light = dot(normal, u_dirLight.direction);
  float spec = 0.0;
  if (light > 0.0) {
    spec = pow(dot(normal, halfVector), shiny);
  }

  vec3 ambient = u_dirLight.ambient * v_colour.rgb;
  vec3 diffuse = light * u_dirLight.diffuse * v_colour.rgb;
  vec3 specular = spec * u_dirLight.specular * v_colour.rgb;

  gl_FragColor = vec4(ambient + diffuse + specular, v_colour.a);

}
