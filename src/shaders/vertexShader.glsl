attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;


void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

  vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  vec3 directionalLightColor = vec3(1, 1, 1);

  // static light
  vec4 directionalVector = normalize(vec4(0.85, 0.8, 0.75, 0.0));
  vec3 transformedNormal = aVertexNormal;

  // gun fire flash
  // vec4 directionalVector = normalize(vec4(0.0, 0.0, 1.0, 0.0));
  // vec3 transformedNormal = uNMatrix * aVertexNormal;

  float directional = max(dot(transformedNormal.xyz, directionalVector.xyz), 0.0);
  vLightWeighting = ambientLight + (directionalLightColor * directional);
}