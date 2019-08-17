let camera = {};
let openMenuTime = 0;
let elapsedTime = 0;
let lastTime = 0;
let now = 0;
let gameState = 'menu';
let hasRendered = false;

function game_init() {
  let body = document.querySelector('body');
  body.style.overflow = 'hidden';
  body.style.padding = 0;
  body.style.margin = 0;
  body.style.backgroundColor = 'black';

  webgl_init(); 
  hud_init();
  soundEffects_init();
  userInputs_init();

  game_reset();

  textures_load(function() {
    game_loop();
  });
}

function game_reset() {
  camera = {
    x: 0,
    y: PLAYER_HEIGHT,
    z: 0,
    pitch: 0,
    yaw: 0
  };

  world_init();
  player_init();
  gameState = 'menu';
}


function game_render() {
  let viewAngle = 45;
  let minDist = 0.1;
  let maxDist = 100;
  mat4.perspective(viewAngle, canvas.width / canvas.height, minDist, maxDist, pMatrix);

  mat4.identity(mvMatrix);
  mat4.rotate(mvMatrix, -camera.pitch, [1, 0, 0]);
  mat4.rotate(mvMatrix, -camera.yaw, [0, 1, 0]);
  mat4.translate(mvMatrix, [-camera.x, -camera.y, -camera.z]);

  webgl_clear();
  world_render();

  hud_render();
};

function game_play() {
  gameState = 'playing';
  canvas.requestPointerLock();
  soundEffects.play('start')
}

function game_pause() {
  gameState = 'paused';
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

function game_loop() {
  now = new Date().getTime();
  if (lastTime !== 0) {
    elapsedTime = now - lastTime;
  }

  if (gameState === 'playing' || !hasRendered) {
    player_update();
    hud_update();

    game_render();
    hasRendered = true;

    player_postUpdate();
  }

  lastTime = now;
  window.requestAnimationFrame(game_loop);  
} 