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

  gameState = GAME_STATE_LOADING;

  textures_init(function() {
    texturesReady = true;
    game_setReady();
  });


  // music_init(function() {
  //   musicReady = true;
  //   game_setReady();
  // });

  // HACK: sometimes on start, the player just falls through the floor.  Adding this to hopefully
  // stop it from happening
  setTimeout(function() {
    game_loop();
  }, 100);
  
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
  // if (texturesReady && musicReady) {
  //   gameState = GAME_STATE_START_SCREEN;
  // }

  if (texturesReady) {
    gameState = GAME_STATE_START_SCREEN;
  }
}


function game_render() {
  if (gameState === GAME_STATE_PLAYING) {
    let viewAngle = 45;
    let minDist = 0.1;
    let maxDist = 100;
    mat4.perspective(viewAngle, webglCanvas.width / webglCanvas.height, minDist, maxDist, pMatrix);
    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, -player.pitch, [1, 0, 0]);
    mat4.rotate(mvMatrix, -player.yaw, [0, 1, 0]);
    mat4.translate(mvMatrix, [-2 * player.x, -2 * (player.y + PLAYER_HEIGHT), -2 * player.z]);
    mat4.translate(mvMatrix, [0, bobble, 0]);

    // webgl rendering
    
    webgl_clear();
    world_render();
    monsters_render();
  }

  // canvas2d rendering
  hud_render();
  // composite
  // canvas2d_clear(compositeContext);
  // compositeContext.drawImage(webglCanvas, 0, 0, viewportWidth, viewportHeight);
  // //canvas2d_pixelate(compositeCanvas, compositeContext, 3);
  // compositeContext.drawImage(hudCanvas, 0, 0, viewportWidth, viewportHeight);

 
  // // copy final result onto scene
  // canvas2d_clear(sceneContext);
  // sceneContext.drawImage(compositeCanvas, 0, 0, viewportWidth, viewportHeight);
  
};

function game_start() {
  gameState = GAME_STATE_PLAYING;
  webglCanvas.requestPointerLock();
  soundEffects.play('start');
 
  //music_start();
}



function game_pause() {
  gameState = 'paused';
}

function game_resume() {
  gameState = GAME_STATE_PLAYING;
  webglCanvas.requestPointerLock();
  soundEffects.play('start');
}

function game_win() {
  soundEffects.play('player-win');
  document.exitPointerLock();
  gameState = 'won';
}

function game_die() {
  document.exitPointerLock();
  gameState = 'died';
  soundEffects.play('player-die');
}

function game_update() {
  player_update();
  monsters_update();
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