function monsters_init() {
  monsters_buildModel();
}

function monsters_hurt(groupId) {
  monsters.forEach(function(monster) {
    if (monster.group === groupId) {
      monster.type = 'white';
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
        monster.type = monster.originalType;

        if (monster.health === 0) {
          console.log('monster dead');
        }
      }
    }
  }); 
}



function monsters_buildModel() {
  let groupId = utils_generateId();

  // right leg
  monsters_add(0, 0, 0.3, 0.5, 3, 0.5, groupId, 'burned-stone');
  // right foot
  monsters_add(-0.4, -0.4, 0.3, 0.5, 0.3, 0.5, groupId, 'burned-stone');

  // left leg
  monsters_add(0, 0, -0.3, 0.5, 3, 0.5, groupId, 'burned-stone');
  // left foot
  monsters_add(-0.4, -0.4, -0.3, 0.5, 0.3, 0.5, groupId, 'burned-stone');

  // body
  monsters_add(0, 2, 0, 0.8, 1.5, 1, groupId, 'burned-stone');

  // neck
  monsters_add(0, 2.8, 0, 0.4, 0.4, 0.4, groupId, 'burned-stone');

  // head
  monsters_add(0, 3.4, 0, 0.8, 0.8, 0.8, groupId, 'burned-stone');

  // right arm
  monsters_add(-0.8, 2.5, 0.65, 2, 0.3, 0.3, groupId, 'burned-stone');

  // left arm
  monsters_add(-0.8, 2.5, -0.65, 2, 0.3, 0.3, groupId, 'burned-stone');

}

function monsters_add(x, y, z, xSize, ySize, zSize, groupId, type) {
  monsters.push({
    x: x,
    y: y,
    z: z,
    originalType:  type,
    type: type,
    group: groupId,
    painFlash: 0,
    health: 3,
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
  monsterBuffers = {};

  monsters.forEach(function(monster) {
    let type = monster.type;

    if (monsterBuffers[type] === undefined) {
      monsterBuffers[type] = [
        {
          position: [],
          normal: [],
          texture: [],
          index: [],
          numBlocks: 0
        }
      ];
    }

    let lastBuffer = monsterBuffers[type][monsterBuffers[type].length-1];

    // position buffer
    for (n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
      lastBuffer.position.push(CUBE_BUFFERS.position[n]*monster.xSize + monster.x*2);
      lastBuffer.position.push(CUBE_BUFFERS.position[n+1]*monster.ySize + monster.y*2);
      lastBuffer.position.push(CUBE_BUFFERS.position[n+2]*monster.zSize + monster.z*2);
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
  })

  // convert regular arrays to webgl buffers
  for (let type in monsterBuffers) {
    monsterBuffers[type].forEach(function(buffer) {
      buffer.position = webgl_createArrayBuffer(buffer.position);
      buffer.normal = webgl_createArrayBuffer(buffer.normal);
      buffer.texture = webgl_createArrayBuffer(buffer.texture);
      buffer.index = webgl_createElementArrayBuffer(buffer.index);
    });
  }
  
}

function monsters_render() {
  for (let type in monsterBuffers) {
    monsterBuffers[type].forEach(function(buffer) {
      webgl_render(buffer, textures[type].glTexture);
    });
  }  
}