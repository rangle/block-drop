vec3 normal = normalize(${v_normal});
vec3 viewDirection = normalize(u_viewWorldPosition - v_fragcoord);

vec3 dirTotal = vec3(0.0, 0.0, 0.0);
for (int i = 0; i < ${c_directionalLightCount}; i += 1) {
  dirTotal += calcDir(u_material, normal, viewDirection, ${u_dirLights}[i]);
}

gl_FragColor = vec4(dirTotal, ${v_colour}.a);
