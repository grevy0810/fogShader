attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_worldView;
uniform mat4 u_projection;

varying vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection * u_worldView * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}