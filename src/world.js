function world_init() {
  world_buildModel();
  world_buildBuffers();
}

function world_buildModel() {

  // -------------------- DIRT TUNNEL --------------------

  world_addTunnel(-60, -51, 9, 9, 0, 0);
  world_addTunnel(-81, -61, 19, 9, 5, 0);
  world_addTunnel(-100, -82, 11, 19, -5, 5);
  world_addTunnel(-140, -101, 16, 11, 5, -5);
  world_addTunnel(-241, -141, 26, 16, -3, 5);

  // -------------------- SHORT TUNNEL --------------------

  // floor
  world_addPlane(-50, -31, 10, 10, -2, 2, TEXTURES_MOSSY_STONE);
  world_addPlane(-61, -51, 10, 10, -2, 2, TEXTURES_DIRT);

  // walls
  world_addPlane(-50, -16, 11, 18, 3, 3, TEXTURES_MOSSY_STONE);
  world_addPlane(-50, -16, 11, 18, -3, -3, TEXTURES_MOSSY_STONE);

  // sides
  world_addPlane(-50, -50, 11, 18, -4, -4, TEXTURES_MOSSY_STONE);
  world_addPlane(-50, -50, 11, 18, 4, 4, TEXTURES_MOSSY_STONE);

  // ceiling
  world_addPlane(-50, -15, 18, 18, -2, 2, TEXTURES_ROTTING_WOOD);


  // -------------------- FOUR COLUMN ROOM  --------------------

  world_addPole(-10, 1, -10, 10);
  world_addPole(10, 1, -10, 10);
  world_addPole(-10, 1, 10, 10);
  
  // broken pole
  world_addPlane(9, 11, 0, 0, 9, 11, TEXTURES_STONE);
  world_addPlane(10, 10, 1, 3, 10, 10, TEXTURES_STONE);
  world_addPlane(7, 11, 0, 0, 5, 5, TEXTURES_STONE);
  world_addPlane(9, 11, 9, 9, 9, 11, TEXTURES_STONE);

  world_addRoom(-20, 20, -1, 10, -20, 20);
  // cut out step doorway
  world_removePlane(-20, -20, 0, 10, -2, 2);
  // cut out step top
  world_removePlane(-20, -15, 10, 10, -2, 2);

  // steps
  world_addSlope(-30, -20, 0, 10, -2, 2);
  // sloped ceiling
  world_addSlope(-22, -14, 12, 18, -2, 2);
  // steps walls
  world_addPlane(-30, -20, 0, 10, -3, -3, TEXTURES_MOSSY_STONE);
  world_addPlane(-30, -20, 0, 10, 3, 3, TEXTURES_MOSSY_STONE);

}

function world_addPole(x, y, z, height) {
  world_addPlane(x-1, x+1, y-1, y-1, z-1, z+1, TEXTURES_STONE);
  world_addPlane(x, x, y, y+height-1, z, z, TEXTURES_STONE);
  world_addPlane(x-1, x+1, y+height-2, y+height-2, z-1, z+1, TEXTURES_STONE);
}

function world_addSlope(startX, endX, startY, endY, startZ, endZ) {
  let y = endY;
  for (let x = startX; x <= endX; x++) {
    world_addPlane(x, x, y, y, startZ, endZ, TEXTURES_ROTTING_WOOD); 
    y--;
  }
}

function world_addRing(x, y, z) {
  // bottom of ring
  world_addPlane(x, x, y, y, z-2, z+2, TEXTURES_DIRT);

  // far side
  world_addPlane(x, x, y+3, y+7, z-5, z-5, TEXTURES_DIRT);

  // top of ring
  world_addPlane(x, x, y+10, y+10, z-2, z+2, TEXTURES_DIRT);

  // near side
  world_addPlane(x, x, y+3, y+7, z+5, z+5, TEXTURES_DIRT);

  // fillers
  world_addBlock(x, y+1, z-3, TEXTURES_DIRT);
  world_addBlock(x, y+2, z-4, TEXTURES_DIRT);

  world_addBlock(x, y+1, z+3, TEXTURES_DIRT);
  world_addBlock(x, y+2, z+4, TEXTURES_DIRT);

  world_addBlock(x, y+8, z-4, TEXTURES_DIRT);
  world_addBlock(x, y+9, z-3, TEXTURES_DIRT);

  world_addBlock(x, y+8, z+4, TEXTURES_DIRT);
  world_addBlock(x, y+9, z+3, TEXTURES_DIRT);
}

function world_addTunnel(startX, endX, startY, endY, startZ, endZ) {
  let diffX = endX - startX;
  let diffY = endY - startY;
  let diffZ = endZ - startZ;

  for (let x=startX; x<=endX; x++) {
    let y = MATH_ROUND(startY + (((x - startX) / diffX) * diffY));
    let z = MATH_ROUND(startZ + (((x - startX) / diffX) * diffZ));

    world_addRing(x, y, z);
  }
}

function world_addRoom(startX, endX, startY, endY, startZ, endZ) {
  // floor
  world_addPlane(startX, endX, startY, startY, startZ, endZ, TEXTURES_MOSSY_STONE);

  // ceiling
  world_addPlane(startX, endX, endY, endY, startZ, endZ, TEXTURES_ROTTING_WOOD);

  // walls
  world_addPlane(startX, endX, startY, endY, endZ, endZ, TEXTURES_MOSSY_STONE);
  world_addPlane(startX, endX, startY, endY, startZ, startZ, TEXTURES_MOSSY_STONE);
  world_addPlane(startX, startX, startY, endY, startZ, endZ, TEXTURES_MOSSY_STONE);
  world_addPlane(endX, endX, startY, endY, startZ, endZ, TEXTURES_MOSSY_STONE);
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

function world_addBlock(x, y, z, texture) {
  if (world[x] === undefined) {
    world[x] = [];
  }
  if (world[x][y] === undefined) {
    world[x][y] = [];
  }

  world[x][y][z] = {
    texture: texture
  };
}

function world_removePlane(startX, endX, startY, endY, startZ, endZ) {
  for (let x=startX; x<=endX; x++) {
    for (let y=startY; y<=endY; y++) {
      for (let z=startZ; z<=endZ; z++) {
        world_removeBlock(x, y, z);
      }
    }
  }
}

function world_removeBlock(x, y, z) {
  delete world[x][y][z];
}

function world_buildBuffers() {
  let rawBuffers = {};

  for (let x in world) {
    for (let y in world[x]) {
      for (let z in world[x][y]) {
        let block = world[x][y][z];
        let texture = block.texture;
        let n;

        if (rawBuffers[texture] === undefined) {
          rawBuffers[texture] = [
            {
              position: [],
              color: [],
              normal: [],
              texture: [],
              index: [],
              numBlocks: 0
            }
          ];
        }

        let lastBuffer = rawBuffers[texture][rawBuffers[texture].length-1];

        // used to slightly offset all blocks so they don't fit perfectly, and create a more organic fitting
        let randomOffset = (MATH_RANDOM() - 0.5) * 0.1;

        // position buffer
        for (let n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
          lastBuffer.position.push(CUBE_BUFFERS.position[n] + parseInt(x)*2 + randomOffset);
          lastBuffer.position.push(CUBE_BUFFERS.position[n+1] + parseInt(y)*2 + randomOffset);
          lastBuffer.position.push(CUBE_BUFFERS.position[n+2] + parseInt(z)*2 + randomOffset);
        }

        // hit color buffer
        for (let n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
          lastBuffer.color.push(0);
          lastBuffer.color.push(0);
          lastBuffer.color.push(1);
        }

        // normal buffer
        utils_concat(lastBuffer.normal, CUBE_BUFFERS.normal);

        // texture buffer
        utils_concat(lastBuffer.texture, CUBE_BUFFERS.texture);

        // index buffer
        for (let n = 0; n < CUBE_BUFFERS.index.length; n++) {
          lastBuffer.index.push(CUBE_BUFFERS.index[n] + (24 * lastBuffer.numBlocks));
        }

        if (lastBuffer.numBlocks >= BLOCKS_PER_BUFFER) {
          rawBuffers[texture].push({
            position: [],
            color: [],
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
  for (let texture in rawBuffers) {
    worldBuffers[texture] = [];
    worldHitBuffers[texture] = [];

    rawBuffers[texture].forEach(function(buffer) {
      worldBuffers[texture].push({
        position: webgl_createArrayBuffer(sceneContext, buffer.position),
        normal: webgl_createArrayBuffer(sceneContext, buffer.normal),
        texture: webgl_createArrayBuffer(sceneContext, buffer.texture),
        index: webgl_createElementArrayBuffer(sceneContext, buffer.index)
      });

      worldHitBuffers[texture].push({
        position: webgl_createArrayBuffer(hitContext, buffer.position),
        color: webgl_createArrayBuffer(hitContext, buffer.color),
        index: webgl_createElementArrayBuffer(hitContext, buffer.index)
      });
    });
  }
}

function world_render() {
  for (let texture in worldBuffers) {
    worldBuffers[texture].forEach(function(buffer) {
      scene_render(buffer, textures[texture].glTexture);
    });
  }  

  for (let texture in worldHitBuffers) {
    worldHitBuffers[texture].forEach(function(buffer) {
      hit_render(buffer);
    });
  }  
}

function world_getBlock(x, y, z) {
  x = MATH_ROUND(x);
  y = MATH_ROUND(y);
  z = MATH_ROUND(z);

  let block = world[x] && world[x][y] && world[x][y][z];

  if (block) {
    return {
      x: x,
      y: y,
      z: z,
      texture: block.texture
    };
  }
  else {
    return null;
  }
}

// function world_getBlockBelow(obj) {
//   let x = MATH_ROUND(obj.x);
//   let startY = MATH_ROUND(obj.y) - 1;
//   let z = MATH_ROUND(obj.z);

//   // num blocks below
//   for (let n=0; n<1; n++) {
//     let y = startY - 1 - n;

//     let block = world[x] && world[x][y] && world[x][y][z];

//     if (block) {
//       return {
//         x: x,
//         y: y,
//         z: z,
//         texture: block.texture
//       };
//     }
//   }

//   return null;

// }

// function world_getBlockPos(x, y, z) {
//   return {
//     x: MATH_ROUND(x),
//     y: MATH_ROUND(y),
//     z: MATH_ROUND(z)
//   }
// }

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
