const MONSTER_COOLDOWN_TIME = 1; // s
const MONSTER_SPEED = 1; // units / s
const MONSTER_JUMP_SPEED = 25; // units / s
const PLAYER_SPEED = 20; // units / s
const PLAYER_HEIGHT = 4;
const PAIN_FLASH_DURATION = 200; // ms
const MENU_COOLDOWN = 0.5; // s
const BLOCK_NUM_VERTICES = 24;
const MATH_PI = Math.PI;
const MATH_ROUND = Math.round;
const MATH_RANDOM = Math.random;
const MATH_SIN = Math.sin;
const MATH_COS = Math.cos;
const MATH_FLOOR = Math.floor;
const MATH_CEIL = Math.floor;
const MATH_SIGN = Math.sign;
const MATH_ABS = Math.abs;
const MATH_SQRT = Math.sqrt;
const GUN_RECOIL = 200;
const GUN_RECOIL_RECOVER_SPEED= 400; // units per second
const PIXEL_RATIO = (window && window.devicePixelRatio) || 1;
// gl drawElements can only handle 64k vertices.  Each block is defined by exactly 24 vertices.  Thus we can at most
// render 2,666 blocks for each drawElements call.  Exceeding this number will result in skipping of call draws for individual blocks
const BLOCKS_PER_BUFFER = 2666;
const BOBBLE_AMPLITUDE = 1; // webgl space
const BOBBLE_FREQUENCEY = 10;
const GRAVITY = -100; // units / second^2
const JUMP_SPEED = 30;
const FLASH_COOLDOWN = 100;
const GAME_STATE_PLAYING = 'playing';
const GAME_STATE_STORY = 'story';
const GAME_STATE_PAUSED = 'paused';
const CHAR_SPACING = 2;
const TEXTURES_STONE = 'stone';
const TEXTURES_MOSSY_STONE = 'mossy-stone';
const TEXTURES_ROTTING_WOOD = 'rotting-wood';
const TEXTURES_DIRT = 'dirt';
const TEXTURES_BURNED_STONE = 'burned-stone';
const TEXTURES_BLOOD_STONE = 'blood-stone';
const TEXT_HEIGHT = 9;
const GUN_BOBBLE_AMPLITUDE = 30; // pixels
const GUN_BOBBLE_FREQUENCEY = 10;
const GAME_ASPECT_RATIO = 16/9; // width/height
const OPTIMAL_VIEWPORT_WIDTH = 1300;
const OPTIMAL_VIEWPORT_HEIGHT = OPTIMAL_VIEWPORT_WIDTH / GAME_ASPECT_RATIO;
const RELOAD_SPEED = 500; // once per ms
const GUN_RELOAD_DIST = 150;
const RAY_TRACE_INCREMENT = 0.3;
const PLAYER_STEP_SPEED = 300; // ms

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
let mvMatrixStack;
let shaderProgram;
let hitShaderProgram;
let bobble = 0;
let bobbleCounter = 0;
let gunBobbleX = 0;
let gunBobbleY = 0;
let gunBobbleCounter = 0;
let numBullets = 6;
let health = 5;
let upVelocity = 0;
let hudRatio;
let flashTimeRemaining;
let music_audio;
let music_ready = false;
let music_playing = false;
let texturesReady = false;
let musicReady = false;
let gameReady = false;
let gameStarted = false;
let audio = null;
let monsters = [];
let idGenerator = 0;
let windowRatio;
let viewportScale;
let isAirborne;
let reloadTimeRemaining = 0;
let isReloading = false;
let isRecoiling = false;
let textCanvas;
let textContext;
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