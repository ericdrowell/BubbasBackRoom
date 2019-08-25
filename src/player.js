function player_init() {
  player = {
health: 7,
pitch: -0.06283185307179555,
sideMovement: 0,
straightMovement: 0,
x: -37.03350517035815,
y: 11,
yaw: 7.84676910934451,
z: 0.05602293866959278
  };

  flashTimeRemaining = 0;
}

function player_move(xChange, yChange, zChange) {
  player.x += xChange;
  player.y += yChange;
  player.z += zChange;

  let playerBlock = world_getPlayerBlock();

  // if moving forward
  if (zChange > 0) {
    let blockFront = world_getBlockFront(playerBlock);
    if (blockFront) {
      player_move(0, 0, blockFront.z - 1 - player.z);
    }
  }

  // if moving backward
  if (zChange < 0) {
    let blockBack = world_getBlockBack(playerBlock);
    if (blockBack) {
      player_move(0, 0, blockBack.z + 1 - player.z);
    }
  }

  // if moving to the right
  if (xChange > 0) {
    let blockRight = world_getBlockRight(playerBlock);
    if (blockRight) {
      player_move(blockRight.x - 1 - player.x, 0, 0);
    }
  }

  // if moving to the left
  if (xChange < 0) {
    let blockLeft = world_getBlockLeft(playerBlock);
    if (blockLeft) {
      player_move(blockLeft.x + 1 - player.x, 0, 0)
    }
  }

  // if moving downwards and hit a block
  if (isAirborne && yChange < 0) {
    let blockBelow = world_getBlockBelow(playerBlock);
    if (blockBelow) {
      player_move(0, blockBelow.y + 1 - player.y, 0);
      upVelocity = 0;
      isAirborne = false;
    }
  }

  // if moving upwards and hit a block
  if (isAirborne && yChange > 0) {

    let blockAbove = world_getBlockAbove({
      x: playerBlock.x,
      y: playerBlock.y + PLAYER_HEIGHT,
      z: playerBlock.z
    });

    if (blockAbove) {
      player_move(0,  blockAbove.y - 1 - PLAYER_HEIGHT - player.y, 0);
      upVelocity = 0;
      isAirborne = false;
    }
  }
}

function player_update() {
  // handle moving forward and backward
  if (player.straightMovement !== 0) {
    let direction = player.straightMovement === 1 ? -1 : 1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    player_move(distEachFrame * Math.sin(player.yaw), 0, distEachFrame * Math.cos(player.yaw));
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    let direction = player.sideMovement === 1 ? 1 : -1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    player_move(distEachFrame * Math.sin(player.yaw + Math.PI / 2), 0, distEachFrame * Math.cos(player.yaw + Math.PI / 2));
  }

  if (player.straightMovement || player.sideMovement) {
    bobbleCounter += elapsedTime;
    bobble = BOBBLE_AMPLITUDE * MATH_SIN((bobbleCounter/1000) * BOBBLE_FREQUENCEY);
  }

  
  let blockBelow = world_getBlockBelow(world_getPlayerBlock());

  if (isAirborne) {
    // handle gravity
    upVelocity += GRAVITY * elapsedTime / 1000;
    let distEachFrame = upVelocity * elapsedTime / 1000;
    player_move(0, distEachFrame, 0);
  }

  if (!blockBelow) {
    isAirborne = true; 
  }

  if (flashTimeRemaining !== 0) {
    flashTimeRemaining -= elapsedTime;

    if (flashTimeRemaining < 0) {
      flashTimeRemaining = 0;
    }
  }


};

function player_jump() {
  if (!isAirborne) {
    isAirborne = true;
    upVelocity = JUMP_SPEED;
  }
}

function player_hurt() {
  if (!isHurting) {
    player.health -= 1;
    //a_soundEffect('player-hurt');
    soundEffects.play('monster-hit');
    setTimeout(function() {
      isHurting = false;
    }, PAIN_FLASH_DURATION);
  }
}

function player_fire() {
  if (numBullets > 0) {
    flashTimeRemaining = FLASH_COOLDOWN;
    numBullets -= 1;

    // let hitMonster = monsters_getHit();
    // if (hitMonster >= 0) {
    //   monsters_hurt(hitMonster);
    // }

    soundEffects.play('shoot');
    hud_gunRecoil();
  }
}
