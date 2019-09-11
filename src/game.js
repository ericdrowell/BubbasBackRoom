let ENABLE_MUSIC = true;
let ENABLE_MONSTERS = true;

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
  userInputs_init();

  world_init();
  player_init();
  monsters_init();
  items_init();

  gameState = GAME_STATE_STORY;
  gameStory = 0;

  textures_init(function() {
    texturesReady = true;
    sprite_init(function() {
      hudDirty = true;
      spritesReady = true;
      game_setReady();
    });
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
  items_init();
  gameState = GAME_STATE_STORY;
  gameStory = 1;
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
  
  if (ENABLE_MUSIC && spritesReady && musicReady) {
    hudDirty = true;
    gameStory++;
  }

  if (!ENABLE_MUSIC && spritesReady) {
    hudDirty = true;
    gameStory++;
  }
}


function game_render() {
  // TODO: should use dirty flag instead of looking at state
  if (gameState === GAME_STATE_PLAYING || (!firstRender && texturesReady)) {
    let viewAngle = 45; // 45 -> 90
    let minDist = 0.1;
    let maxDist = 150; // 100
    mat4.perspective(viewAngle, sceneCanvas.width / sceneCanvas.height, minDist, maxDist, pMatrix);
    mat4.identity(mvMatrix);

    webgl_clear(sceneCanvas, sceneContext);
    webgl_clear(hitCanvas, hitContext);


    mat4.rotate(mvMatrix, -player.pitch, [1, 0, 0]);
    mat4.rotate(mvMatrix, -player.yaw, [0, 1, 0]);
    mat4.translate(mvMatrix, [-2 * player.x, -2 * (player.y + PLAYER_HEIGHT), -2 * player.z]);
    mat4.translate(mvMatrix, [0, bobble, 0]);

    world_render();
    monsters_render();  
    items_render();

    // screen shake
    let marginLeft = canvasLeft + (playerHurting * 50 * Math.sin(now*0.1));
    sceneCanvas.style.marginLeft = marginLeft + 'px';
    hudCanvas.style.marginLeft = marginLeft + 'px';

    firstRender = true;
    
  }

  if (hudDirty && texturesReady) {
    hud_render();
    hudDirty = false;
  }
};

function game_start() {
  game_resume();
  soundEffects_play(SOUND_EFFECTS_START);
}

function game_pause() {
  hudDirty = true;
  gameState = GAME_STATE_PAUSED;
  soundEffects_play(SOUND_EFFECTS_DIALOG);
}

function game_resume() {
  hudDirty = true;
  gameState = GAME_STATE_PLAYING;
  sceneCanvas.requestPointerLock();
  soundEffects_play(SOUND_EFFECTS_DIALOG);
}

function game_win() {
  hudDirty = true;
  setTimeout(function() {
    hudDirty = true;
    document.exitPointerLock();
    gameState = GAME_STATE_WIN;
    clickBlock = 500;
  }, 1000);

}

function game_die() {
  hudDirty = true;
  document.exitPointerLock();
  gameState = GAME_STATE_DIED;
}

function game_triggers() { 
  // on first screen.  user clicked to continue
  if (gameStory === 2) {
    hud_openDialog();

    if (ENABLE_MUSIC && !musicPlaying) {
      music_start();
    }
    gameStory++;
  }
  // on controls screen.  user clicked to continue
  else if (gameStory === 4) {
    hud_openDialog();
    gameStory++;
  }
  // user pressed enter
  else if (gameStory === 6) {
    game_start();
    gameStory++;
  }
  else if (gameStory === 7 && ENABLE_MONSTERS && player.x > -55) {
    monsters_spawn(0);
    gameStory++;
  }
  else if (gameStory === 8 && player.x > -55) {
    items_spawn();
    gameStory++;
  }
  else if (gameStory === 9 && player.x >= 57 && player.x <= 60 && player.z >= -2 && player.z <= 2) {
    hud_openDialog();
    gameStory++;
  }
  else if (gameStory === 11) {
    game_resume();
    gameStory++;
  }
  else if (gameStory >= 9 && gameStory <= 12 && monstersKilled >= 4) {
    world_removePlane(60, 60, 0, 7, -2, 2);
    soundEffects_play(SOUND_EFFECTS_MILESTONE);
    gameStory = 13;
  }  
  else if (gameStory === 13 && player.x >= 61) { 
    monsters_spawn(1);
    gameStory++;
  }
  else if (gameStory === 14 && player.z < -22) {  
    hud_openDialog();
    gameStory++;
  }
  else if (gameStory === 16) {
    game_resume();
    gameStory++;
  }
  else if (gameStory >= 14 && gameStory <= 17 && monstersKilled >= 10) {
    world_removePlane(78, 82, 7, 14, -25, -25);
    soundEffects_play(SOUND_EFFECTS_MILESTONE);
    gameStory = 18;
  }  
}

function game_update() {
  game_triggers();

  // handle click block
  // TODO: should move this to hud
  if (clickBlock > 0) {
    clickBlock -= elapsedTime;
    if (clickBlock <= 0) {
      clickBlock = 0;
      hudDirty = true;
    }
  }
  
  if (gameState === GAME_STATE_PLAYING) {
    if (player.health <= 0) {
      game_die();
    }
    else if (monstersKilled === 100) {
      game_win();
    }
    
    player_update();
    monsters_update();
    items_update();
  }
  hud_update();
}

function game_loop() {
  now = new Date().getTime();
  if (lastTime !== 0) {
    elapsedTime = now - lastTime;
  }

  //console.log(elapsedTime)

  game_update();
  game_render();

  lastTime = now;
  window.requestAnimationFrame(game_loop);  
}
