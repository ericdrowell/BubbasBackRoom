function player_init() {


  player = {
health: 7,
pitch: 0.009424777960769388,
sideMovement: 0,
straightMovement: 0,
x: 0,
y: 0,
yaw: 7.761946107697599,
z: 0
  };

  flashTimeRemaining = 0;
}

function player_move(xChange, yChange, zChange) {
  let newX = player.x + xChange;
  let newY = player.y + yChange;
  let newZ = player.z + zChange;

  let newPlayerBlockPos, newPlayerBlock;

  // handle y movement
  newPlayerBlockPos = world_getBlockPos(player.x, newY, player.z);
  newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  if (newPlayerBlock) {
    newY = player.y;
    upVelocity = 0;
  }
  else {
    newPlayerBlockPos = world_getBlockPos(player.x, newY+PLAYER_HEIGHT, player.z);
    newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
    if (newPlayerBlock) {
      newY = player.y;
      upVelocity = 0;
    }
  }

  // handle x movement
  newPlayerBlockPos = world_getBlockPos(newX, newY, player.z);
  newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  if (newPlayerBlock) {
    newX = player.x;
  }

  // handle z movement
  newPlayerBlockPos = world_getBlockPos(newX, newY, newZ);
  newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  if (newPlayerBlock) {
    newZ = player.z;
  }





  
  player.x = newX;
  player.y = newY;
  player.z = newZ;
  
}

// function player_move(xChange, yChange, zChange) {
//   player.x += xChange;
//   player.y += yChange;
//   player.z += zChange;

//   let playerBlock = world_getBlockPos(player.x, player.y, player.z);

//   // if player is now inside a block, don't move into it
//   // if (playerBlock) {
//   //   return false;
//   // }

//   // if moving forward
//   if (zChange > 0) {
//     let blockFront = world_getBlockFront(playerBlock);
//     if (blockFront) {
//       player_move(0, 0, blockFront.z - 1 - player.z);
//     }
//   }

//   // if moving backward
//   if (zChange < 0) {
//     let blockBack = world_getBlockBack(playerBlock);
//     if (blockBack) {
//       player_move(0, 0, blockBack.z + 1 - player.z);
//     }
//   }

//   // if moving to the right
//   if (xChange > 0) {
//     let blockRight = world_getBlockRight(playerBlock);
//     if (blockRight) {
//       player_move(blockRight.x - 1 - player.x, 0, 0);
//     }
//   }

//   // if moving to the left
//   if (xChange < 0) {
//     let blockLeft = world_getBlockLeft(playerBlock);
//     if (blockLeft) {
//       player_move(blockLeft.x + 1 - player.x, 0, 0)
//     }
//   }

//   // if moving downwards and hit a block
//   if (yChange < 0) {
//     let blockBelow = world_getBlockBelow(playerBlock);
//     if (blockBelow) {
//       player_move(0, blockBelow.y + 1 - player.y, 0);
//       upVelocity = 0;
//     }
//   }

//   // if moving upwards and hit a block
//   if (yChange > 0) {

//     let blockAbove = world_getBlockAbove({
//       x: playerBlock.x,
//       y: playerBlock.y + PLAYER_HEIGHT,
//       z: playerBlock.z
//     });

//     if (blockAbove) {
//       player_move(0,  blockAbove.y - 1 - PLAYER_HEIGHT - player.y, 0);
//       upVelocity = 0;
//     }
//   }
// }

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

  
  let blockBelow = world_getBlockBelow(world_getBlockPos(player.x, player.y, player.z));

  // handle gravity
  upVelocity += GRAVITY * elapsedTime / 1000;
  let distEachFrame = upVelocity * elapsedTime / 1000;

  player_move(0, distEachFrame, 0);
  



  if (flashTimeRemaining !== 0) {
    flashTimeRemaining -= elapsedTime;

    if (flashTimeRemaining < 0) {
      flashTimeRemaining = 0;
    }
  }


};

function player_jump() {
  upVelocity = JUMP_SPEED;
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
    gunBobbleX = 0;
    gunBobbleY = 0;
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
