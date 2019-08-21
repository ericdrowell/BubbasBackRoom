function world_init() {
  world_buildModel();
  world_buildBuffers();
}

function world_buildModel() {
  // -------------------- ROOM 1 --------------------

  // floor
  world_addPlane(-20, 20, -1, -1, -20, 20, 'mossy-stone');

  // poles
  world_addPlane(-11, -9, 0, 0, -11, -9, 'stone');
  world_addPlane(-10, -10, 1, 10, -10, -10, 'stone');
  world_addPlane(-11, -9, 9, 9, -11, -9, 'stone');

  world_addPlane(9, 11, 0, 0, -11, -9, 'stone');
  world_addPlane(10, 10, 1, 10, -10, -10, 'stone');
  world_addPlane(9, 11, 9, 9, -11, -9, 'stone');

  world_addPlane(-11, -9, 0, 0, 9, 11, 'stone');
  world_addPlane(-10, -10, 1, 10, 10, 10, 'stone');
  world_addPlane(-11, -9, 9, 9, 9, 11, 'stone');

  // broken pole
  world_addPlane(9, 11, 0, 0, 9, 11, 'stone');
  world_addPlane(10, 10, 1, 3, 10, 10, 'stone');
  world_addPlane(7, 11, 0, 0, 5, 5, 'stone');
  world_addPlane(9, 11, 9, 9, 9, 11, 'stone');

  // walls
  world_addPlane(-20, 20, 0, 10, -20, -20, 'mossy-stone');
  world_addPlane(-20, 20, 0, 10, 20, 20, 'mossy-stone');
  world_addPlane(-30, -20, 0, 20, -3, -3, 'mossy-stone');
  world_addPlane(-30, -20, 0, 20, 3, 3, 'mossy-stone');
  world_addPlane(20, 20, 0, 10, -20, 20, 'mossy-stone');

  // celing
  world_addPlane(-20, 20, 10, 10, -20, 20, 'mossy-stone');

  // -------------------- STAIRS --------------------

  // walls
  world_addPlane(-20, -20, 0, 10, -20, -3, 'mossy-stone');
  world_addPlane(-20, -20, 0, 10, 3, 20, 'mossy-stone');

  // steps
  world_addPlane(-20, -20, 0, 0, -2, 2, 'wood');
  world_addPlane(-21, -21, 1, 1, -2, 2, 'wood');
  world_addPlane(-22, -22, 2, 2, -2, 2, 'wood');
  world_addPlane(-23, -23, 3, 3, -2, 2, 'wood');
  world_addPlane(-24, -24, 4, 4, -2, 2, 'wood');
  world_addPlane(-25, -25, 5, 5, -2, 2, 'wood');
  world_addPlane(-26, -26, 6, 6, -2, 2, 'wood');
  world_addPlane(-27, -27, 7, 7, -2, 2, 'wood');
  world_addPlane(-28, -28, 8, 8, -2, 2, 'wood');
  world_addPlane(-29, -29, 9, 9, -2, 2, 'wood');
  world_addPlane(-30, -30, 10, 10, -2, 2, 'wood');

}

function world_addPlane(startX, endX, startY, endY, startZ, endZ, texture) {
  for (let x=startX; x<=endX; x++) {
    for (let y=startY; y<=endY; y++) {
      for (let z=startZ; z<=endZ; z++) {
        world_addBlock(x, y, z, texture);
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
          lastBuffer.position.push(CUBE_BUFFERS.position[n] + parseInt(x)*2 + randomOffset);
          lastBuffer.position.push(CUBE_BUFFERS.position[n+1] + parseInt(y)*2 + randomOffset);
          lastBuffer.position.push(CUBE_BUFFERS.position[n+2] + parseInt(z)*2 + randomOffset);
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

function world_getBlock(x, y, z) {
  let block = world[x] && world[x][y] && world[x][y][z];

  if (block) {
    return {
      x: x,
      y: y,
      z: z,
      type: block.type
    };
  }
  else {
    return null;
  }
}

function world_getCameraBlock() {
  return {
    x: MATH_ROUND(camera.x/2),
    y: MATH_ROUND(camera.y/2),
    z: MATH_ROUND(camera.z/2)
  }
}

function world_getBlockBelow() {
  let cameraBlock = world_getCameraBlock();
  let block = world_getBlock(cameraBlock.x, cameraBlock.y - MATH_ROUND(PLAYER_HEIGHT/2) - 1, cameraBlock.z);

  return block;
}

// for debugging
// function world_getNumBlocks() {
//   let total = 0;
//   for (let key in worldBuffers) {
//     worldBuffers[key].forEach(function(buffer) {
//       total += buffer.numBlocks;
//     });
//   }
//   console.log(total);
// }
