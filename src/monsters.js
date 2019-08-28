function monsters_init() {
  monsters_buildModel();
}

function monsters_hurt(groupId) {
  monsters.forEach(function(monster) {
    if (monster.group === groupId) {
      monster.texture = 'blood-stone';
      monster.painFlash = PAIN_FLASH_DURATION;
      monster.health -= 1;
    }
  }); 
}

function monsters_restore() {
  monsters.forEach(function(monster) {
    if (monster.painFlash > 0) {
      monster.painFlash -= elapsedTime;
      if (monster.painFlash <= 0) {
        monster.painFlash = 0;
        monster.texture = monster.originalTexture;

        if (monster.health === 0) {
          soundEffects.play('monster-die');
        }
      }
    }
  }); 
}



function monsters_buildModel() {
  let groupId = utils_generateId();

  // right leg
  monsters_add(0, 0, 0.3, 0.5, 3, 0.5, groupId, TEXTURES_BURNED_STONE);
  // right foot
  monsters_add(-0.4, -0.4, 0.3, 0.5, 0.3, 0.5, groupId, TEXTURES_BURNED_STONE);

  // left leg
  monsters_add(0, 0, -0.3, 0.5, 3, 0.5, groupId, TEXTURES_BURNED_STONE);
  // left foot
  monsters_add(-0.4, -0.4, -0.3, 0.5, 0.3, 0.5, groupId, TEXTURES_BURNED_STONE);

  // body
  monsters_add(0, 2, 0, 0.8, 1.5, 1, groupId, TEXTURES_BURNED_STONE);

  // neck
  monsters_add(0, 2.8, 0, 0.4, 0.4, 0.4, groupId, TEXTURES_BURNED_STONE);

  // head
  monsters_add(0, 3.4, 0, 0.8, 0.8, 0.8, groupId, TEXTURES_BURNED_STONE);

  // right arm
  monsters_add(-0.8, 2.5, 0.65, 2, 0.35, 0.35, groupId, TEXTURES_BURNED_STONE);

  // left arm
  monsters_add(-0.8, 2.5, -0.65, 2, 0.35, 0.35, groupId, TEXTURES_BURNED_STONE);

}

function monsters_add(x, y, z, xSize, ySize, zSize, groupId, texture) {
  monsters.push({
    x: x,
    y: y,
    z: z,
    originalTexture: texture,
    texture: texture,
    group: groupId,
    painFlash: 0,
    health: 6,
    xSize: xSize,
    ySize: ySize,
    zSize: zSize
  }); 
}

function monsters_getHit() {
  return 0;
}

function monsters_update() {
  let distEachFrame = MONSTER_SPEED * elapsedTime / 1000;

  //monsters[0].x += distEachFrame;

  monsters_restore();

  // now have to rebuild and bind buffers...
  monsters_buildBuffers();
}

function monsters_buildBuffers() {
  rawBuffers = {};

  monsters.forEach(function(monster) {
    let texture = monster.texture;

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

    // position buffer
    for (n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
      lastBuffer.position.push(CUBE_BUFFERS.position[n]*monster.xSize + monster.x*2);
      lastBuffer.position.push(CUBE_BUFFERS.position[n+1]*monster.ySize + monster.y*2);
      lastBuffer.position.push(CUBE_BUFFERS.position[n+2]*monster.zSize + monster.z*2);
    }

    // color buffer
    for (n = 0; n < CUBE_BUFFERS.index.length; n++) {
      lastBuffer.color.push(1);
      lastBuffer.color.push(0);
      lastBuffer.color.push(0);
    }

    // normal buffer
    utils_concat(lastBuffer.normal, CUBE_BUFFERS.normal);

    // texture buffer
    utils_concat(lastBuffer.texture, CUBE_BUFFERS.texture);

    // index buffer
    for (n = 0; n < CUBE_BUFFERS.index.length; n++) {
      lastBuffer.index.push(CUBE_BUFFERS.index[n] + (24 * lastBuffer.numBlocks));
    }

    lastBuffer.numBlocks++;
  });

  // convert regular arrays to webgl buffers
  monsterBuffers = {};
  monsterHitBuffers = {};
  for (let texture in rawBuffers) {
    monsterBuffers[texture] = [];
    monsterHitBuffers[texture] = [];

    rawBuffers[texture].forEach(function(buffer) {
      monsterBuffers[texture].push({
        position: webgl_createArrayBuffer(sceneContext, buffer.position),
        normal: webgl_createArrayBuffer(sceneContext, buffer.normal),
        texture: webgl_createArrayBuffer(sceneContext, buffer.texture),
        index: webgl_createElementArrayBuffer(sceneContext, buffer.index)
      });

      monsterHitBuffers[texture].push({
        position: webgl_createArrayBuffer(hitContext, buffer.position),
        color: webgl_createArrayBuffer(hitContext, buffer.color),
        index: webgl_createElementArrayBuffer(hitContext, buffer.index)
      });
    });
  }
  
}

function monsters_render() {
  for (let texture in monsterBuffers) {
    monsterBuffers[texture].forEach(function(buffer) {
      scene_render(buffer, textures[texture].glTexture);
    });
  }  

  for (let texture in monsterHitBuffers) {
    monsterHitBuffers[texture].forEach(function(buffer) {
      hit_render(buffer);
    });
  } 
}