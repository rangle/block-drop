vec3 normal = normalize(${v_normal});
vec3 surfaceToViewDirection = normalize(${v_surfaceToView});

vec3 dirTotal = vec3(0.0, 0.0, 0.0);
vec4 colour = texture2D(u_material.texture, ${v_texcoord});
MaterialColour materialColour = MaterialColour(
    texture2D(u_material.texture, ${v_texcoord}).rgb,
    texture2D(u_material.diffuse, ${v_texcoord}).rgb,
    texture2D(u_material.specular, ${v_texcoord}).rgb,
    u_material.shiny
);
for (int i = 0; i < ${c_directionalLightCount}; i += 1) {
  dirTotal += calcDir(materialColour, normal, surfaceToViewDirection, ${u_dirLights}[i]);
}

gl_FragColor = vec4(dirTotal, colour.a);
