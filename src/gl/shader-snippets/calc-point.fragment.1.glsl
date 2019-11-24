/**
@param material MaterialColour
@param normal vec3
@param viewDirection vec3
@param pointLight PointLight

@return vec3
*/
vec3 lightDir = normalize(pointLight.position - ${v_fragcoord});

float diff = max(dot(normal, lightDir), 0.0);

vec3 reflectDir = reflect(-lightDir, normal);
float spec = pow(max(dot(viewDirection, reflectDir), 0.0), material.shiny);

float distance = length(pointLight.position - ${v_fragcoord});
float attenuation = 1.0 / (pointLight.constant + pointLight.linear * distance + pointLight.quadratic * (distance * distance));    

vec3 ambient = pointLight.ambient * material.diffuse;
vec3 diffuse = pointLight.diffuse * diff * material.diffuse;
vec3 specular = pointLight.specular * spec * material.specular;

ambient *= attenuation;
diffuse *= attenuation;
specular *= attenuation;

return (ambient + diffuse + specular);
