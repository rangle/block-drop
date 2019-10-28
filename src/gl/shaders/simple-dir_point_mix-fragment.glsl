// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

struct DirLight {
  vec3 direction;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

// struct PointLight {
//   vec3 position;
  
//   float constant;
//   float linear;
//   float quadratic;

//   vec3 ambient;
//   vec3 diffuse;
//   vec3 specular;
// };

varying vec4 v_colour;
varying vec3 v_normal;
varying vec3 v_surfaceToView;
varying vec3 v_surfaceToLight;

uniform DirLight u_dirLight[${directionalLightCount}];
float shiny = 16.0; 

vec3 calcDir(vec4 colour, vec3 normal, vec3 surfaceToViewDirection, DirLight dirLight);
vec4 calcPoint(vec4 colour, vec3 normal, vec3 surfaceToViewDirection);

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  vec3 dirTotal = vec3(0.0, 0.0, 0.0);
  for (int i = 0; i < ${directionalLightCount}; i += 1) {
    dirTotal += calcDir(v_colour, normal, surfaceToViewDirection, u_dirLight[i]);
  }
  vec4 pointTotal = calcPoint(v_colour, normal, surfaceToViewDirection); 

  gl_FragColor = vec4(dirTotal, v_colour.a) + pointTotal;
}

vec4 calcPoint(vec4 colour, vec3 normal, vec3 surfaceToViewDirection) {
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float pointDot = dot(normal, surfaceToLightDirection);
  vec3 pointColour = pointDot * colour.rgb;

  float specular = 0.0;
  if (pointDot > 0.0) {
    specular = pow(dot(normal, halfVector), shiny);
  }

  return vec4(pointColour + specular, colour.a);
}

vec3 calcDir(vec4 colour, vec3 normal, vec3 surfaceToViewDirection, DirLight dirLight) {
  vec3 halfVector = normalize(dirLight.direction + surfaceToViewDirection);

  float light = dot(normal, dirLight.direction);
  float spec = 0.0;
  if (light > 0.0) {
    spec = pow(dot(normal, halfVector), shiny);
  }

  vec3 ambient = dirLight.ambient * colour.rgb;
  vec3 diffuse = light * dirLight.diffuse * colour.rgb;
  vec3 specular = spec * dirLight.specular * colour.rgb;

  return ambient + diffuse + specular;
}
