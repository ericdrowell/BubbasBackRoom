attribute vec3 ve;
attribute vec3 aVertexColor;

uniform mat4 mv;
uniform mat4 pm;
varying vec4 co; // vVertexColor

void main(void) {
  vec4 worldVertexPos = mv * vec4(ve, 1.0);
  gl_Position = pm * worldVertexPos;

  co = vec4(aVertexColor, 1.0);
}