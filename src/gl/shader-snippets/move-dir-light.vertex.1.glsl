/**
Moves the data required for directional light
@param worldInverseTranspose Mat4
@param viewWorldPosition Vec3
@param surfaceWorldPosition Vec3
*/
${v_normal} = mat3(worldInverseTranspose) * ${a_normal};
${v_surfaceToView} = normalize(viewWorldPosition - surfaceWorldPosition);
