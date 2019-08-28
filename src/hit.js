function hit_init() {
  hitCanvas = document.createElement('canvas');
  hitContext = hitCanvas.getContext('webgl', {
    // have to add preserveDrawingBuffer so that we can pick colors with readPixels for hit detection
    preserveDrawingBuffer: true,
    // solve webgl antialiasing picking issue
    antialias: false
  });
  hitCanvas.width = viewportWidth;
  hitCanvas.height = viewportHeight;
  hitCanvas.style.position = 'fixed';
  hitCanvas.style.top = 0;
  hitCanvas.style.left = 0;

  // very wide screen
  if (windowRatio > GAME_ASPECT_RATIO) {
    hitCanvas.style.left = '50%';
    hitCanvas.style.marginLeft = '-' + (viewportWidth/2) + 'px'
  }
  // very tall screen
  else {
    hitCanvas.style.top = '50%';
    hitCanvas.style.marginTop = '-' + (viewportHeight/2) + 'px'
  }

  hit_setShaderProgram();
  hit_initUniforms();

  // init depth test
  hitContext.enable(hitContext.DEPTH_TEST);
};

function hit_setShaderProgram() {
  let shader;

  hitShaderProgram = hitContext.createProgram();
  
  shader = hitContext.createShader(hitContext.FRAGMENT_SHADER);
  hitContext.shaderSource(shader, hitFragmentShader);
  hitContext.compileShader(shader);
  hitContext.attachShader(hitShaderProgram, shader);
  
  shader = hitContext.createShader(hitContext.VERTEX_SHADER);
  hitContext.shaderSource(shader, hitVertexShader);
  hitContext.compileShader(shader);
  hitContext.attachShader(hitShaderProgram, shader);

  hitContext.linkProgram(hitShaderProgram);
  
  if (!hitContext.getProgramParameter(hitShaderProgram, hitContext.LINK_STATUS)) {
    alert('Could not initialize shaders');
  }
  
  hitContext.useProgram(hitShaderProgram);
};

function hit_initUniforms() {
  hitShaderProgram.vertexPositionAttribute = hitContext.getAttribLocation(hitShaderProgram, 'aVertexPosition');
  hitContext.enableVertexAttribArray(hitShaderProgram.vertexPositionAttribute);

  hitShaderProgram.vertexColorAttribute = hitContext.getAttribLocation(hitShaderProgram, 'aVertexColor');
  hitContext.enableVertexAttribArray(hitShaderProgram.vertexColorAttribute);
  
  hitShaderProgram.pMatrixUniform = hitContext.getUniformLocation(hitShaderProgram, 'uPMatrix');
  hitShaderProgram.mvMatrixUniform = hitContext.getUniformLocation(hitShaderProgram, 'uMVMatrix');
};

function hit_createArrayBuffer(vertices) {
  let buffer = hitContext.createBuffer();
  buffer.numElements = vertices.length;
  hitContext.bindBuffer(hitContext.ARRAY_BUFFER, buffer);
  hitContext.bufferData(hitContext.ARRAY_BUFFER, new Float32Array(vertices), hitContext.STATIC_DRAW);
  return buffer;
};

function hit_createElementArrayBuffer(vertices) {
  let buffer = hitContext.createBuffer();
  buffer.numElements = vertices.length;
  hitContext.bindBuffer(hitContext.ELEMENT_ARRAY_BUFFER, buffer);
  hitContext.bufferData(hitContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertices), hitContext.STATIC_DRAW);
  return buffer;
};


function hit_setUniforms() {
  hitContext.uniform1i(hitShaderProgram.samplerUniform, 0);
  hitContext.uniformMatrix4fv(hitShaderProgram.pMatrixUniform, false, pMatrix);
  hitContext.uniformMatrix4fv(hitShaderProgram.mvMatrixUniform, false, mvMatrix);
  
  let normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  hitContext.uniformMatrix3fv(hitShaderProgram.nMatrixUniform, false, normalMatrix);
};

function hit_clear() {
  hitContext.viewport(0, 0, hitCanvas.width, hitCanvas.height);
  hitContext.clear(hitContext.COLOR_BUFFER_BIT | hitContext.DEPTH_BUFFER_BIT);
}

function hit_render(buffers) {
  // position buffers
  hitContext.bindBuffer(hitContext.ARRAY_BUFFER, buffers.position);
  hitContext.vertexAttribPointer(hitShaderProgram.vertexPositionAttribute, 3, hitContext.FLOAT, false, 0, 0);

  // color buffers
  hitContext.bindBuffer(hitContext.ARRAY_BUFFER, buffers.color);
  hitContext.vertexAttribPointer(hitShaderProgram.vertexColorAttribute, 3, hitContext.FLOAT, false, 0, 0);

  // index buffers
  hitContext.bindBuffer(hitContext.ELEMENT_ARRAY_BUFFER, buffers.index);

  // set uniforms
  hit_setUniforms();

  // draw elements
  hitContext.drawElements(hitContext.TRIANGLES, buffers.index.numElements, hitContext.UNSIGNED_SHORT, 0);
};

function hit_getPixel(x, y) {
  x = Math.round(x);
  y = Math.round(y);

  // if x or y are out of bounds return -1
  if (x < 0 || y < 0 || x > viewportWidth || y > viewportHeight) {
    return -1;
  }

  data = new Uint8Array(4);
  hitContext.readPixels(x, (viewportHeight - y - 1), 1, 1, hitContext.RGBA, hitContext.UNSIGNED_BYTE, data);

  return data;
}


