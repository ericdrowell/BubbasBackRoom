
var world = [];
var worldVertices = {};
var worldBuffers = {};

function world_init() {
  world_buildModel();
  world_buildBuffers();
}

function world_buildModel() {
  for (let x=0; x<5; x++) {
    for (let y=0; y<x; y++) {
      for (let z=0; z<5; z++) {
        world_addBlock(x*2, y*2, z*2);
      }
    }
  }
}

function world_addBlock(x, y, z) {
  if (world[x] === undefined) {
    world[x] = [];
  }
  if (world[x][y] === undefined) {
    world[x][y] = [];
  }

  world[x][y][z] = {
    type: 'ground'
  };
  
}

function world_buildBuffers() {
  let positionBuffer = [];
  let normalBuffer = [];
  let textureBuffer = [];
  let indexBuffer = [];
  let blockCount = 0;

  for (let x in world) {
    for (let y in world[x]) {
      for (let z in world[x][y]) {
        let n;
        // position buffer
        for (n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
          positionBuffer.push(CUBE_BUFFERS.position[n] + parseInt(x));
          positionBuffer.push(CUBE_BUFFERS.position[n+1] + parseInt(y));
          positionBuffer.push(CUBE_BUFFERS.position[n+2] + parseInt(z));
        }

        // normal buffer
        normalBuffer = normalBuffer.concat(CUBE_BUFFERS.normal);

        // texture buffer
        textureBuffer = textureBuffer.concat(CUBE_BUFFERS.texture);

        // index buffer
        for (n = 0; n < CUBE_BUFFERS.index.length; n++) {
          indexBuffer.push(CUBE_BUFFERS.index[n] + (24 * blockCount));
        }

        blockCount++;

      }
    }
  }

  worldBuffers.position = webgl_createArrayBuffer(positionBuffer);
  worldBuffers.normal = webgl_createArrayBuffer(normalBuffer);
  worldBuffers.texture = webgl_createArrayBuffer(textureBuffer);
  worldBuffers.index = webgl_createElementArrayBuffer(indexBuffer);

}

function world_render() {
  // gl_save();
  // gl_translate(point.x, point.y, point.z);
  // gl_rotate(tree.rotationY, 0, 1, 0);
  // gl_scale(2, 2, 2);
  // gl_pushBuffers(buffers.cube, textures.tree.glTexture, true);
  // gl_drawElements(buffers.cube);
  // gl_restore();


  webgl_render(worldBuffers, textures.tree.glTexture, true);


}
