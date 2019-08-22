function player_init() {
  player = {
    straightMovement: 0,
    sideMovement: 0,
    health: 7
  };
}

function player_move(xChange, yChange, zChange) {
  camera.x += xChange;
  camera.y += yChange;
  camera.z += zChange;

  // if moving forward
  if (zChange > 0) {
    let blockFront = world_getBlockFront(world_getCameraBlock());
    if (blockFront) {
      player_move(0, 0, (2 * (blockFront.z - 1)) - camera.z);
      //camera.z = 2 * (blockFront.z - 1);
    }
  }

  // if moving backward
  if (zChange < 0) {
    let blockBack = world_getBlockBack(world_getCameraBlock());
    if (blockBack) {
      player_move(0, 0, (2 * (blockBack.z + 1)) - camera.z);
      //camera.z = 2 * (blockBack.z + 1);
    }
  }

  // if moving to the right
  if (xChange > 0) {
    let blockRight = world_getBlockRight(world_getCameraBlock());
    if (blockRight) {
      player_move((2 * (blockRight.x - 1)) - camera.x, 0, 0);
      //camera.x = 2 * (blockRight.x - 1);
    }
  }

  // if moving to the left
  if (xChange < 0) {
    let blockLeft = world_getBlockLeft(world_getCameraBlock());
    if (blockLeft) {
      player_move((2 * (blockLeft.x + 1)) - camera.x, 0, 0)
      //camera.x = 2 * (blockLeft.x + 1);
    }
  }

  // if moving downwards and hit a block
  if (isAirborne && yChange < 0) {
    let blockBelow = world_getBlockBelow(world_getCameraBlock());
    if (blockBelow) {
      player_move(0,  (2 * (blockBelow.y + 1) + PLAYER_HEIGHT) - camera.y, 0);
      //camera.y = 2 * (blockBelow.y + 1) + PLAYER_HEIGHT;
      upVelocity = 0;
      isAirborne = false;
    }
  }

  // if moving upwards and hit a block
  if (isAirborne && yChange > 0) {
    let blockAbove = world_getBlockAbove(world_getCameraBlock());
    if (blockAbove) {
      player_move(0,  (2 * (blockAbove.y - 1)) - camera.y, 0);
      //camera.y = 2 * (blockBelow.y + 1) + PLAYER_HEIGHT;
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
    player_move(distEachFrame * Math.sin(camera.yaw), 0, distEachFrame * Math.cos(camera.yaw));
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    let direction = player.sideMovement === 1 ? 1 : -1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    player_move(distEachFrame * Math.sin(camera.yaw + Math.PI / 2), 0, distEachFrame * Math.cos(camera.yaw + Math.PI / 2));
  }

  if (player.straightMovement || player.sideMovement) {
    bobbleCounter += elapsedTime;
    bobble = BOBBLE_AMPLITUDE * MATH_SIN((bobbleCounter/1000) * BOBBLE_FREQUENCEY);
  }

  
  let blockBelow = world_getBlockBelow(world_getCameraBlock());

  if (isAirborne) {
    // handle gravity
    upVelocity += GRAVITY * elapsedTime / 1000;
    let distEachFrame = upVelocity * elapsedTime / 1000;
    player_move(0, distEachFrame, 0);
  }

  if (!blockBelow) {
    isAirborne = true; 
  }

  //console.log(isAirborne, camera);
 



};

function player_jump() {
  if (!isAirborne) {
    isAirborne = true;
    upVelocity = JUMP_SPEED;
  }
}

function player_postUpdate() {
  if (isFiring) {
    isFiring = false;
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
    isFiring = true;
    numBullets -= 1;
    soundEffects.play('shoot');
    hud_gunRecoil();
  }
}
