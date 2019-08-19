const MONSTER_COOLDOWN_TIME = 1; // s
const MONSTER_SPEED = 10; // units / s
const MONSTER_JUMP_SPEED = 25; // units / s
const PLAYER_SPEED = 40; // units / s
const PLAYER_HEIGHT = 6;
const PAIN_FLASH_DURATION = 100; // ms
const MENU_COOLDOWN = 0.5; // s
const GRAVITY = 100; // units / s^2
const BLOCK_SIZE = 100; //100;
const BLOCK_NUM_VERTICES = 24;
const MATH_PI = Math.PI;
const MATH_ROUND = Math.round;
const MATH_RANDOM = Math.random;
const MATH_SIN = Math.sin;
const GUN_RECOIL = 100;
const GUN_RECOIL_RECOVER_SPEED= 400; // units per second
const PIXEL_RATIO = (window && window.devicePixelRatio) || 1;
// gl drawElements can only handle 64k vertices.  Each block is defined by exactly 24 vertices.  Thus we can at most
// render 2,666 blocks for each drawElements call.  Exceeding this number will result in skipping of call draws for individual blocks
const BLOCKS_PER_BUFFER = 2666;
const OPTIMAL_VIEWPORT_HEIGHT = 730;
const BOBBLE_AMPLITUDE = 1;
const BOBBLE_FREQUENCEY = 10;

let world = [];
let worldBuffers = {};
let hudCanvas;
let hudContext;
let gun;
let sceneCanvas;
let sceneContext;
let camera = {};
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
let isFiring = false;
let soundEffects;
let textures = {};
let webglCanvas;
let webglContext;
let mvMatrix; 
let pMatrix;
let mvMatrixStack;
let shaderProgram;
let pixelateCanvas;
let pixelateContext;
let compositeCanvas;
let compositeContext;
let bobble = 0;
let bobbleCounter = 0;