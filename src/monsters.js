function monsters_init() {
  monsters_buildModel();
}

function monsters_buildModel() {
  monsters = [
    {
      x: 0,
      y: 0,
      z: 0,
      type: 'burned-stone'
    }
  ];
}

function monsters_update() {
  let distEachFrame = MONSTER_SPEED * elapsedTime / 1000;

  monsters[0].x += distEachFrame;

  // now have to rebuild and bind buffers...
  monsters_buildBuffers();
}

function monsters_buildBuffers() {
  monsterBuffers = {};

  for (let n=0; n<monsters.length; n++) {
    let monster = monsters[n];
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
  }

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