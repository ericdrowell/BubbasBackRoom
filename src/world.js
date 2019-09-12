function world_init() {
  world_buildModel();
  world_buildBuffers();
}

function world_buildModel() {

  // -------------------- BACK ROOM --------------------
  world_addRoom(-290, -241, 26, 36, -10, 50);
  world_removeTunnelEntrance(-241, 31, -3);
  // world_removePlane(-241, -241, 26, 36, -8, 2);

  // // tunnel filler
  // world_addPlane(-241, -241, 27, 28, 1, 2, TEXTURES_DIRT);
  // world_addPlane(-241, -241, 27, 28, -8, -7, TEXTURES_DIRT);
  // world_addPlane(-241, -241, 34, 35, 1, 2, TEXTURES_DIRT);
  // world_addPlane(-241, -241, 34, 35, -8, -7, TEXTURES_DIRT);

  // z tables
  world_addTable(-289, -285, 27, 28, -8, 12);
  world_addTable(-289, -285, 29, 32, -8, 12);

  world_addTable(-274, -270, 27, 28, -8, 12);
  world_addTable(-274, -270, 29, 32, -8, 12);

  world_addTable(-289, -285, 27, 28, 19, 45);
  world_addTable(-289, -285, 29, 32, 19, 45);

  world_addTable(-274, -270, 27, 28, 19, 45);
  world_addTable(-274, -270, 29, 32, 19, 45);

  // x tables
  world_addTable(-262, -242, 27, 28, 3, 7);
  world_addTable(-262, -242, 29, 32, 3, 7);

  world_addTable(-262, -242, 27, 28, 18, 22);
  world_addTable(-262, -242, 29, 32, 18, 22);

  // door
  world_addDoor(-252, -249, 27, 33, 50, 50);
  


  // -------------------- DIRT TUNNEL --------------------

  
 
  world_addTunnel(-241, -141, 26, 16, -3, 5);
  world_addTunnel(-140, -101, 16, 11, 5, -5);
  world_addTunnel(-100, -82, 11, 19, -5, 5);
  world_addTunnel(-81, -61, 19, 9, 5, 0);
  world_addTunnel(-60, -51, 9, 9, 0, 0);

  // -------------------- SHORT TUNNEL --------------------

  // floor
  world_addPlane(-50, -31, 10, 10, -2, 2, TEXTURES_MOSSY_STONE);
  world_addPlane(-61, -51, 10, 10, -2, 2, TEXTURES_DIRT);

  // walls
  world_addPlane(-50, -16, 11, 18, 3, 3, TEXTURES_MOSSY_BRICK);
  world_addPlane(-50, -16, 11, 18, -3, -3, TEXTURES_MOSSY_BRICK);

  // sides
  world_addPlane(-50, -50, 11, 18, -4, -4, TEXTURES_MOSSY_BRICK);
  world_addPlane(-50, -50, 11, 18, 4, 4, TEXTURES_MOSSY_BRICK);

  // ceiling
  world_addPlane(-50, -15, 18, 18, -2, 2, TEXTURES_ROTTING_WOOD);


  // -------------------- FIRST MONSTER ROOM  --------------------


  world_addRoom(-20, 60, -1, 10, -30, 30);

  world_addPillars(-20, 60, 0, 9, -30, 30);
  
  // broken pole
  // world_addPlane(9, 11, 0, 0, 9, 11, TEXTURES_STONE);
  // world_addPlane(10, 10, 1, 3, 10, 10, TEXTURES_STONE);
  // world_addPlane(7, 11, 0, 0, 5, 5, TEXTURES_STONE);
  // world_addPlane(9, 11, 9, 9, 9, 11, TEXTURES_STONE);


  // cut out step doorway
  world_removePlane(-20, -20, 0, 10, -2, 2);
  // cut out step top
  world_removePlane(-20, -15, 10, 10, -2, 2);

  // steps
  world_addSlope(-30, -20, 10, -2, 2);
  // sloped ceiling
  world_addSlope(-22, -14, 18, -2, 2);
  // steps walls
  world_addPlane(-30, -20, 0, 10, -3, -3, TEXTURES_MOSSY_BRICK);
  world_addPlane(-30, -20, 0, 10, 3, 3, TEXTURES_MOSSY_BRICK);

  // table for health
  world_addTable(20, 30, 0, 2, -29, -26);


  // -------------------- PLATFORM ROOM  --------------------

  world_addRoom(69, 100, -10, 17, -20, 20);

  world_addDoorwayZ(60, 0, 0);
  

  //world_addPlane(60, 66, -1, -1, -2, 2, TEXTURES_MOSSY_STONE);

  world_addSlope(60, 68, -1, -2, 2);

  // stairs sides
  world_addPlane(61, 68, -9, 7, -3, -3, TEXTURES_MOSSY_BRICK);
  world_addPlane(61, 68, -9, 7, 3, 3, TEXTURES_MOSSY_BRICK);
  // stairs ceiling
  world_addPlane(61, 69, 7, 7, -3, 3, TEXTURES_ROTTING_WOOD);

  world_removePlane(69, 69, -9, 6, -2, 2);

  world_addPillar(92, -9, -15, 3);
  world_addPillar(95, -9, -3, 6);
  world_addPillar(90, -9, 9, 9);
  world_addPillar(80, -9, 5, 12);
  world_addPillar(77, -9, -5, 14);
  world_addPillar(80, -9, -19, 15);

  //world_addPillar(75, -9, -19, 16);

  

  // -------------------- HALLWAY  --------------------

  world_addRoom(77, 83, 6, 15, -220, -20);
  world_addDoorwayX(80, 7, -20);
  world_addPlane(78, 82, 7, 17, -25, -25, TEXTURES_INVISIBLE);
  world_addPlane(78, 82, 7, 17, -185, -185, TEXTURES_INVISIBLE);
  world_addTable(78, 82, 7, 9, -219, -217);
  

  // -------------------- SECOND TUNNEL  --------------------

  world_removeTunnelEntrance(77, 10, -200);

  

  world_addTunnel(72, 77, 5, 5, -200, -200);
  world_addTunnel(20, 72, 0, 5, -220, -200);
  world_addTunnel(-20, 20, -5, 0, -230, -220);
  world_addTunnel(-40, -20, -10, -5, -230, -230);
  world_addTunnel(-80, -40, -14, -10, -226, -230);
  
  world_addRoom(-110, -85, -15, 0, -240, -210);
  world_addTunnel(-85, -80, -15, -14, -226, -226);

  


  // -------------------- HOLE ROOM  --------------------

  world_removeTunnelEntrance(-85, -10, -226);

  world_addPlane(-103, -96, -14, -14, -229, -222, TEXTURES_STONE);

  world_addPillar(-108, -14, -238, 13);
  world_addPillar(-108, -14, -212, 13);
  world_addPillar(-87, -14, -238, 13);
  world_addPillar(-87, -14, -212, 13);

  world_removePlane(-102, -97, -15, -14, -228, -223);

  // -------------------- BOSS ROOM  --------------------


  world_addPlane(-200, 0, -100, -100, -326, -126, TEXTURES_BLOOD_STONE);

  //world_addPillar(-100, -99, -225, 7);

  for (let x=-2; x<=2; x++) {
    for (let z=-2; z<=2; z++) {
      let xOffset = Math.random() * 5 - 2.5;
      let zOffset = Math.random() * 5 - 2.5;
      let heightOffset = Math.random() * 5 - 2.5;

      if (x===0 && z===0) {
        xOffset = 0;
        zOffset = 0;
      }

      let pillarX = Math.round(-100+ x*12 + xOffset);
      let pillarZ = Math.round(-225+ z*12 + zOffset);
      let pillarHeight = Math.round(9 + heightOffset);

      world_addPillar(pillarX, -101, pillarZ, pillarHeight);

    }
  }

}

// utils

function world_removeTunnelEntrance(x, y, z) {
  world_removePlane(x, x, y-4, y+4, z-3, z+3);
  world_removePlane(x, x, y-3, y+3, z-4, z+4);
}
function world_addDoorwayX(x, y, z) {
  world_addPlane(x-3, x+3, y, y+7, z, z, TEXTURES_ROTTING_WOOD);
  world_removePlane(x-2, x+2, y, y+6, z, z);
}

function world_addDoorwayZ(x, y, z) {
  world_addPlane(x, x, y, y+7, z-3, z+3, TEXTURES_ROTTING_WOOD);
  world_removePlane(x, x, y, y+6, z-2, z+2);
}

function world_addPillar(x, y, z, height) {
  world_addPole(x-1, y, z, height);
  world_addPole(x+1, y, z, height);
  world_addPole(x, y, z-1, height);
  world_addPole(x, y, z+1, height);
}

function world_addPillars(startX, endX, startY, endY, startZ, endZ) {
  for (let x = startX+20; x<endX; x+=20) {
    for (let z = startZ+20; z<endZ; z+=20) {
      world_addPillar(x, startY, z, endY-startY);
    }
  }
}

function world_addDoor(startX, endX, startY, endY, startZ, endZ) {
  world_addPlane(startX-1, endX+1, startY, endY+1, startZ, endZ, TEXTURES_ROTTING_WOOD);
  world_addPlane(startX, endX, startY, endY, startZ, endZ, TEXTURES_DIRTY_GRAY);
  world_addBlock(startX, startY + Math.round((endY-startY)/2), startZ, TEXTURES_DOOR_KNOB);
}

function world_addTable(startX, endX, startY, endY, startZ, endZ) {
  // invisble 
  world_addPlane(startX, endX, startY, endY, startZ, endZ, TEXTURES_INVISIBLE);

  // legs
  world_addPlane(startX, startX, startY, endY-1, startZ, startZ, TEXTURES_STONE);
  world_addPlane(endX, endX, startY, endY-1, startZ, startZ, TEXTURES_STONE);
  world_addPlane(startX, startX, startY, endY-1, endZ, endZ, TEXTURES_STONE);
  world_addPlane(endX, endX, startY, endY-1, endZ, endZ, TEXTURES_STONE);

  // table top
  world_addPlane(startX, endX, endY, endY, startZ, endZ, TEXTURES_ROTTING_WOOD);

}

function world_addPole(x, y, z, height) {
  world_addPlane(x-1, x+1, y, y, z-1, z+1, TEXTURES_STONE);
  world_addPlane(x, x, y, y+height, z, z, TEXTURES_STONE);
  world_addPlane(x-1, x+1, y+height, y+height, z-1, z+1, TEXTURES_STONE);
}

function world_addSlope(startX, endX, endY, startZ, endZ) {
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
    let y = Math.round(startY + (((x - startX) / diffX) * diffY));
    let z = Math.round(startZ + (((x - startX) / diffX) * diffZ));

    world_addRing(x, y, z);
  }
}

function world_addRoom(startX, endX, startY, endY, startZ, endZ) {
  // floor
  world_addPlane(startX, endX, startY, startY, startZ, endZ, TEXTURES_MOSSY_STONE);

  // ceiling
  world_addPlane(startX, endX, endY, endY, startZ, endZ, TEXTURES_ROTTING_WOOD);

  // walls
  world_addPlane(startX, endX, startY, endY, endZ, endZ, TEXTURES_MOSSY_BRICK);
  world_addPlane(startX, endX, startY, endY, startZ, startZ, TEXTURES_MOSSY_BRICK);
  world_addPlane(startX, startX, startY, endY, startZ, endZ, TEXTURES_MOSSY_BRICK);
  world_addPlane(endX, endX, startY, endY, startZ, endZ, TEXTURES_MOSSY_BRICK);
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
  if (world[x] && world[x][y] && world[x][y][z]) {
    delete world[x][y][z];
  }
}

function world_buildBuffers() {
  let rawBuffers = {};

  for (let x in world) {
    for (let y in world[x]) {
      for (let z in world[x][y]) {
        let block = world[x][y][z];
        let texture = block.texture;

        if (texture === TEXTURES_INVISIBLE) {
          continue;
        }

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
        let randomOffset = texture === TEXTURES_DIRT ? 0 : (Math.random() - 0.5) * 0.1;

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
  x = Math.round(x);
  y = Math.round(y);
  z = Math.round(z);

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

// use ray tracing to find collisions
function world_moveObject(object, xChange, yChange, zChange) {
  
  let newX = object.x;
  let newY = object.y;
  let newZ = object.z;

  

  // y movement
  let yChangeAbs = Math.abs(yChange);
  let ySign = Math.sign(yChange);
  let yOffset = yChange > 0 ? PLAYER_HEIGHT : 0;

  // down movement
  
  for (let y=0; y<yChangeAbs+RAY_TRACE_INCREMENT; y+=RAY_TRACE_INCREMENT) {
    if (y > yChangeAbs) {
      y = yChangeAbs;
    }
    let block = world_getBlock(object.x, object.y + y*ySign + yOffset, object.z);
    if (block) {
      object.upVelocity = 0;

      // if landed on block
      if (yChange < 0) {
        object.isAirborne = false;
      }
      
      break;
    }
    else {
      newY = object.y + y*ySign;
    }
  }
  

  // x movement
  let xChangeAbs = Math.abs(xChange);
  let xSign = Math.sign(xChange);
  for (let x=0; x<xChangeAbs+RAY_TRACE_INCREMENT; x+=RAY_TRACE_INCREMENT) {
    if (x > xChangeAbs) {
      x = xChangeAbs;
    }
    let block = world_getBlock(object.x + x*xSign + 0.5*xSign, newY, object.z);
    if (block) {
      // handle auto up step
      let blockAboveStep = world_getBlock(object.x + x*xSign + 0.5*xSign, newY+1, object.z);
      if (!blockAboveStep) {
        newY += 1;
      }

      break;
    }
    else {
      newX = object.x + x*xSign;
    }


  }

  // z movement
  let zChangeAbs = Math.abs(zChange);
  let zSign = Math.sign(zChange);
  for (let z=0; z<zChangeAbs+RAY_TRACE_INCREMENT; z+=RAY_TRACE_INCREMENT) {
    if (z > zChangeAbs) {
      z = zChangeAbs;
    }
    let block = world_getBlock(newX, newY, object.z + z*zSign + 0.5*zSign);
    if (block) {
      // handle auto up step
      let blockAboveStep = world_getBlock(newX, newY+1, object.z + z*zSign + 0.5*zSign);
      if (!blockAboveStep) {
        newY += 1;
      }

      break;
    }
    else {
      newZ = object.z + z*zSign;
    }
  }

  object.x = newX;
  object.y = newY;
  object.z = newZ;


  
}
