function player_init() {


// back room
player = {
  health: 6,
  isAirborne: false,
  pitch: -0.12,
  sideMovement: 0,
  straightMovement: 0,
  upVelocity: 0,
  x: -251.9,
  y: 26.5,
  yaw: 6.3,
  z: 45
};

// end of first tunnel
// player = {
//   health: 6,
//   pitch: -0.1,
//   sideMovement: 0,
//   straightMovement: 0,
//   x: -62.6,
//   y: 10.5,
//   yaw: 4.7,
//   z: 0.42,
//   upVelocity: 0,
//   isAirborne: false
// }


// first monster room
// player = {
//   health: 6,
//   pitch: -0.10,
//   sideMovement: 0,
//   straightMovement: 0,
//   x: -5,
//   y: 0,
//   yaw: 4.7,
//   z: 0,
//   upVelocity: 0,
//   isAirborne: false
// };


// first pillar room
// player = {
//   health: 6,
// isAirborne: false,
// pitch: -0.23,
// sideMovement: 0,
// straightMovement: 0,
// upVelocity: 0,
// x: 50.28,
// y: -0.49,
// yaw: 4.48,
// z: -0.06,
// };

// end long hallway
// player = {
// health: 6,
// isAirborne: false,
// pitch: -0.12,
// sideMovement: 0,
// straightMovement: 0,
// upVelocity: 0,
// x: 82,
// y: 6.5,
// yaw: 6.21,
// z: -190.85,
// };

// hole of death
// player = {
// health: 6,
// isAirborne: false,
// pitch: -0.34,
// sideMovement: 0,
// straightMovement: 0,
// upVelocity: 0,
// x: -88.13,
// y: -14.49,
// yaw: 7.86,
// z: -225.95
// }

  playerHurting = 0;
  flashTimeRemaining = 0;
  numBullets = 6;
  reloadTimeRemaining = 0;
  isReloading = false;
}

function player_update() {
  // handle moving forward and backward
  if (player.straightMovement !== 0) {
    let direction = player.straightMovement === 1 ? -1 : 1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    world_moveObject(player, distEachFrame * Math.sin(player.yaw), 0, distEachFrame * Math.cos(player.yaw));
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    let direction = player.sideMovement === 1 ? 1 : -1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    world_moveObject(player, distEachFrame * Math.sin(player.yaw + Math.PI / 2), 0, distEachFrame * Math.cos(player.yaw + Math.PI / 2));
  }

  if (!player.isAirborne && (player.straightMovement || player.sideMovement)) {
    // bobble
    bobbleCounter += elapsedTime;
    bobble = BOBBLE_AMPLITUDE * Math.sin((bobbleCounter/1000) * BOBBLE_FREQUENCEY);

     // run sound
    playerStep -= elapsedTime;
    if (playerStep < 0) {
      playerStep = PLAYER_STEP_SPEED;
      soundEffects_play(SOUND_EFFECTS_RUN);
    }

  }

  // handle gravity
  player.upVelocity += GRAVITY * elapsedTime / 1000;
  let distEachFrame = player.upVelocity * elapsedTime / 1000;
  world_moveObject(player, 0, distEachFrame, 0);  

  
  if (flashTimeRemaining !== 0) {
    flashTimeRemaining -= elapsedTime;

    if (flashTimeRemaining < 0) {
      flashTimeRemaining = 0;
    }
  }

  // reloading
  if (isReloading) {
    reloadTimeRemaining -= elapsedTime;

    if (reloadTimeRemaining < 0) {
      reloadTimeRemaining = RELOAD_SPEED;

      if (numBullets < 6) {
        numBullets++;
        soundEffects_play(SOUND_EFFECTS_RELOAD, 0.5);
      }

      if (numBullets === 6) {
        isReloading = false; 
      }
    }
  }

  if (gameStory === 25 && player.y < -99 && playerHurting === 0) {
    playerHurting = PLAYER_PAIN_FLASH_DURATION;
    player.health -= 1;
    hudDirty = true; 
    soundEffects_play(SOUND_EFFECTS_HIT, 0.5);
  }

  // pain flash
  if (playerHurting > 0) {
    playerHurting -= elapsedTime/1000;
    if (playerHurting < 0) {
      playerHurting = 0;
    }
  }
};

function player_jump() {
  if (!player.isAirborne) {
    player.upVelocity = JUMP_SPEED;
    player.isAirborne = true;
    soundEffects_play(SOUND_EFFECTS_JUMP);
  }
}

function player_fire() {
  if (numBullets > 0) {
    isReloading = false;
    gunBobbleX = 0;
    gunBobbleY = 0;
    flashTimeRemaining = FLASH_COOLDOWN;
    numBullets -= 1;

    let pixel = hit_getPixel(viewportWidth/2, viewportHeight/2);

    soundEffects_play(SOUND_EFFECTS_SHOOT);

    // monsters are in the red channel
    if (pixel[0] === 255) {
      // monster id is in the green channel
      let monsterId = pixel[1];
      monsters_hurt(monsterId);
    }

    hud_gunRecoil();
  }
  else {
    soundEffects_play(SOUND_EFFECTS_EMPTY_GUN);
  }
}

function player_reload() {
  if (!isReloading && numBullets < 6) {
    soundEffects_play(SOUND_EFFECTS_RELOAD_START);
    isReloading = true;
    reloadTimeRemaining = RELOAD_SPEED;
  }
}
