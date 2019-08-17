let player = {};
let isHurting = false;
let isFiring = false;

function player_init() {
  player = {
    straightMovement: 0,
    sideMovement: 0,
    isClimbing: false,
    health: 7
  };
}

function player_update() {
  // let lastPos = {
  //   x: camera.x,
  //   y: camera.y,
  //   z: camera.z
  // }

  // handle moving forward and backward
  if (player.straightMovement !== 0) {
    let direction = player.straightMovement === 1 ? -1 : 1;
    
    if (player.isClimbing && camera.pitch < -0) {
      direction *= -1;
    }

    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;

    if (player.isClimbing) {
      camera.y += distEachFrame * -1;

      if (camera.y < PLAYER_HEIGHT) {
        camera.y = PLAYER_HEIGHT;
      }
    }
    else {
      camera.z += distEachFrame * Math.cos(camera.yaw);
      camera.x += distEachFrame * Math.sin(camera.yaw);
    }
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    let direction = player.sideMovement === 1 ? 1 : -1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    camera.z += distEachFrame * Math.cos(camera.yaw + Math.PI / 2);
    camera.x += distEachFrame * Math.sin(camera.yaw + Math.PI / 2);
  }

};

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
  // let pitch = camera.pitch+MATH_PI/2 + MATH_PI/2;
  // let yaw = camera.yaw;

  isFiring = true;
  soundEffects.play('shoot');

  hud_gunRecoil();
}
