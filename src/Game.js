var INSTRUCTIONS_TEXT = '[WASD]&nbsp; MOVE AROUND&nbsp;&nbsp;&nbsp;<br>[CLICK] SHOOT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>[SPACE] CLIMB TREE &nbsp;&nbsp;&nbsp;<br>[ESC]&nbsp;&nbsp; PAUSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>';

/*
 * The view is responsible for the camera, loading textures, and rendering the world model
 */
var canvas;
var context;
var camera = {};
var overlayEl;
var healthEl;
var openMenuTime = 0;
var elapsedTime = 0;
var lastTime = 0;
var now = 0;
var gameState = 'menu';
var nearbyTree = null;

function game_init() {
  let body = document.querySelector('body');
  body.style.overflow = 'hidden';
  body.style.padding = 0;
  body.style.margin = 0;

  canvas = document.getElementById('webglCanvas');
  context = canvas.getContext('webgl');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.style.backgroundColor = 'black';

  webgl_init(); 
  soundEffects_init();
  //a_init();
  c_attachListeners();

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
  p_init();
  gameState = 'menu';
  //a_playMusic('menu', 0.4);

  //v_showMenuScreen();
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
};

function c_playGame() {
  gameState = 'playing';
  canvas.requestPointerLock();
  //v_hideScreen();
  //a_playMusic('play', 0.05);
  //a_stopMusic();
  aa.play('start')
}

function c_pauseGame() {
  gameState = 'paused';
  //a_playMusic('menu', 0.4);
  //v_showPausedScreen();
}

function c_win() {
  aa.play('player-win');
  document.exitPointerLock();
  gameState = 'won';
  //v_showWinScreen();
  
  setTimeout(function() {
    //a_playMusic('menu', 0.4);
  }, 1000)
  
  
}

function c_die() {
  document.exitPointerLock();
  gameState = 'died';
  //a_playMusic('menu', 0.4);
  //v_showDiedScreen();
  //a_soundEffect('die');
  aa.play('player-die');
}

function game_loop() {
  now = new Date().getTime();
  if (lastTime !== 0) {
    elapsedTime = now - lastTime;
  }

  if (gameState === 'playing') {
    p_updatePlayerPos();
    game_render();
  }

  lastTime = now;
  window.requestAnimationFrame(game_loop);  
} 