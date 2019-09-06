let MATH_PI = Math.PI;
let MATH_ROUND = Math.round;
let MATH_RANDOM = Math.random;
let MATH_SIN = Math.sin;
let MATH_COS = Math.cos;
let MATH_FLOOR = Math.floor;
let MATH_CEIL = Math.floor;
let MATH_SIGN = Math.sign;
let MATH_ABS = Math.abs;
let MATH_SQRT = Math.sqrt;
let MATH_ATAN2 = Math.atan2;
let MATH_ATAN = Math.atan;

let MONSTER_ATTACK_COOLDOWN = 1; // s
let MONSTER_SPEED = 2.5; // units / s
let MONSTER_JUMP_SPEED = 25; // units / s
let MONSTER_TURN_SPEED = 0.5; // radians / s
let MONSTER_ATTACK_DIST = 4; 

let TEXTURES_STONE = 'stone';
let TEXTURES_MOSSY_STONE = 'mossy-stone';
let TEXTURES_ROTTING_WOOD = 'rotting-wood';
let TEXTURES_DIRT = 'dirt';
let TEXTURES_BURNED_STONE = 'burned-stone';
let TEXTURES_BLOOD_STONE = 'blood-stone';
let TEXTURES_MUMMY_WRAP = 'mummy-wrap';
let TEXTURES_FOAM = 'foam';

let PLAYER_SPEED = 20; // units / s
let PLAYER_HEIGHT = 4;
let PLAYER_STEP_SPEED = 300; // ms
let PLAYER_PAIN_FLASH_DURATION = 1; // s

let GAME_STATE_PLAYING = 'playing';
let GAME_STATE_STORY = 'story';
let GAME_STATE_PAUSED = 'paused';
let GAME_STATE_DIED = 'died';
let GAME_STATE_WIN = 'win';

let PAIN_FLASH_DURATION = 200; // ms
let MENU_COOLDOWN = 0.5; // s
let BLOCK_NUM_VERTICES = 24;
let GUN_RECOIL = 200;
let GUN_RECOIL_RECOVER_SPEED= 400; // units per second
let PIXEL_RATIO = (window && window.devicePixelRatio) || 1;
// gl drawElements can only handle 64k vertices.  Each block is defined by exactly 24 vertices.  Thus we can at most
// render 2,666 blocks for each drawElements call.  Exceeding this number will result in skipping of call draws for individual blocks
let BLOCKS_PER_BUFFER = 2666;
let BOBBLE_AMPLITUDE = 1; // webgl space
let BOBBLE_FREQUENCEY = 10;
let GRAVITY = -100; // units / second^2
let JUMP_SPEED = 30;
let FLASH_COOLDOWN = 100;
let CHAR_SPACING = 1;
let TEXT_HEIGHT = 5;
let GUN_BOBBLE_AMPLITUDE = 30; // pixels
let GUN_BOBBLE_FREQUENCEY = 10;
let GAME_ASPECT_RATIO = 16/9; // width/height
let OPTIMAL_VIEWPORT_WIDTH = 1300;
let OPTIMAL_VIEWPORT_HEIGHT = OPTIMAL_VIEWPORT_WIDTH / GAME_ASPECT_RATIO;
let RELOAD_SPEED = 500; // once per ms
let GUN_RELOAD_DIST = 150;
let RAY_TRACE_INCREMENT = 0.3;


let world = [];
let worldBuffers = {};
let worldHitBuffers = {};
let hudCanvas;
let hudContext;
let gun;
let openMenuTime = 0;
let elapsedTime = 0;
let lastTime = 0;
let now = 0;
let gameState = 'menu';
let hasRendered = false;
let viewportWidth = 0;
let viewportHeight = 0;
let player = {};
let isHurting = false;
let soundEffects;
let textures = {};
let sceneCanvas;
let sceneContext;
let mvMatrix; 
let pMatrix;
let mvMatrixStack = [];
let shaderProgram;
let hitShaderProgram;
let bobble = 0;
let bobbleCounter = 0;
let gunBobbleX = 0;
let gunBobbleY = 0;
let gunBobbleCounter = 0;
let numBullets;
let health = 5;
let hudRatio;
let flashTimeRemaining;
let music_audio;
let music_ready = false;
let music_playing = false;
let spritesReady = false;
let musicReady = false;
let gameReady = false;
let gameStarted = false;
let audio = null;
let monsters = [];
let idGenerator = 0;
let windowRatio;
let viewportScale;
let reloadTimeRemaining = 0;
let isReloading = false;
let isRecoiling = false;
let spriteCanvas;
let spriteContext;
let hitCanvas;
let hitContext;

/*
  0 - loading
  1 - splash screen
  2 - ring ring
  3 - controls
*/
let gameStory = 0;
let playerStep = 0;
let playerHurting = 0;
let canvasLeft;
let monsterKills;
let monsterBatch;
let hudDirty;
let musicPlaying;