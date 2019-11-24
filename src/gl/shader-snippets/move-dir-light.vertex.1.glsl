/**
Moves the data required for directional light
*/
${v_normal} = mat3(${u_worldInverseTranspose}) * ${a_normal};
${v_fragcoord} = vec3(${u_world} * ${a_position});
