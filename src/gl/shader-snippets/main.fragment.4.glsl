vec3 normal = normalize(${v_normal});
vec3 surfaceToViewDirection = normalize(${v_surfaceToView});

vec3 dirTotal = vec3(0.0, 0.0, 0.0);
vec4 colour = texture2D(${u_texture}, ${v_texcoord});
for (int i = 0; i < ${c_directionalLightCount}; i += 1) {
  dirTotal += calcDir(colour, normal, surfaceToViewDirection, ${u_dirLights}[i], u_shiny);
}

gl_FragColor = vec4(dirTotal, colour.a);
