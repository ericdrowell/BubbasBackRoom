function world_init() {
  world_buildModel();
  world_buildBuffers();
}

function world_buildModel() {

  // dirt tunnel
  // floor
  // world_addPlane(-53, -51, 10, 10, -2, 2, TEXTURES_DIRT);
  // world_addPlane(-54, -54, 10, 10, -1, 3, TEXTURES_DIRT);

  world_addTunnel(-60, -51, 9, 9, 0, 0, TEXTURES_DIRT);
  world_addTunnel(-81, -61, 19, 9, 5, 0, TEXTURES_DIRT);
  world_addTunnel(-100, -82, 11, 19, -5, 5, TEXTURES_DIRT);
  world_addTunnel(-140, -101, 16, 11, 5, -5, TEXTURES_DIRT);

  // -------------------- SHORT TUNNEL --------------------

  // floor
  world_addPlane(-50, -31, 10, 10, -2, 2, TEXTURES_MOSSY_STONE);

  // walls
  world_addPlane(-50, -16, 11, 18, 3, 3, TEXTURES_MOSSY_STONE);
  world_addPlane(-50, -16, 11, 18, -3, -3, TEXTURES_MOSSY_STONE);

  // sides
  world_addPlane(-50, -50, 11, 18, -4, -4, TEXTURES_MOSSY_STONE);
  world_addPlane(-50, -50, 11, 18, 4, 4, TEXTURES_MOSSY_STONE);

  // ceiling
  world_addPlane(-50, -15, 18, 18, -2, 2, TEXTURES_ROTTING_WOOD);

  // -------------------- STAIRS --------------------

  // walls
  world_addPlane(-20, -20, 0, 9, -20, -3, TEXTURES_MOSSY_STONE);
  world_addPlane(-20, -20, 0, 9, 3, 20, TEXTURES_MOSSY_STONE);

  // steps
  world_addSlope(-30, -20, 0, 10, -2, 2, TEXTURES_DIRT);

  // sloped ceiling
  world_addSlope(-22, -14, 12, 18, -2, 2, TEXTURES_DIRT);

  // -------------------- FOUR COLUMN ROOM  --------------------

  // floor
  world_addPlane(-20, 20, -1, -1, -20, 20, TEXTURES_MOSSY_STONE);

  // poles
  world_addPlane(-11, -9, 0, 0, -11, -9, TEXTURES_STONE);
  world_addPlane(-10, -10, 1, 10, -10, -10, TEXTURES_STONE);
  world_addPlane(-11, -9, 9, 9, -11, -9, TEXTURES_STONE);

  world_addPlane(9, 11, 0, 0, -11, -9, TEXTURES_STONE);
  world_addPlane(10, 10, 1, 10, -10, -10, TEXTURES_STONE);
  world_addPlane(9, 11, 9, 9, -11, -9, TEXTURES_STONE);

  world_addPlane(-11, -9, 0, 0, 9, 11, TEXTURES_STONE);
  world_addPlane(-10, -10, 1, 10, 10, 10, TEXTURES_STONE);
  world_addPlane(-11, -9, 9, 9, 9, 11, TEXTURES_STONE);

  // broken pole
  world_addPlane(9, 11, 0, 0, 9, 11, TEXTURES_STONE);
  world_addPlane(10, 10, 1, 3, 10, 10, TEXTURES_STONE);
  world_addPlane(7, 11, 0, 0, 5, 5, TEXTURES_STONE);
  world_addPlane(9, 11, 9, 9, 9, 11, TEXTURES_STONE);

  // walls
  world_addPlane(-20, 20, 0, 10, -20, -20, TEXTURES_MOSSY_STONE);
  world_addPlane(-20, 20, 0, 10, 20, 20, TEXTURES_MOSSY_STONE);
  world_addPlane(-30, -20, 0, 10, -3, -3, TEXTURES_MOSSY_STONE);
  world_addPlane(-30, -20, 0, 10, 3, 3, TEXTURES_MOSSY_STONE);
  world_addPlane(20, 20, 0, 10, -20, 20, TEXTURES_MOSSY_STONE);

  // celing
  world_addPlane(-13, 20, 10, 10, -20, 20, TEXTURES_ROTTING_WOOD);
  world_addPlane(-20, -14, 10, 10, -20, -3, TEXTURES_ROTTING_WOOD);
  world_addPlane(-20, -14, 10, 10, 3, 20, TEXTURES_ROTTING_WOOD);


}

function world_addSlope(startX, endX, startY, endY, startZ, endZ, type) {
  let y = endY;
  for (let x = startX; x <= endX; x++) {
    world_addPlane(x, x, y, y, startZ, endZ, type); 
    y--;
  }
}

function world_addRing(x, y, z, texture) {

  // bottom of ring
  world_addPlane(x, x, y, y, z-2, z+2, texture);

  // far side
  world_addPlane(x, x, y+3, y+7, z-5, z-5, texture);

  // top of ring
  world_addPlane(x, x, y+10, y+10, z-2, z+2, texture);

  // near side
  world_addPlane(x, x, y+3, y+7, z+5, z+5, texture);

  // fillers
  world_addBlock(x, y+1, z-3, texture);
  world_addBlock(x, y+2, z-4, texture);

  world_addBlock(x, y+1, z+3, texture);
  world_addBlock(x, y+2, z+4, texture);

  world_addBlock(x, y+8, z-4, texture);
  world_addBlock(x, y+9, z-3, texture);

  world_addBlock(x, y+8, z+4, texture);
  world_addBlock(x, y+9, z+3, texture);
}

function world_addTunnel(startX, endX, startY, endY, startZ, endZ, texture) {
  let diffX = endX - startX;
  let diffY = endY - startY;
  let diffZ = endZ - startZ;

  for (let x=startX; x<=endX; x++) {
    let y = MATH_ROUND(startY + (((x - startX) / diffX) * diffY));
    let z = MATH_ROUND(startZ + (((x - startX) / diffX) * diffZ));

    world_addRing(x, y, z, texture);
  }
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

function world_getBlockPos(x, y, z) {
  return {
    x: MATH_ROUND(x),
    y: MATH_ROUND(y),
    z: MATH_ROUND(z)
  }
}

function world_getBlockBelow(block) {
  return world_getBlock(block.x, block.y - 1, block.z);
  
  // let blockBelow = world_getBlock(block.x, block.y - 1, block.z);

  // if (blockBelow) {
  //   return blockBelow;
  // }

  // // now try current block
  // let currentBlock = world_getBlock(block.x, block.y, block.z);

  // return currentBlock;
}

function world_getBlockAbove(block) {
  return world_getBlock(block.x, block.y + 1, block.z);
}

function world_getBlockLeft(block) {
  return world_getBlock(block.x - 1, block.y, block.z);
}

function world_getBlockRight(block) {
  return world_getBlock(block.x + 1, block.y, block.z);
}

function world_getBlockFront(block) {
  return world_getBlock(block.x, block.y, block.z + 1);
}

function world_getBlockBack(block) {
  return world_getBlock(block.x, block.y, block.z - 1);
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
