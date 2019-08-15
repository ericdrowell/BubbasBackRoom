attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingColor;
uniform bool uUseLighting;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform bool uUseDistanceLightWeighting;

void main(void) {
  float distanceLightWeighting = 1.0; 
  vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * mvPosition;
  vTextureCoord = aTextureCoord;
  vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);
  vec3 transformedNormal = uNMatrix * aVertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
  float mvDistance = length(uPointLightingLocation - mvPosition.xyz);
  if (uUseDistanceLightWeighting) {
    distanceLightWeighting = pow(0.992, mvDistance*2.0);
  }
  vLightWeighting = uAmbientColor + uPointLightingColor * distanceLightWeighting;
}