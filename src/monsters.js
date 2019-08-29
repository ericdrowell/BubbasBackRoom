const MONSTER_CUBES = [
  0, 0, 0.3, 0.5, 3, 0.5, // right leg
  -0.4, -0.4, 0.3, 0.5, 0.3, 0.5, // right foot
  0, 0, -0.3, 0.5, 3, 0.5, // left leg
  -0.4, -0.4, -0.3, 0.5, 0.3, 0.5, // left foot
  0, 2, 0, 0.8, 1.5, 1, // body
  0, 2.8, 0, 0.4, 0.4, 0.4, // neck
  0, 3.4, 0, 0.8, 0.8, 0.8, // head
  -0.8, 2.5, 0.65, 2, 0.35, 0.35, // right arm
  -0.8, 2.5, -0.65, 2, 0.35, 0.35 // left arm
];

function monsters_init() {
  monsters_buildModel();
}

function monsters_hurt(id) {
  monsters.forEach(function(monster) {
    if (monster.id === id) {
      monster.painFlash = PAIN_FLASH_DURATION;
      monster.health -= 1;
    }
  }); 
}

function monsters_restore() {
  monsters.forEach(function(monster, n) {
    if (monster.painFlash > 0) {
      monster.painFlash -= elapsedTime;
      if (monster.painFlash <= 0) {
        monster.painFlash = 0;
        if (monster.health === 0) {
          soundEffects.play('monster-die');
          monsters_remove(n);
        }
      }
    }
  }); 
}

function monsters_remove(index) {
  monsters.splice(index, 1);
}

function monsters_buildModel() {
  monsters.push({
    x: 0,
    y: 0,
    z: 0,
    painFlash: 0,
    health: 6,
    id: utils_generateId()
  });

  monsters.push({
    x: 0,
    y: 0,
    z: 5,
    painFlash: 0,
    health: 6,
    id: utils_generateId()
  });
}

function monsters_update() {
  let distEachFrame = MONSTER_SPEED * elapsedTime / 1000;

  monsters.forEach(function(monster) {
    if (monster.id === 0) {
      monster.x -= distEachFrame;
    }
    else if (monster.id === 1) {
      monster.z -= distEachFrame;
    }
  });

  monsters_restore();

  // now have to rebuild and bind buffers...
  monsters_buildBuffers();
}

function monsters_buildBuffers() {
  monsters.forEach(function(monster) {
    let position = [];
    let color = [];
    let normal = [];
    let texture = [];
    let index = [];
    let numBlocks = 0;

    for (let n=0; n<MONSTER_CUBES.length; n+=6) {
      let x = MONSTER_CUBES[n];
      let y = MONSTER_CUBES[n+1];
      let z = MONSTER_CUBES[n+2];
      let xSize = MONSTER_CUBES[n+3];
      let ySize = MONSTER_CUBES[n+4];
      let zSize = MONSTER_CUBES[n+5];

      // position buffer
      for (let n = 0; n < CUBE_BUFFERS.position.length; n+=3) {
        position.push(CUBE_BUFFERS.position[n]*xSize + x*2);
        position.push(CUBE_BUFFERS.position[n+1]*ySize + y*2);
        position.push(CUBE_BUFFERS.position[n+2]*zSize + z*2);
      }

      // color buffer
      for (let n = 0; n < CUBE_BUFFERS.index.length; n++) {
        color.push(1);
        color.push(monster.id/255);
        color.push(0);
      }

      // normal buffer
      utils_concat(normal, CUBE_BUFFERS.normal);

      // texture buffer
      utils_concat(texture, CUBE_BUFFERS.texture);

      // index buffer
      for (let n = 0; n < CUBE_BUFFERS.index.length; n++) {
        index.push(CUBE_BUFFERS.index[n] + (24 * numBlocks));
      }

      monster.buffers = {
        position: webgl_createArrayBuffer(sceneContext, position),
        normal: webgl_createArrayBuffer(sceneContext, normal),
        texture: webgl_createArrayBuffer(sceneContext, texture),
        index: webgl_createElementArrayBuffer(sceneContext, index)
      };

      monster.hitBuffers = {
        position: webgl_createArrayBuffer(hitContext, position),
        color: webgl_createArrayBuffer(hitContext, color),
        index: webgl_createElementArrayBuffer(hitContext, index)
      };

      numBlocks++;
    };
  });
}

function monsters_render() {
  monsters.forEach(function(monster) {
    let texture = monster.painFlash > 0 ? TEXTURES_BLOOD_STONE : TEXTURES_BURNED_STONE;
 
    let x = monster.x;
    let y = monster.y;
    let z = monster.z;

    mat4.translate(mvMatrix, [x, y, z]);
    scene_render(monster.buffers, textures[texture].glTexture);
    hit_render(monster.hitBuffers);
    mat4.translate(mvMatrix, [-x, -y, -z]);

  });
}