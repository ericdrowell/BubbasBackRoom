
var world = [];
var worldVertices = {};
var worldBuffers = {};

function world_init() {
  world_buildModel();
  //world_buildVertices();
  world_buildBuffers();

  
}

function world_buildModel() {
  world[0] = {};
  world[0][0] = {};
  world[0][0][0] = {
    type: 'ground'
  }

  world[1] = {};
  world[1][1] = {};
  world[1][1][1] = {
    type: 'ground'
  }

  world[2] = {};
  world[2][2] = {};
  world[2][2][2] = {
    type: 'ground'
  }
}

// function world_buildVertices() {
//   let numBlocks = 3;
//   let positionsIndex = 0;
//   let normalsIndex = 0;
//   let texturesIndex = 0;

//   worldVertices.positions = new Float32Array(numBlocks*3);
//   worldVertices.normals = new Float32Array(numBlocks*3);
//   worldVertices.textures = new Float32Array(numBlocks*2);

//   for (let x in world) {
//     for (let y in world[x]) {
//       for (let z in world[x][y]) {
//         worldVertices[positionsIndex++] = x;
//         worldVertices[positionsIndex++] = y;
//         worldVertices[positionsIndex++] = z;

//       }
//     }
//   }

// }

function world_buildBuffers() {
   // right now, just a world with one block, and one texture
  worldBuffers.position = webgl_createArrayBuffer(CUBE_BUFFERS.position);
  worldBuffers.normal = webgl_createArrayBuffer(CUBE_BUFFERS.normal);
  worldBuffers.texture = webgl_createArrayBuffer(CUBE_BUFFERS.texture);
  worldBuffers.index = webgl_createElementArrayBuffer(CUBE_BUFFERS.index);





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
