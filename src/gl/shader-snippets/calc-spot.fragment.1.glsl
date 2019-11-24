/**
@param material MaterialColour
@param normal vec3
@param viewDirection vec3
@param spotLight SpotLight

@return vec3
*/

vec3 lightDirection = normalize(spotLight.position - v_fragcoord);

float diff = max(dot(normal, lightDirection), 0.0);

vec3 reflectDir = reflect(-lightDirection, normal);
float spec = pow(max(dot(viewDirection, reflectDir), 0.0), material.shiny);

float distance = length(spotLight.position - v_fragcoord);
float attenuation = 1.0 / (spotLight.constant + spotLight.linear * distance + spotLight.quadratic * (distance * distance));    

float theta = dot(lightDirection, normalize(-spotLight.direction)); 
float epsilon = spotLight.cutOff - spotLight.outerCutOff;
float intensity = clamp((theta - spotLight.outerCutOff) / epsilon, 0.0, 1.0);

vec3 ambient = spotLight.ambient * material.diffuse;
vec3 diffuse = spotLight.diffuse * diff * material.diffuse;
vec3 specular = spotLight.specular * spec * material.specular;

ambient *= attenuation * intensity;
diffuse *= attenuation * intensity;
specular *= attenuation * intensity;

return (ambient + diffuse + specular);