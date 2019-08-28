attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying vec4 vVertexColor;

void main(void) {
  vec4 worldVertexPos = uMVMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * worldVertexPos;

  vVertexColor = vec4(aVertexColor, 1.0);
}