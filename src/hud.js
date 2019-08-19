// hud = "heads up display"
function hud_init() {
  gun = {
    y: viewportHeight
  };
}

function hud_render() {
  hud_renderGun();
  hud_renderCrossHair();
  //hud_renderCompass();
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

  hudContext.clearRect(0, 0, viewportWidth, viewportHeight);
  
  // left barrel
  hudContext.save();
  hudContext.beginPath();
  hudContext.translate(viewportWidth / 2, gun.y);
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
  hudContext.fillRect(viewportWidth/2 - 15, viewportHeight/2 - 1, 30, 2);
  // vertical bar
  hudContext.fillRect(viewportWidth/2 - 1, viewportHeight/2 - 15, 2, 30);
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