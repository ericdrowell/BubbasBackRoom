var player = {};
var isHurting = false;

function p_init() {
  player = {
    straightMovement: 0,
    sideMovement: 0,
    isClimbing: false,
    health: 7
  };
}

function p_updatePlayerPos() {
  var lastPos = {
    x: camera.x,
    y: camera.y,
    z: camera.z
  }

  // handle moving forward and backward
  if (player.straightMovement !== 0) {
    var direction = player.straightMovement === 1 ? -1 : 1;
    
    if (player.isClimbing && camera.pitch < -0) {
      direction *= -1;
    }

    var distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;

    if (player.isClimbing) {
      camera.y += distEachFrame * -1;

      if (camera.y < PLAYER_HEIGHT) {
        camera.y = PLAYER_HEIGHT;
        player.isClimbing = false;
      }

      if (player.isClimbing && camera.y > nearbyTree.height + 10) {
        camera.y = nearbyTree.height + 10;
      }
    }
    else {
      camera.z += distEachFrame * Math.cos(camera.yaw);
      camera.x += distEachFrame * Math.sin(camera.yaw);
    }
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    var direction = player.sideMovement === 1 ? 1 : -1;
    var distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    camera.z += distEachFrame * Math.cos(camera.yaw + Math.PI / 2);
    camera.x += distEachFrame * Math.sin(camera.yaw + Math.PI / 2);
  }

  // handle tree collision detection


  var intersectingObj = w_getGridObject({
    x: camera.x,
    y: 0,
    z: camera.z
  });

  if (intersectingObj && intersectingObj.type === 'tree') {
    camera.x = lastPos.x;
    camera.y = lastPos.y;
    camera.z = lastPos.z;
  }

  // handle touching the beacon and winning the game
  if (w_isNearbyBeacon() && gameState !== 'won') {
    c_win();
  }

  // handle touching the beacon and winning the game
  if (player.health <= 0 && gameState !== 'died') {
    c_die();
  }

  // handle monsters hurting you
  w_getNearbyMonsters().forEach(function(monster) {
    if (!monster.cooldown) {
      p_hurt();
      monster.cooldown = true;
      setTimeout(function() {
        monster.cooldown = false;
      }, MONSTER_COOLDOWN_TIME * 1000);
    }
  });


};

function p_hurt() {
  

  if (!isHurting) {
    player.health -= 1;
    //a_soundEffect('player-hurt');
    aa.play('monster-hit');
    setTimeout(function() {
      canvas.style.opacity = 1;
      isHurting = false;
    }, PAIN_FLASH_DURATION);

    canvas.style.opacity = 0.4;
  }
}

function p_fire() {
  var pitch = camera.pitch+MATH_PI/2 + MATH_PI/2;
  var yaw = camera.yaw;

  world.lasers.push({
    // x: camera.x + Math.sin(camera.yaw + MATH_PI/4) * LASER_START_DIST_FROM_PLAYER,
    // y: camera.y - Math.tan(camera.pitch) * LASER_START_DIST_FROM_PLAYER - PLAYER_HEIGHT*0.2,
    // z: camera.z + Math.cos(camera.yaw + MATH_PI/4) * LASER_START_DIST_FROM_PLAYER,

    // laser projectile reference
    // laser.x += Math.sin(yaw) * Math.sin(pitch) * distEachFrame;
    // laser.y += Math.cos(pitch) * distEachFrame;
    // laser.z += Math.cos(yaw) * Math.sin(pitch) * distEachFrame;

    x: camera.x + Math.sin(yaw) * Math.sin(pitch) * LASER_START_DIST_FROM_PLAYER + Math.sin(yaw+MATH_PI/4) * LASER_START_DIST_FROM_PLAYER,
    y: camera.y + Math.cos(pitch) * LASER_START_DIST_FROM_PLAYER,
    z: camera.z + Math.cos(yaw) * Math.sin(pitch) * LASER_START_DIST_FROM_PLAYER + Math.cos(yaw+MATH_PI/4) * LASER_START_DIST_FROM_PLAYER,

    pitch: camera.pitch,
    yaw: camera.yaw,
    expire: ((new Date() / 1000) + LASER_EXPIRE) * 1000
  });

  //a_soundEffect('laser');
  aa.play('laser');
}
