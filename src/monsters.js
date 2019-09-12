let MONSTER_CUBES = [
  0, 1.3, 0.3, 0.5, 2, 0.5, // left leg
  0, 1.3, -0.3, 0.5, 2, 0.5, // right leg
  -0.2, 0.1, 0.3, 0.8, 0.3, 0.5, // left foot
  -0.2, 0.1, -0.3, 0.8, 0.3, 0.5, // right foot
  0, 2.7, 0, 0.7, 1.4, 1, // body
  0, 3.3, 0, 0.4, 0.4, 0.4, // neck
  0, 3.9, 0, 0.8, 0.6, 0.8, // head 1
  0, 3.9, 0, 0.6, 0.8, 0.6, // head 2
  -0.8, 3, 0.65, 1.8, 0.35, 0.35, // left arm
  -0.8, 3, -0.65, 1.8, 0.35, 0.35, // right arm

  -1.8, 3, 0.8, 0.3, 0.35, 0.1, // left fingers
  -1.8, 3, -0.8, 0.3, 0.35, 0.1, // right fingers
  
  -1.8, 3.1, 0.6, 0.3, 0.1, 0.1, // left thumb
  -1.8, 3.1, -0.6, 0.3, 0.1, 0.1 // right thumb
];

function monsters_init() {
  monsters = [];
  monstersKilled = 0;
}

function monsters_hurt(id) {
  monsters.forEach(function(monster) {
    if (monster.id === id) {
      monster.painFlash = PAIN_FLASH_DURATION;
      monster.health -= 1;
      let xDiff = monster.x - player.x;
      let zDiff = monster.z - player.z;
      let dist = Math.sqrt(xDiff * xDiff + zDiff * zDiff);

      // knockback if not the boss
      if (!monster.isBoss) {
        world_moveObject(monster, 5*xDiff/dist, 0, 5*zDiff/dist);
      }

      soundEffects_play(SOUND_EFFECTS_HIT, 0.3);
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
          soundEffects_play(SOUND_EFFECTS_MONSTER_DIE);
          monsters.splice(n, 1);
          monstersKilled++;

          if (monster.isBoss) {
            game_win();
          }
        }
      }
    }
  }); 
}

function monsters_add(x, y, z, isBoss) {
  monsters.push({
    x: x,
    y: y,
    z: z,
    startY: y,
    painFlash: 0,
    health: isBoss ? 60 : 4,
    yaw: 0,
    attackCooldown: 0,
    turnFrequency: 0.001 + Math.random() * 0.001,
    bobbleOffset: Math.random() * 2 * Math.PI,
    bobble: 0,
    upVelocity: 0,
    isAirborne: false,
    stepPending: false,
    isBoss: !!isBoss,
    id: utils_generateId()
  });
}

function monsters_spawn(batch) {
  if (ENABLE_MONSTERS) {
    if (batch == 0) {
      // 4
      monsters_add(-10, 0, -28, false);
      monsters_add(-10, 0, 28, false);
      monsters_add(58, 0, -28, false);
      monsters_add(58, 0, 28, false);
    }
    else if (batch === 1) {
      // 6
      monsters_add(85, -9, 15, false);
      monsters_add(85, -9, -15, false);
      monsters_add(75, -9, 15, false);
      monsters_add(75, -9, -15, false);
      monsters_add(95, -9, 15, false);
      monsters_add(95, -9, -15, false);
    }
    // 12
    else if (batch === 2) {
      for (let n=0; n<12; n++) {
        let xOffset = 2 * Math.random();
        let zOffset = 20 * Math.random();
        monsters_add(80 + xOffset, 7, -140 + zOffset, false);
      }
     
    }
    // final boss
    else if (batch === 3) {
      // center is -100, -99, -226
      monsters_add(-170, -98, -230, true);
    }

    monsters_buildBuffers();
  }
  soundEffects_play(SOUND_EFFECTS_MONSTER_SPAWN);
}

function monsters_update() {
  

  monsters.forEach(function(monster) {
    let speed = monster.isBoss ? 3 : 4.5;
    let distEachFrame = speed * elapsedTime / 1000;
    let monsterAttackDist = monster.isBoss ? (MONSTER_ATTACK_DIST * 2) : MONSTER_ATTACK_DIST;

    // tan(theta) = o/a
    let xDiff = monster.x - player.x;
    let yDiff = monster.isBoss ? 0 : (monster.y - player.y);
    let zDiff = monster.z - player.z;
    let theta = Math.atan2(zDiff, xDiff);
    let thetaDiff = monster.yaw - theta;

    // point directly at player
    let yaw = monster.yaw - thetaDiff;

    let yawOffset = 0.5 * Math.sin(now * monster.turnFrequency);
    yaw += yawOffset;

    let playerMonsterDist = Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);

    // random jump
    if (!monster.isAirborne && Math.random() < 0.05) {
      monster.upVelocity = 20;
      monster.isAirborne = true;
      

      if (monster.isBoss) {
        soundEffects_play(SOUND_EFFECTS_BOSS_JUMP);
      }
      else {
        let volume = 0.5 * monsterAttackDist / playerMonsterDist;
        soundEffects_play(SOUND_EFFECTS_MONSTER_JUMP, volume);
      }
      
    }


    
    if (playerMonsterDist > monsterAttackDist) {
      let newMonsterXDiff = -1 * distEachFrame * Math.cos(yaw);
      // handle gravity
      monster.upVelocity += GRAVITY * elapsedTime / 1000;
      let newMonsterYDiff = monster.upVelocity * elapsedTime / 1000;
      //newMonsterYDiff += (0.2 * Math.sin(now * 0.02 + monster.bobbleOffset));
      let newMonsterZDiff = -1 * distEachFrame * Math.sin(yaw);

      // if boss, constrain y movement, but not x and y because he gets stuck on pillars
      if (monster.isBoss) {
        world_moveObject(monster, 0, newMonsterYDiff, 0);
        monster.x += newMonsterXDiff;
        monster.z += newMonsterZDiff;
      }
      else {
        world_moveObject(monster, newMonsterXDiff, newMonsterYDiff, newMonsterZDiff);
      }
      


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
  hudDirty = true;
  soundEffects_play(SOUND_EFFECTS_HIT, 0.5);

}

function monsters_buildBuffers() {
  monsters.forEach(function(monster) {
    let position = [];
    let color = [];
    let normal = [];
    let texture = [];
    let index = [];
    let numBlocks = 0;
    let scale = monster.isBoss ? 10 : 1;

    for (let n=0; n<MONSTER_CUBES.length; n+=6) {
      let x = MONSTER_CUBES[n] * scale;
      let y = MONSTER_CUBES[n+1] * scale;
      let z = MONSTER_CUBES[n+2] * scale;
      let xSize = MONSTER_CUBES[n+3] * scale;
      let ySize = MONSTER_CUBES[n+4] * scale;
      let zSize = MONSTER_CUBES[n+5] * scale;

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
 
    modelView_save();
    mat4.translate(mvMatrix, [2 * monster.x, 2 * monster.y, 2 * monster.z]);
    mat4.rotate(mvMatrix, -monster.yaw, [0, 1, 0]);
    scene_render(monster.buffers, textures[texture].glTexture);
    hit_render(monster.hitBuffers);
    modelView_restore();
  });
}