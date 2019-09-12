function hit_init() {
  hitCanvas = document.createElement('canvas');
  hitContext = hitCanvas.getContext('webgl', {
    // have to add preserveDrawingBuffer so that we can pick colors with readPixels for hit detection
    preserveDrawingBuffer: true,
    // solve webgl antialiasing picking issue
    antialias: false
  });


  webgl_setSize(hitCanvas);

  hitShaderProgram = hitContext.createProgram();
  webgl_setShaderProgram(hitShaderProgram, hitContext, hitFragmentShader, hitVertexShader);

  hit_initUniforms();

  // init depth test
  hitContext.enable(hitContext.DEPTH_TEST);
};

function hit_initUniforms() {
  webgl_setAttribLocation(hitShaderProgram, hitContext, 'aVertexPosition');
  webgl_setAttribLocation(hitShaderProgram, hitContext, 'aVertexColor');

  webgl_setUniformLocation(hitShaderProgram, hitContext, 'uPMatrix');
  webgl_setUniformLocation(hitShaderProgram, hitContext, 'uMVMatrix');
};

function hit_setUniforms() {
  hitContext.uniform1i(hitShaderProgram.samplerUniform, 0);
  hitContext.uniformMatrix4fv(hitShaderProgram.uPMatrix, false, pMatrix);
  hitContext.uniformMatrix4fv(hitShaderProgram.uMVMatrix, false, mvMatrix);
};

function hit_render(buffers) {
  // position buffers
  hitContext.bindBuffer(hitContext.ARRAY_BUFFER, buffers.position);
  hitContext.vertexAttribPointer(hitShaderProgram.aVertexPosition, 3, hitContext.FLOAT, false, 0, 0);

  // color buffers
  hitContext.bindBuffer(hitContext.ARRAY_BUFFER, buffers.color);
  hitContext.vertexAttribPointer(hitShaderProgram.aVertexColor, 3, hitContext.FLOAT, false, 0, 0);

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

  let data = new Uint8Array(4);
  hitContext.readPixels(x, (viewportHeight - y - 1), 1, 1, hitContext.RGBA, hitContext.UNSIGNED_BYTE, data);

  return data;
}


