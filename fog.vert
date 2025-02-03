#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 texCoord;
varying vec4 vertColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    vec4 position = uModelViewMatrix * vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * position;
    texCoord = aTexCoord;
    vertColor = vec4(1.0, 1.0, 1.0, 1.0);
}
