
// gl drawElements can only handle 64k vertices.  Each block is defined by exactly 24 vertices.  Thus we can at most
// render 2,666 blocks for each drawElements call.  Exceeding this number will result in skipping of call draws for individual blocks
let BLOCKS_PER_BUFFER = 2666;

let world = [];
let worldBuffers = {};

function world_init() {
  world_buildModel();
  world_buildBuffers();
}

function world_buildModel() {
  // floor
  world_addBlob(-20, 20, -1, -1, -20, 20, 'mossy-stone');

  // pole
  world_addBlob(-11, -9, 0, 0, -11, -9, 'wood');
  world_addBlob(-10, -10, 1, 10, -10, -10, 'wood');
  world_addBlob(-11, -9, 9, 9, -11, -9, 'wood');

  // stairs
  world_addBlob(0, 0, 0, 0, 0, 5, 'wood');
  world_addBlob(1, 1, 1, 1, 0, 5, 'wood');
  world_addBlob(2, 2, 2, 2, 0, 5, 'wood');
  world_addBlob(3, 3, 3, 3, 0, 5, 'wood');

  // wall
  world_addBlob(-20, 20, 0, 10, -20, -20, 'mossy-stone');
  world_addBlob(-20, 20, 0, 10, 20, 20, 'mossy-stone');
  world_addBlob(-20, -20, 0, 10, -20, 20, 'mossy-stone');
  world_addBlob(20, 20, 0, 10, -20, 20, 'mossy-stone');

  // celing
  world_addBlob(-20, 20, 10, 10, -20, 20, 'mossy-stone');
}

function world_addBlob(startX, endX, startY, endY, startZ, endZ, texture) {
  for (let x=startX; x<=endX; x++) {
    for (let y=startY; y<=endY; y++) {
      for (let z=startZ; z<=endZ; z++) {
        world_addBlock(x*2, y*2, z*2, texture);
      }
    }
  }
}

function world_addBlock(x, y, z, type) {
  if (world[x] === undefined) {
    world[x] = [];
  }
  if (world[x][y] === undefined) {
    world[x][y] = [];
  }

  world[x][y][z] = {
    type: type
  };
}

function world_buildBuffers() {
  for (let x in world) {
    for (let y in world[x]) {
      for (let z in world[x][y]) {
        let block = world[x][y][z];
        let type = block.type;
        let n;

        if (worldBuffers[type] === undefined) {
          worldBuffers[type] = [
            {
              position: [],
              normal: [],
              texture: [],
              index: [],
              numBlocks: 0
            }
          ];
        }

        let lastBuffer = worldBuffers[type][worldBuffers[type].length-1];

        // used to slightly offset all blocks so they don't fit perfectly, and create a more organic fitting
        let randomOffset = (MATH_RANDOM() - 0.5) * 0.1;

        // position buffer
        for (n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
          lastBuffer.position.push(CUBE_BUFFERS.position[n] + parseInt(x) + randomOffset);
          lastBuffer.position.push(CUBE_BUFFERS.position[n+1] + parseInt(y) + randomOffset);
          lastBuffer.position.push(CUBE_BUFFERS.position[n+2] + parseInt(z) + randomOffset);
        }

        // normal buffer
        utils_concat(lastBuffer.normal, CUBE_BUFFERS.normal);

        // texture buffer
        utils_concat(lastBuffer.texture, CUBE_BUFFERS.texture);

        // index buffer
        for (n = 0; n < CUBE_BUFFERS.index.length; n++) {
          lastBuffer.index.push(CUBE_BUFFERS.index[n] + (24 * lastBuffer.numBlocks));
        }

        if (lastBuffer.numBlocks >= BLOCKS_PER_BUFFER) {
          worldBuffers[type].push({
            position: [],
            normal: [],
            texture: [],
            index: [],
            numBlocks: 0
          });
        }
        else {
          lastBuffer.numBlocks++;
        }
      }
    }
  }

  // convert regular arrays to webgl buffers
  for (let type in worldBuffers) {
    worldBuffers[type].forEach(function(buffer) {
      buffer.position = webgl_createArrayBuffer(buffer.position);
      buffer.normal = webgl_createArrayBuffer(buffer.normal);
      buffer.texture = webgl_createArrayBuffer(buffer.texture);
      buffer.index = webgl_createElementArrayBuffer(buffer.index);
    });
  }
}

function world_render() {
  for (let type in worldBuffers) {
    worldBuffers[type].forEach(function(buffer) {
      webgl_render(buffer, textures[type].glTexture);
    });
  }  
}
