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
  canvas = document.getElementById('scene');
  context = canvas.getContext('webgl');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  overlayEl = document.getElementById('a');
  healthEl = document.getElementById('b');

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


// function v_renderGround() {
//   gl_save();
//   gl_translate(0, -1.1, 0);
//   gl_pushBuffers(buffers.plane, textures.ground.glTexture, true);
//   gl_drawElements(buffers.plane);
//   gl_restore();
// };

// function v_renderTrees(x, z) {
//   if (world.blocks[x] && world.blocks[x][z]){
//     var trees = world.blocks[x][z].trees;

//     for (var n = 0; n < trees.length; n++) {
//       var tree = trees[n];

//       tree.points.forEach(function(point) {
//         // trunk
//         gl_save();
//         gl_translate(point.x, point.y, point.z);
//         gl_rotate(tree.rotationY, 0, 1, 0);
//         gl_scale(2, 2, 2);
//         gl_pushBuffers(buffers.cube, textures.tree.glTexture, true);
//         gl_drawElements(buffers.cube);
//         gl_restore();
//       });

//       var lastPoint = tree.points[tree.points.length-1];
//       var treeX = lastPoint.x;
//       var treeY = lastPoint.y;
//       var treeZ = lastPoint.z;

//       LEAVES_GEOMETRY.forEach(function(leaf) {
//         gl_save();
//         gl_translate(treeX + leaf[0]*8, treeY + leaf[2]*8, treeZ + leaf[1]*8);
//         gl_scale(4, 4, 4);
//         gl_pushBuffers(buffers.cube, textures.leaves.glTexture, true);
//         gl_drawElements(buffers.cube);
//         gl_restore();
//       });
//     }
//   }
// };

function v_render() {
  gl_clear();

  // set field of view at 45 degrees
  // set viewing range between 0.1 and 100 units away.
  gl_perspective(45, 0.1, 150.0);
  gl_identity();
  
  // enable lighting
  gl_enableLighting();
  gl_setAmbientLighting(0, 0, 0);


  //gl_setDirectionalLighting(-0.25, -0.25, -1, 0.8, 0.8, 0.8);
  gl_setPointLighting(0.9, 0.9, 0.9);

  gl_rotate(-camera.pitch, 1, 0, 0);
  gl_rotate(-camera.yaw, 0, 1, 0);
  gl_translate(-camera.x, -camera.y, -camera.z);
  
  world_render();

  //v_renderHealth()
  //v_renderGround();
  //v_renderTrees();
  //v_renderBeacon();
  //v_renderMonsters();
  //v_renderLasers();
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
    //w_updateLasers();
    //w_updateMonsters();
    //w_updateBeacon();
    //w_addBlocks(true); 
  }

  v_render();

  lastTime = now;

  window.requestAnimationFrame(game_loop);  
} 