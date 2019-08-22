attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform bool isFlashing;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;


void main(void) {
  vec4 worldVertexPos = uMVMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * worldVertexPos;

  vTextureCoord = aTextureCoord;

  // gun fire flash
  if (isFlashing) {
    vec3 ambientLight = vec3(1.0, 1.0, 1.0);
    vec3 transformedNormal = uNMatrix * aVertexNormal;
    vec4 directionalVector = normalize(vec4(0.85, 0.8, 0.75, 0.0));
    vec3 directionalLightColor = vec3(1, 1, 1);
    vec3 directionalLight = directionalLightColor * max(dot(transformedNormal.xyz, directionalVector.xyz), 0.0);

    vLightWeighting = ambientLight + directionalLight;
  }
  else {
    vec3 pointLightPos = vec3(0, 0, 0);
    vec3 pointLightColor = vec3(1, 1, 1);
    float pointLightDist = length(pointLightPos - worldVertexPos.xyz);
    float pointLightWeight = 2.0 * pow(0.97, pointLightDist);
    vec3 pointLight = pointLightColor * pointLightWeight; 

    vLightWeighting = pointLight;
  }

  
  //vLightWeighting = ambientLight + directionalLight + pointLight;
  //vLightWeighting = pointLight;
}