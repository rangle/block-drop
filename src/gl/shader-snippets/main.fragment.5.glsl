const float gamma = ${c_gamma};
vec3 normal = normalize(${v_normal});
vec3 viewDirection = normalize(u_viewWorldPosition - v_fragcoord);

vec3 dirTotal = vec3(0.0, 0.0, 0.0);
for (int i = 0; i < ${c_directionalLightCount}; i += 1) {
  dirTotal += calcDir(u_material, normal, viewDirection, ${u_dirLights}[i]);
}
for (int i = 0; i < ${c_pointLightCount}; i += 1) {
  dirTotal += calcPoint(u_material, normal, viewDirection, ${u_pointLights}[i]);
}

dirTotal = dirTotal / (dirTotal + vec3(1.0));
dirTotal = pow(dirTotal, vec3(1.0 / gamma));

gl_FragColor = vec4(dirTotal, v_colour.a);
