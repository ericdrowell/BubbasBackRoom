function webgl_init() {
  webglCanvas = document.getElementById('webglCanvas');
  webglContext = webglCanvas.getContext('webgl');
  webglCanvas.width = viewportWidth;
  webglCanvas.height = viewportHeight;
  webglCanvas.style.position = 'fixed';
  webglCanvas.style.top = 0;
  webglCanvas.style.left = 0;

  // very wide screen
  if (windowRatio > GAME_ASPECT_RATIO) {
    webglCanvas.style.left = '50%';
    webglCanvas.style.marginLeft = '-' + (viewportWidth/2) + 'px'
  }
  // very tall screen
  else {
    webglCanvas.style.top = '50%';
    webglCanvas.style.marginTop = '-' + (viewportHeight/2) + 'px'
  }

  mvMatrix = mat4.create(); 
  pMatrix = mat4.create();

  webgl_setShaderProgram();
  webgl_initUniforms();

  // init depth test
  webglContext.enable(webglContext.DEPTH_TEST);
};

function webgl_setShaderProgram() {
  let shader;

  shaderProgram = webglContext.createProgram();
  
  shader = webglContext.createShader(webglContext.FRAGMENT_SHADER);
  webglContext.shaderSource(shader, fragmentShader);
  webglContext.compileShader(shader);
  webglContext.attachShader(shaderProgram, shader);
  
  shader = webglContext.createShader(webglContext.VERTEX_SHADER);
  webglContext.shaderSource(shader, vertexShader);
  webglContext.compileShader(shader);
  webglContext.attachShader(shaderProgram, shader);

  webglContext.linkProgram(shaderProgram);
  
  if (!webglContext.getProgramParameter(shaderProgram, webglContext.LINK_STATUS)) {
    alert('Could not initialize shaders');
  }
  
  webglContext.useProgram(shaderProgram);
};

function webgl_initUniforms() {
  shaderProgram.vertexPositionAttribute = webglContext.getAttribLocation(shaderProgram, 'aVertexPosition');
  webglContext.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.pMatrixUniform = webglContext.getUniformLocation(shaderProgram, 'uPMatrix');
  shaderProgram.mvMatrixUniform = webglContext.getUniformLocation(shaderProgram, 'uMVMatrix');

  shaderProgram.textureCoordAttribute = webglContext.getAttribLocation(shaderProgram, 'aTextureCoord');
  webglContext.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  shaderProgram.samplerUniform = webglContext.getUniformLocation(shaderProgram, 'uSampler');

  shaderProgram.vertexNormalAttribute = webglContext.getAttribLocation(shaderProgram, 'aVertexNormal');
  webglContext.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  shaderProgram.nMatrixUniform = webglContext.getUniformLocation(shaderProgram, 'uNMatrix');

  shaderProgram.isFlashing = webglContext.getUniformLocation(shaderProgram, 'isFlashing');
};

function webgl_createArrayBuffer(vertices) {
  let buffer = webglContext.createBuffer();
  buffer.numElements = vertices.length;
  webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
  webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(vertices), webglContext.STATIC_DRAW);
  return buffer;
};

function webgl_createElementArrayBuffer(vertices) {
  let buffer = webglContext.createBuffer();
  buffer.numElements = vertices.length;
  webglContext.bindBuffer(webglContext.ELEMENT_ARRAY_BUFFER, buffer);
  webglContext.bufferData(webglContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertices), webglContext.STATIC_DRAW);
  return buffer;
};


function webgl_setUniforms() {
  webglContext.uniform1i(shaderProgram.samplerUniform, 0);
  webglContext.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  webglContext.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  
  let normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  webglContext.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

  webglContext.uniform1i(shaderProgram.isFlashing, flashTimeRemaining > 0);
};

function webgl_clear() {
  webglContext.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  webglContext.clear(webglContext.COLOR_BUFFER_BIT | webglContext.DEPTH_BUFFER_BIT);
}

function webgl_render(buffers, texture) {
  // position buffers
  webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffers.position);
  webglContext.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, webglContext.FLOAT, false, 0, 0);

  // texture buffers
  webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffers.texture);
  webglContext.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, webglContext.FLOAT, false, 0, 0);
  webglContext.activeTexture(webglContext.TEXTURE0);
  webglContext.bindTexture(webglContext.TEXTURE_2D, texture);

  // index buffers
  webglContext.bindBuffer(webglContext.ELEMENT_ARRAY_BUFFER, buffers.index);

  // normal buffers
  webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffers.normal);
  webglContext.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, webglContext.FLOAT, false, 0, 0);

  // set uniforms
  webgl_setUniforms();

  // draw elements
  webglContext.drawElements(webglContext.TRIANGLES, buffers.index.numElements, webglContext.UNSIGNED_SHORT, 0);
};

function webgl_initTexture(glTexture, image) {
  webglContext.pixelStorei(webglContext.UNPACK_FLIP_Y_WEBGL, true);
  webglContext.bindTexture(webglContext.TEXTURE_2D, glTexture);
  webglContext.texImage2D(webglContext.TEXTURE_2D, 0, webglContext.RGBA, webglContext.RGBA, webglContext.UNSIGNED_BYTE, image);
  webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
  webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.LINEAR_MIPMAP_NEAREST);
  webglContext.generateMipmap(webglContext.TEXTURE_2D);
  webglContext.bindTexture(webglContext.TEXTURE_2D, null);
};


