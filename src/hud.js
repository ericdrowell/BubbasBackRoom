const GUN_RECOIL = 100;
const GUN_RECOIL_RECOVER_SPEED= 400; // units per second
const PIXEL_RATIO = (window && window.devicePixelRatio) || 1;

let hudCanvas;
let hudContext;
let hudWidth;
let hudHeight;
let gun;

// hud = "heads up display"
function hud_init() {
  hudWidth = window.innerWidth;
  hudHeight = window.innerHeight;

  hudCanvas = document.getElementById('hudCanvas');
  hudContext = hudCanvas.getContext('2d');
  hudCanvas.width = hudWidth * PIXEL_RATIO;
  hudCanvas.height = hudHeight * PIXEL_RATIO;
  hudCanvas.style.width = hudWidth + 'px';
  hudCanvas.style.height = hudHeight + 'px';
  hudCanvas.style.position = 'fixed';
  hudCanvas.style.top = 0;
  hudCanvas.style.left = 0;

  if (PIXEL_RATIO !== 1) {
    hudContext.scale(PIXEL_RATIO, PIXEL_RATIO);
  }

  gun = {
    y: hudHeight
  };

}

function hud_render() {
  hud_renderGun();
  hud_renderCrossHair();

  
}

function hud_update() {
  if (gun.y >= window.innerHeight) {
    let distEachFrame = GUN_RECOIL_RECOVER_SPEED * elapsedTime / 1000;

    gun.y -= distEachFrame;

    if (gun.y < window.innerHeight) {
      gun.y = window.innerHeight;
    }
  }

  
}

function hud_renderGun() {
  let gradient;

  hudContext.clearRect(0, 0, hudWidth, hudHeight);
  
  // left barrel
  hudContext.save();
  hudContext.beginPath();
  hudContext.translate(hudWidth / 2, gun.y);
  hudContext.moveTo(-80, 0);
  hudContext.lineTo(-30, -200);
  hudContext.quadraticCurveTo(-15, -210, 0, -200);
  hudContext.lineTo(0, 0);

  gradient = hudContext.createLinearGradient(-70, -100, 5, -90);
  gradient.addColorStop(0, '#535c57');
  gradient.addColorStop(0.3, '#555d5f');
  gradient.addColorStop(0.5, '#8a918a');
  gradient.addColorStop(0.7, '#3b3d38');
  gradient.addColorStop(1, '#090909');

  hudContext.fillStyle = gradient;
  hudContext.fill();
  hudContext.restore();

  // right barrel
  hudContext.save();
  hudContext.beginPath();
  hudContext.translate(hudWidth / 2, gun.y);
  hudContext.moveTo(0, 0);
  hudContext.lineTo(0, -200);
  hudContext.quadraticCurveTo(15, -210, 30, -200);
  hudContext.lineTo(80, 0);

  gradient = hudContext.createLinearGradient(-10, -90, 60, -99);
  gradient.addColorStop(0, '#535c57');
  gradient.addColorStop(0.3, '#555d5f');``
  gradient.addColorStop(0.5, '#8a918a');
  gradient.addColorStop(0.7, '#3b3d38');
  gradient.addColorStop(1, '#090909');

  hudContext.fillStyle = gradient;
  hudContext.fill();
  hudContext.restore();
}

function hud_renderCrossHair() {
  hudContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
  // horizontal bar
  hudContext.fillRect(hudWidth/2 - 15, hudHeight/2 - 1, 30, 2);
  // vertical bar
  hudContext.fillRect(hudWidth/2 - 1, hudHeight/2 - 15, 2, 30);
}

function hud_gunRecoil() {
  gun.y = hudHeight + GUN_RECOIL;
}