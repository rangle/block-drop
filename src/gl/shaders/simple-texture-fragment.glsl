// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;
  
void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = texture2D(u_texture, v_texcoord);
}
