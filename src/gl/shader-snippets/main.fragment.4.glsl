const float gamma = ${c_gamma};
vec3 normal = normalize(${v_normal});
vec3 viewDirection = normalize(u_viewWorldPosition - v_fragcoord);

vec4 colour = texture2D(u_material.texture, ${v_texcoord});
MaterialColour materialColour = MaterialColour(
    texture2D(u_material.texture, ${v_texcoord}).rgb,
    texture2D(u_material.diffuse, ${v_texcoord}).rgb,
    texture2D(u_material.specular, ${v_texcoord}).rgb,
    u_material.shiny
);

vec3 dirTotal = vec3(0.0, 0.0, 0.0);
for (int i = 0; i < ${c_directionalLightCount}; i += 1) {
  dirTotal += calcDir(materialColour, normal, viewDirection, ${u_dirLights}[i]);
}

dirTotal = dirTotal / (dirTotal + vec3(1.0));
dirTotal = pow(dirTotal, vec3(1.0 / gamma));

gl_FragColor = vec4(dirTotal, colour.a);
