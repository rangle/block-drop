/**
@param colour vec4
@param normal vec3
@param surfaceToViewDirection vec3
@param dirLight DirLight
@param shiny float

@return vec3
*/
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
