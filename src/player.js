function player_init() {


// start at beginning of tunnel
// player = {
// health: 7,
// pitch: -0.13823007675794918,
// sideMovement: 0,
// straightMovement: 0,
// x: -230,
// y: 26,
// yaw: -1.640840704496659,
// z: -2
// };

// center
// player = {
// health: 7,
// pitch: -0.13823007675794918,
// sideMovement: 0,
// straightMovement: 0,
// x: 0,
// y: 0,
// yaw: -1.640840704496659,
// z: 0
// };

player = {
health: 6,
pitch: -0.07924777960769419,
sideMovement: 0,
straightMovement: 0,
x: -275.38950637525187,
y: 26.502200000000038,
yaw: 6.177123528071624,
z: 45.58826675852633
};

// player = {
//   health: 6,
// pitch: -0.10123892818282226,
// sideMovement: 0,
// straightMovement: 0,
// x: -62.67023136178909,
// y: 10.500999999999998,
// yaw: 4.73827409272751,
// z: 0.4229865121474473
// }

  playerHurting = 0;
  flashTimeRemaining = 0;
  isAirborne = false;
  numBullets = 6;
  reloadTimeRemaining = 0;
  isReloading = false;
}

function player_update() {
  // handle moving forward and backward
  if (player.straightMovement !== 0) {
    let direction = player.straightMovement === 1 ? -1 : 1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    game_moveObject(player, distEachFrame * Math.sin(player.yaw), 0, distEachFrame * Math.cos(player.yaw));
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    let direction = player.sideMovement === 1 ? 1 : -1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    game_moveObject(player, distEachFrame * Math.sin(player.yaw + Math.PI / 2), 0, distEachFrame * Math.cos(player.yaw + Math.PI / 2));
  }

  if (!isAirborne && (player.straightMovement || player.sideMovement)) {
    // bobble
    bobbleCounter += elapsedTime;
    let lastBobble = bobble;
    bobble = BOBBLE_AMPLITUDE * MATH_SIN((bobbleCounter/1000) * BOBBLE_FREQUENCEY);

     // run sound
    playerStep -= elapsedTime;
    if (playerStep < 0) {
      playerStep = PLAYER_STEP_SPEED;
      soundEffects_play('run');
    }

  }


  
  // handle gravity
  upVelocity += GRAVITY * elapsedTime / 1000;
  let distEachFrame = upVelocity * elapsedTime / 1000;
  game_moveObject(player, 0, distEachFrame, 0);  

  
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
        soundEffects_play('reload', 0.5);
      }

      

      if (numBullets === 6) {
        isReloading = false;
        
      }

    }
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
  if (!isAirborne) {
    upVelocity = JUMP_SPEED;
    isAirborne = true;
    soundEffects_play('jump');
  }
}

// function player_hurt() {
//   if (!isHurting) {
//     player.health -= 1;
//     //a_soundEffect('player-hurt');
//     soundEffects_play('monster-hit');
//     setTimeout(function() {
//       isHurting = false;
//     }, PAIN_FLASH_DURATION);
//   }
// }

function player_fire() {
  if (numBullets > 0) {
    isReloading = false;
    gunBobbleX = 0;
    gunBobbleY = 0;
    flashTimeRemaining = FLASH_COOLDOWN;
    numBullets -= 1;

    // let hitMonster = monsters_getHit();
    // if (hitMonster >= 0) {
    //   monsters_hurt(hitMonster);
    // }

    let pixel = hit_getPixel(viewportWidth/2, viewportHeight/2);

    soundEffects_play('shoot');

    // monsters are in the red channel
    if (pixel[0] === 255) {
      // monster id is in the green channel
      let monsterId = pixel[1];

      monsters_hurt(monsterId);

      soundEffects_play('hit', 0.3);
    }


    hud_gunRecoil();
  }
  else {
    soundEffects_play('empty-gun');
  }
}

function player_reload() {
  if (!isReloading && numBullets < 6) {
    soundEffects_play('reload-start');
    isReloading = true;
    reloadTimeRemaining = RELOAD_SPEED;
  }
}
