let MONSTER_CUBES = [
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
  monsters = [];
  monsterKills = 0;
  monsterBatch = 0;
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
        if (monster.health <= 0) {
          soundEffects.play('monster-die');
          monsters_remove(n);
          monsterKills++;
        }
      }
    }
  }); 
}

function monsters_remove(index) {
  monsters.splice(index, 1);
}

function monsters_spawn() {
  console.log('spawn monster batch ' + monsterBatch);
  monsters.push({
    x: 0,
    y: 0,
    z: 10,
    painFlash: 0,
    health: 6,
    yaw: MATH_PI * 0.5,
    attackCooldown: 0,
    seed: MATH_RANDOM(),
    id: utils_generateId()
  });

  monsters.push({
    x: 0,
    y: 0,
    z: 5,
    painFlash: 0,
    health: 6,
    yaw: 0,
    attackCooldown: 0,
    seed: MATH_RANDOM(),
    id: utils_generateId()
  });

  monsterBatch++;
}

function monsters_update() {
  if (monsterBatch === 0 && player.x > -55) {
    monsters_spawn();
  }



  let distEachFrame = MONSTER_SPEED * elapsedTime / 1000;
  //let maxThetaEachFrame = MONSTER_TURN_SPEED * elapsedTime / 1000;
  //let yawOffset = 1 * MATH_SIN(elapsedTime * 0.1);

  monsters.forEach(function(monster) {
    // tan(theta) = o/a
    let xDiff = monster.x - player.x;
    let yDiff = monster.y - player.y;
    let zDiff = monster.z - player.z;
    let theta = MATH_ATAN2(zDiff, xDiff);
    let thetaDiff = monster.yaw - theta;

    // if (thetaDiff > maxThetaEachFrame) {
    //   thetaDiff = maxThetaEachFrame;
    // }


    //if (thetaDiff >= 0) {
      //thetaDiff = thetaDiff > maxThetaEachFrame ? maxThetaEachFrame : thetaDiff;
    // }
    // else {
    //   thetaDiff = thetaDiff < -1 * maxThetaEachFrame ? -1 * maxThetaEachFrame : thetaDiff;
    // }


    // point directly at player
    let yaw = monster.yaw - thetaDiff;

    let yawOffset = 0.5 * MATH_SIN(now * 0.001);
    yaw += yawOffset;


    let playerMonsterDist = MATH_SQRT(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
    if (playerMonsterDist > MONSTER_ATTACK_DIST) {
      let newPlayerXDiff = -1 * distEachFrame * MATH_COS(yaw);
      let newPlayerZDiff = -1 * distEachFrame * MATH_SIN(yaw);
      monster.x += newPlayerXDiff;
      monster.z += newPlayerZDiff;
    }
    else {
      if (monster.attackCooldown === 0) {
        monsters_attack(monster.id);
      }
    }

    monster.yaw = yaw;

    // attack cooldown
    if (monster.attackCooldown > 0) {
      monster.attackCooldown -= elapsedTime/1000;
      if (monster.attackCooldown < 0) {
        monster.attackCooldown = 0;
      }
    }

  });

  monsters_restore();

  // now have to rebuild and bind buffers...
  monsters_buildBuffers();
}

function monsters_getById(id) {
  for (let n=0; n<monsters.length; n++) {
    let monster = monsters[n];
    if (monster.id === id) {
      return monster;
    }
  }

  return -1;
}

function monsters_attack(id) {
  let monster = monsters_getById(id);
  monster.attackCooldown = MONSTER_ATTACK_COOLDOWN;
  playerHurting = PLAYER_PAIN_FLASH_DURATION;
  player.health -= 1;
  soundEffects.play('hit', 0.5);

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
    let texture = monster.painFlash > 0 ? TEXTURES_BLOOD_STONE : TEXTURES_MUMMY_WRAP;
 
    modelView_save();
    mat4.translate(mvMatrix, [2 * monster.x, 2 * monster.y, 2 * monster.z]);
    mat4.rotate(mvMatrix, -monster.yaw, [0, 1, 0]);
    
    

    scene_render(monster.buffers, textures[texture].glTexture);
    hit_render(monster.hitBuffers);

    modelView_restore();

    
    
    // mat4.rotate(mvMatrix, monster.yaw, [0, 1, 0]);
    // mat4.translate(mvMatrix, [-x, -y, -z]);
    

  });
}