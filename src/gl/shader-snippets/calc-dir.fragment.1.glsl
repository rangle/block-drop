/**
@param material MaterialColour
@param normal vec3
@param surfaceToViewDirection vec3
@param dirLight DirLight

@return vec3
*/
vec3 halfVector = normalize(dirLight.direction + surfaceToViewDirection);

float light = dot(normal, dirLight.direction);
float spec = 0.0;
if (light > 0.0) {
  spec = pow(dot(normal, halfVector), material.shiny);
}

vec3 ambient = dirLight.ambient * material.ambient.rgb;
vec3 diffuse = light * dirLight.diffuse * material.diffuse.rgb;
vec3 specular = spec * dirLight.specular * material.specular.rgb;

return ambient + diffuse + specular;
