/**
@param material MaterialColour
@param normal vec3
@param viewDirection vec3
@param dirLight DirLight

@return vec3
*/
vec3 lightDir = normalize(-dirLight.direction);

float diff = max(dot(normal, lightDir), 0.0);

vec3 halfDirection = normalize(lightDir + viewDirection);
float spec = pow(max(dot(normal, halfDirection), 0.0), material.shiny);

vec3 ambient = dirLight.ambient * material.ambient;
vec3 diffuse = dirLight.diffuse * diff * material.diffuse;
vec3 specular = dirLight.specular * spec * material.specular;

return (ambient + diffuse + specular);
