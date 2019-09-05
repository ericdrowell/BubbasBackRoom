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

  game_loop();


}

function game_restart() {
  player_init();
  monsters_init();
  gameState = GAME_STATE_STORY;
  gameStory = 1;
  //music_stop();
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
  if (texturesReady) {
    game_storyNext();
  }
}


function game_render() {
  if (gameState === GAME_STATE_PLAYING) {
    let viewAngle = 45; // 45 -> 90
    let minDist = 0.1;
    let maxDist = 100;
    mat4.perspective(viewAngle, sceneCanvas.width / sceneCanvas.height, minDist, maxDist, pMatrix);
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

    // screen shake
    let marginLeft = canvasLeft + (playerHurting * 50 * MATH_SIN(now*0.1));
    sceneCanvas.style.marginLeft = marginLeft + 'px';
    hudCanvas.style.marginLeft = marginLeft + 'px';

    
  }

  // canvas2d rendering
  hud_render();
};

function game_start() {
  game_resume();
  soundEffects_play('start');
}

function game_pause() {
  gameState = 'paused';
  soundEffects_play('dialog');
}

function game_resume() {
  gameState = GAME_STATE_PLAYING;
  sceneCanvas.requestPointerLock();
  soundEffects_play('dismiss');
}

function game_win() {
  //soundEffects_play('player-win');
  document.exitPointerLock();
  gameState = GAME_STATE_WIN;
}

function game_die() {
  document.exitPointerLock();
  gameState = GAME_STATE_DIED;
  soundEffects_play('player-die', 0.5);
}

function game_update() {
  if (gameState === GAME_STATE_PLAYING) {
    if (player.health <= 0) {
      game_die();
    }
    else if (monsterKills === 2) {
      game_win();
    }
    else {
      player_update();
      monsters_update();
    }

    game_updateStory();
  }
  hud_update();
}

function game_updateStory() {
  // if (gameStory === 3 && player.z < 4) {
  //   game_storyNext();
  // }
  // if (gameStory === 4 && x > -55) {
  //   game_storyNext();
  // }
}

function game_storyNext() {
  gameStory++;
  player.straightMovement = 0;
  player.sideMovement = 0;
  document.exitPointerLock();

  if (ENABLE_MUSIC && gameStory === 2 && !musicPlaying) {
    music_start();
  }
  if (gameStory > 1) {
    soundEffects_play('dialog');
    gameState = GAME_STATE_STORY;
  }
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

// use ray tracing to find collisions
function game_moveObject(object, xChange, yChange, zChange) {
  
  let newX = object.x;
  let newY = object.y;
  let newZ = object.z;

  

  // y movement
  let yChangeAbs = MATH_ABS(yChange);
  let ySign = MATH_SIGN(yChange);
  for (let y=0; y<yChangeAbs+RAY_TRACE_INCREMENT; y+=RAY_TRACE_INCREMENT) {
    if (y > yChangeAbs) {
      y = yChangeAbs;
    }
    let block = world_getBlock(object.x, object.y + y*ySign, object.z);
    if (block) {
      upVelocity = 0;
      isAirborne = false;
      break;
    }
    else {
      newY = object.y + y*ySign;
    }
  }

  // x movement
  let xChangeAbs = MATH_ABS(xChange);
  let xSign = MATH_SIGN(xChange);
  for (let x=0; x<xChangeAbs+RAY_TRACE_INCREMENT; x+=RAY_TRACE_INCREMENT) {
    if (x > xChangeAbs) {
      x = xChangeAbs;
    }
    let block = world_getBlock(object.x + x*xSign, newY, object.z);
    if (block) {
      break;
    }
    else {
      newX = object.x + x*xSign;
    }
  }

  // z movement
  let zChangeAbs = MATH_ABS(zChange);
  let zSign = MATH_SIGN(zChange);
  for (let z=0; z<zChangeAbs+RAY_TRACE_INCREMENT; z+=RAY_TRACE_INCREMENT) {
    if (z > zChangeAbs) {
      z = zChangeAbs;
    }
    let block = world_getBlock(newX, newY, object.z + z*zSign);
    if (block) {
      break;
    }
    else {
      newZ = object.z + z*zSign;
    }
  }

  object.x = newX;
  object.y = newY;
  object.z = newZ;


  
}