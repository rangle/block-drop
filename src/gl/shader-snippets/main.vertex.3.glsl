/**
  Directional Light Setup
  Colour Verts
*/
gl_Position = ${u_worldViewProjection} * ${a_position};
vec3 surfaceWorldPosition = (u_world * a_position).xyz;

moveColour();
moveDirLight(${u_worldInverseTranspose}, ${u_viewWorldPosition}, surfaceWorldPosition);
