let ENABLE_MUSIC = true;

// start game - have to do it this way because I need the compressor to convert game_init() to the right variable name
setTimeout(function() {
  game_init();
}, 50);

function game_init() {
  game_setViewportSize();

  let body = document.querySelector('body');
  body.style.overflow = 'hidden';
  body.style.padding = 0;
  body.style.margin = 0;
  body.style.backgroundColor = 'black';

  canvas2d_init()
  webgl_init();
  hud_init();
  soundEffects_init();
  userInputs_init();
  text_init();

  world_init();
  player_init();
  monsters_init();

  gameState = GAME_STATE_STORY;
  gameStory = 0;

  textures_init(function() {
    texturesReady = true;
    game_setReady();
  });

  if (ENABLE_MUSIC) {
    music_init(function() {
      musicReady = true;
      game_setReady();
    });
  }


  game_loop();


}

function game_restart() {
  player_init();
  monsters_init();
  gameState = GAME_STATE_STORY;
  gameStory = 1;
  music_stop();
  game_storyNext();
}

function game_setViewportSize() {
  let windowWidth =  window.innerWidth;
  let windowHeight = window.innerHeight;

  windowRatio = windowWidth / windowHeight;
  

  if (windowRatio > GAME_ASPECT_RATIO) {
    viewportHeight = windowHeight;
    viewportWidth = windowHeight * GAME_ASPECT_RATIO;
  }
  else {
    viewportWidth = windowWidth;
    viewportHeight = windowWidth / GAME_ASPECT_RATIO;
  }

  viewportScale = viewportWidth / OPTIMAL_VIEWPORT_WIDTH;
}

function game_setReady() {
  if (ENABLE_MUSIC && texturesReady && musicReady) {
    game_storyNext();
  }

  if (!ENABLE_MUSIC && texturesReady) {
    game_storyNext();
  }
}


function game_render() {
  if (gameState === GAME_STATE_PLAYING) {
    let viewAngle = 45;
    let minDist = 0.1;
    let maxDist = 100;
    mat4.perspective(45, sceneCanvas.width / sceneCanvas.height, minDist, maxDist, pMatrix);
    mat4.identity(mvMatrix);

    webgl_clear(sceneCanvas, sceneContext);
    webgl_clear(hitCanvas, hitContext);

    //modelView_save();

    mat4.rotate(mvMatrix, -player.pitch, [1, 0, 0]);
    mat4.rotate(mvMatrix, -player.yaw, [0, 1, 0]);
    mat4.translate(mvMatrix, [-2 * player.x, -2 * (player.y + PLAYER_HEIGHT), -2 * player.z]);
    mat4.translate(mvMatrix, [0, bobble, 0]);

    world_render();
    //modelView_restore();

    monsters_render();    
  }

  // canvas2d rendering
  hud_render();
};

function game_start() {
  game_resume();
  soundEffects.play('start');
}

function game_storyNext() {
  gameStory++;

  // now on loading
  if (gameStory === 1) {
    gameState = GAME_STATE_STORY;
  }
  // now on ring ring
  else if (gameStory  === 2) {
    soundEffects.play('dialog');
    if (ENABLE_MUSIC) {
      music_start();
    }
    gameState = GAME_STATE_STORY;
  }
  // now on controls
  else if (gameStory === 3) {
    soundEffects.play('dialog');
    gameState = GAME_STATE_STORY;
  }
  else if (gameStory === 4) {
    game_start();
  }
  
}

function game_pause() {
  gameState = 'paused';
  soundEffects.play('dialog');
}

function game_resume() {
  gameState = GAME_STATE_PLAYING;
  sceneCanvas.requestPointerLock();
  soundEffects.play('dismiss');
}

function game_win() {
  soundEffects.play('player-win');
  document.exitPointerLock();
  gameState = GAME_STATE_WIN;
}

function game_die() {
  document.exitPointerLock();
  gameState = GAME_STATE_DIED;
  soundEffects.play('player-die', 0.5);
}

function game_update() {
  if (gameState === GAME_STATE_PLAYING) {
    if (player.health <= 0) {
      game_die();
    }
    else if (monsters.length === 0) {
      game_win();
    }
    else {
      player_update();
      monsters_update();
    }
  }
  hud_update();
}
function game_loop() {
  now = new Date().getTime();
  if (lastTime !== 0) {
    elapsedTime = now - lastTime;
  }

  game_update();
  game_render();

  lastTime = now;
  window.requestAnimationFrame(game_loop);  
}