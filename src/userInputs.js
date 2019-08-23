function userInputs_init() {
  document.addEventListener('keydown', function(evt) {
    userInputs_handleKeyDown(evt);
  }, false);
  
  document.addEventListener('keyup', function(evt) {
    userInputs_handleKeyUp(evt);
  }, false);

  document.addEventListener('mousemove', function(evt) {
    userInputs_handleMouseMove(evt);
  }, false);

  document.addEventListener('mousedown', function(evt) {
    userInputs_handleMouseDown(evt);
  }, false);

  document.addEventListener('pointerlockchange', function(evt) {
    if (!userInputs_isPointerLocked() && gameState === 'playing') {
      game_pause();
    }
  }, false);
};

function userInputs_handleKeyDown(evt) {
  if (gameStarted) {
    let keycode = ((evt.which) || (evt.keyCode));

    switch (keycode) {
      case 65:
        // a key (strafe left)
        if (gameState === 'playing') {
          player.sideMovement = -1;
        }
        break;
      case 87:
        // w key (move forward)
        if (gameState === 'playing') {
          player.straightMovement = 1;
        }
        break;
      case 68:
        // d key (strafe right)
        if (gameState === 'playing') {
          player.sideMovement = 1;
        }
        break;
      case 83: 
        // s key (move backwards)
        if (gameState === 'playing') {
          player.straightMovement = -1;
        }
        break;
      case 32:
        player_jump();
        break;
      case 82:
        // r key (reload)
        numBullets = 6;
        break;
    }
  }
  // game not started but game ready, start the game
  else if (gameReady) {
    gameStarted = true;
    game_loop();

    setTimeout(function() {
      music_start();
    }, 50);
  }
};

function userInputs_handleKeyUp(evt) {
  if (gameStarted) {
    let keycode = ((evt.which) || (evt.keyCode));

    switch (keycode) {
      case 65:
        // a key
        player.sideMovement = 0;
        break;
      case 87:
        // w key
        player.straightMovement = 0;
        
        break;
      case 68:
        // d key
        player.sideMovement = 0;
        break;
      case 83:
        // s key
        player.straightMovement = 0;
        break;
    }
  }
};

function userInputs_handleMouseMove(evt) {
  if (gameStarted) {
    if (userInputs_isPointerLocked()) {
      // pitch (up and down)
      player.pitch += evt.movementY * MATH_PI * 0.001 * -1;
      if (player.pitch > MATH_PI/2) {
        player.pitch = MATH_PI/2;
      }
      if (player.pitch < -1 * MATH_PI/2) {
        player.pitch = -1 * MATH_PI/2;
      }

      // yaw (side to side)
      player.yaw += evt.movementX * MATH_PI * 0.001 * -1;
    }
  }
}

function userInputs_handleMouseDown(evt) {
  if (gameStarted) {
    let now = new Date().getTime()

    if (gameState === 'playing') {
      player_fire();
    }
    else if (now > openMenuTime + MENU_COOLDOWN*1000) {
      if (gameState === 'menu' || gameState === 'paused') {
        game_play();
      } 
      else if (gameState === 'playing') {
        player_fire();
      }
      else if (gameState === 'won' || gameState === 'died') {
        userInputs_resetGame();
      }
    }
  }
}

function userInputs_isPointerLocked() {
  return document.pointerLockElement === sceneCanvas;
}