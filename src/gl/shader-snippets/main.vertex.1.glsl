void main() {
  gl_Position = ${u_worldViewProjection} * ${a_position};

  ${v_colour} = ${a_colour};
}
