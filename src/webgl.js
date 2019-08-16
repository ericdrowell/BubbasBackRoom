var mvMatrix; 
var pMatrix;
var mvMatrixStack;
var shaderProgram;

function webgl_init() {
  mvMatrix = mat4.create(); 
  pMatrix = mat4.create();
  mvMatrixStack = [];

  webgl_setShaderProgram();
  webgl_initUniforms();

  // init depth test
  context.enable(context.DEPTH_TEST);
};

function webgl_setShaderProgram() {
  var shader;

  shaderProgram = context.createProgram();
  
  shader = context.createShader(context.FRAGMENT_SHADER);
  context.shaderSource(shader, fragmentShader);
  context.compileShader(shader);
  context.attachShader(shaderProgram, shader);
  
  shader = context.createShader(context.VERTEX_SHADER);
  context.shaderSource(shader, vertexShader);
  context.compileShader(shader);
  context.attachShader(shaderProgram, shader);

  context.linkProgram(shaderProgram);
  
  if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
    alert('Could not initialize shaders');
  }
  
  context.useProgram(shaderProgram);
 
};

function webgl_initUniforms() {
  shaderProgram.vertexPositionAttribute = context.getAttribLocation(shaderProgram, 'aVertexPosition');
  context.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.pMatrixUniform = context.getUniformLocation(shaderProgram, 'uPMatrix');
  shaderProgram.mvMatrixUniform = context.getUniformLocation(shaderProgram, 'uMVMatrix');

  shaderProgram.textureCoordAttribute = context.getAttribLocation(shaderProgram, 'aTextureCoord');
  context.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  shaderProgram.samplerUniform = context.getUniformLocation(shaderProgram, 'uSampler');

  shaderProgram.vertexNormalAttribute = context.getAttribLocation(shaderProgram, 'aVertexNormal');
  context.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  shaderProgram.nMatrixUniform = context.getUniformLocation(shaderProgram, 'uNMatrix');


};

function webgl_createArrayBuffer(vertices) {
  var buffer = context.createBuffer();
  buffer.numElements = vertices.length;
  context.bindBuffer(context.ARRAY_BUFFER, buffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
  return buffer;
};

function webgl_createElementArrayBuffer(vertices) {
  var buffer = context.createBuffer();
  buffer.numElements = vertices.length;
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffer);
  context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertices), context.STATIC_DRAW);
  return buffer;
};


function webgl_setUniforms() {
  context.uniform1i(shaderProgram.samplerUniform, 0);

  context.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  context.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  
  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  context.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
};

function webgl_render(buffers, texture) {
  // clear
  context.viewport(0, 0, canvas.width, canvas.height);
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

  // position buffers
  context.bindBuffer(context.ARRAY_BUFFER, buffers.position);
  context.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, context.FLOAT, false, 0, 0);

  // texture buffers
  context.bindBuffer(context.ARRAY_BUFFER, buffers.texture);
  context.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, context.FLOAT, false, 0, 0);
  context.activeTexture(context.TEXTURE0);
  context.bindTexture(context.TEXTURE_2D, texture);

  // index buffers
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffers.index);

  // normal buffers
  context.bindBuffer(context.ARRAY_BUFFER, buffers.normal);
  context.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, context.FLOAT, false, 0, 0);

  // set uniforms
  webgl_setUniforms();

  // draw elements
  context.drawElements(context.TRIANGLES, buffers.index.numElements, context.UNSIGNED_SHORT, 0);
};

function webgl_initTexture(glTexture, image) {
  context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
  context.bindTexture(context.TEXTURE_2D, glTexture);
  context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_NEAREST);
  context.generateMipmap(context.TEXTURE_2D);
  context.bindTexture(context.TEXTURE_2D, null);
};





























function gl_perspective(viewAngle, minDist, maxDist) {
  mat4.perspective(viewAngle, canvas.width / canvas.height, minDist, maxDist, pMatrix);
};

function gl_identity() {
  mat4.identity(mvMatrix);
};

function gl_translate(x, y, z) {
  mat4.translate(mvMatrix, [x, y, z]);
};

function gl_rotate(angle, x, y, z) {
  mat4.rotate(mvMatrix, angle, [x, y, z]);
};

function gl_scale(x, y, z) {
  mat4.scale(mvMatrix, [x, y, z]);
};


