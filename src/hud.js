// hud = "heads up display"
function hud_init() {
  hudRatio = viewportHeight / OPTIMAL_VIEWPORT_HEIGHT;
  gun = {
    y: viewportHeight
  };
}

function hud_render() {
  hudContext.clearRect(0, 0, viewportWidth, viewportHeight);

  hud_renderGun();
  hud_renderCrossHair();
  hud_renderBullets();
}

function hud_update() {
  if (gun.y >= viewportHeight) {
    let distEachFrame = GUN_RECOIL_RECOVER_SPEED * elapsedTime / 1000;

    gun.y -= distEachFrame;

    if (gun.y < viewportHeight) {
      gun.y = viewportHeight;
    }
  }

  
}

function hud_renderGun() {
  let gradient;

  
  
  // left barrel
  hudContext.save();
  hudContext.beginPath();
  hudContext.translate(viewportWidth / 2, gun.y);
  hudContext.scale(hudRatio, hudRatio);
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
  hudContext.translate(viewportWidth / 2, gun.y);
  hudContext.scale(hudRatio, hudRatio);
  hudContext.moveTo(0, 0);
  hudContext.lineTo(0, -200);
  hudContext.quadraticCurveTo(15, -210, 30, -200);
  hudContext.lineTo(80, 0);

  gradient = hudContext.createLinearGradient(-10, -90, 60, -99);
  gradient.addColorStop(0, '#535c57');
  gradient.addColorStop(0.3, '#555d5f');
  gradient.addColorStop(0.5, '#8a918a');
  gradient.addColorStop(0.7, '#3b3d38');
  gradient.addColorStop(1, '#090909');

  hudContext.fillStyle = gradient;
  hudContext.fill();
  hudContext.restore();
}

function hud_renderCrossHair() {

  if (numBullets <= 0) {
    // TODO: show "Press R to Reload"
  }
  else {
    hudContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
    // horizontal bar
    hudContext.fillRect(viewportWidth/2 - 15, viewportHeight/2 - 1, 14, 2);
    hudContext.fillRect(viewportWidth/2 + 1, viewportHeight/2 - 1, 14, 2);
    // vertical bar
    hudContext.fillRect(viewportWidth/2 - 1, viewportHeight/2 - 15, 2, 14);
    hudContext.fillRect(viewportWidth/2 - 1, viewportHeight/2 + 1, 2, 14);
  }

}

function hud_renderBullets() {
  hudContext.save();
  hudContext.translate(viewportWidth - 10, viewportHeight - 10);
  

  let x = -20;

  for (let n=0; n<numBullets; n++) {
    hudContext.save();
    hudContext.beginPath();
    hudContext.moveTo(0, 0);

    let gradient;

    hudContext.scale(hudRatio, hudRatio);

    gradient = hudContext.createLinearGradient(x, 0, x + 20, 0);
    gradient.addColorStop(0, '#9d170e');
    gradient.addColorStop(0.2, '#c81818');
    gradient.addColorStop(0.4, '#591816');
    gradient.addColorStop(0.6, '#3f0805');
    gradient.addColorStop(1, '#190b02');
    hudContext.fillStyle = gradient;
    hudContext.fillRect(x, -65, 20, 50);

    hudContext.save();
    hudContext.beginPath();
    hudContext.scale(1, 0.5);
    hudContext.arc(x + 10, -130, 10, 0, MATH_PI, true);
    hudContext.fill();
    hudContext.restore();

    gradient = hudContext.createLinearGradient(x, 0, x + 20, 0);
    gradient.addColorStop(0, '#936623');
    gradient.addColorStop(0.2, '#b3784c');
    gradient.addColorStop(0.4, '#3f2317');
    gradient.addColorStop(0.6, '#312111');
    gradient.addColorStop(1, '#201408');
    hudContext.fillStyle = gradient;
    hudContext.fillRect(x, -25, 20, 10);
    hudContext.fillRect(x - 2, -15, 24, 10);

    hudContext.save();
    hudContext.beginPath();
    hudContext.scale(1, 0.5);
    hudContext.arc(x + 10, -30, 12, 0, 2 * MATH_PI, false);
    hudContext.fill();
    hudContext.restore();

    hudContext.save();
    hudContext.beginPath();
    hudContext.scale(1, 0.5);
    hudContext.arc(x + 10, -10, 12, 0, 2 * MATH_PI, false);
    hudContext.fillStyle = '#140c08';
    hudContext.fill();
    hudContext.restore();

    hudContext.restore();

    x -= 40;
  }

  hudContext.restore();
}

// function hud_renderCompass() {
//   // main body
//   hudContext.save();
//   hudContext.beginPath();
//   hudContext.translate(viewportWidth - 70, 90);
//   hudContext.arc(0, 0, 50, MATH_PI * 2, false);

  
//   hudContext.save();
//   hudContext.scale(3, 3);
//   hudContext.fillStyle = hudContext.createPattern(textures.paper.image, 'repeat');
//   hudContext.fill();
//   hudContext.restore();

//   hudContext.strokeStyle = '#a16d3d';
//   hudContext.lineWidth = 5;
//   hudContext.stroke();
//   hudContext.restore();

//   // top
//   hudContext.save();
//   hudContext.beginPath();
//   hudContext.translate(viewportWidth - 40, 40);
//   hudContext.arc(0, 0, 10, MATH_PI * 2, false);
  
//   hudContext.fillStyle = '#a16d3d';
//   hudContext.fill();
//   hudContext.restore();

//   // needle
//   hudContext.save();
//   hudContext.beginPath();
//   hudContext.translate(viewportWidth - 70, 90);
//   hudContext.rotate(camera.yaw * -1);
//   hudContext.arc(0, 0, 5, MATH_PI * 2, false);
//   hudContext.fillStyle = '#3f212b';
//   hudContext.fill();

//   hudContext.fillRect(-2, -30, 4, 60);

//   hudContext.beginPath();

//   hudContext.moveTo(-5, -25);
//   hudContext.lineTo(0, -40);
//   hudContext.lineTo(5, -25);
//   hudContext.closePath();
//   hudContext.fill();
  

//   hudContext.moveTo(0, 18);
//   hudContext.lineTo(-4, 28);
//   hudContext.lineTo(-4, 38);
//   hudContext.lineTo(4, 38);
//   hudContext.lineTo(4, 28);
//   hudContext.closePath();
//   hudContext.fill();

//   hudContext.restore();

  


// }

function hud_gunRecoil() {
  gun.y = viewportHeight + GUN_RECOIL;
}