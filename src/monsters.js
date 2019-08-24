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

  monsters = [
    {
      x: 0,
      y: 0,
      z: 0,
      originalType:  'burned-stone',
      type: 'burned-stone',
      group: groupId,
      painFlash: 0,
      health: 3
    },
    {
      x: 0,
      y: 1,
      z: 0,
      originalType:  'burned-stone',
      type: 'burned-stone',
      group: groupId,
      painFlash: 0,
      health: 3
    }
  ];
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
      lastBuffer.position.push(CUBE_BUFFERS.position[n] + monster.x*2);
      lastBuffer.position.push(CUBE_BUFFERS.position[n+1] + monster.y*2);
      lastBuffer.position.push(CUBE_BUFFERS.position[n+2] + monster.z*2);
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