// hud = "heads up display"
function hud_init() {
  hudRatio = viewportHeight / OPTIMAL_VIEWPORT_HEIGHT;
  gun = {
    x: viewportWidth / 2,
    y: viewportHeight
  };
}

function hud_render() {
  hudContext.clearRect(0, 0, viewportWidth, viewportHeight);

  hud_renderGun();
  hud_renderCrossHair();
  hud_renderBullets();
  hud_renderDialog();
}

function hud_update() {
  // recoil
  if (gun.y >= viewportHeight) {
    let distEachFrame = GUN_RECOIL_RECOVER_SPEED * elapsedTime / 1000;

    gun.y -= distEachFrame;

    if (gun.y < viewportHeight) {
      gun.y = viewportHeight;
    }
  }

  // bobble
  if (player.straightMovement || player.sideMovement) {
    gunBobbleCounter += elapsedTime;
    gunBobbleX = GUN_BOBBLE_AMPLITUDE * -1 * MATH_SIN((gunBobbleCounter/1000) * GUN_BOBBLE_FREQUENCEY/2);
    gunBobbleY = GUN_BOBBLE_AMPLITUDE * MATH_SIN((gunBobbleCounter/1000) * GUN_BOBBLE_FREQUENCEY);
  }
  else {
    gunBobbleX = 0;
    gunBobbleY = 0;
  }

  
}

function hud_renderGun() {
  let gradient;

  let height = 230;
  
  // left barrel
  hudContext.save();
  hudContext.beginPath();
  hudContext.translate(gun.x + gunBobbleX, gun.y + gunBobbleY + GUN_BOBBLE_AMPLITUDE);
  hudContext.scale(hudRatio, hudRatio);
  hudContext.moveTo(-80, 0);
  hudContext.lineTo(-30, -1 * height);
  hudContext.quadraticCurveTo(-15, -1*height - 10, 0, -1*height);
  hudContext.lineTo(0, 0);

  //gradient = hudContext.createLinearGradient(-70, -100, 5, -90);
  gradient = hudContext.createLinearGradient(-70, -1*height/2, 5, -1*height/2+8);
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
  hudContext.translate(gun.x + gunBobbleX, gun.y + gunBobbleY + GUN_BOBBLE_AMPLITUDE);
  hudContext.scale(hudRatio, hudRatio);
  hudContext.moveTo(0, 0);
  hudContext.lineTo(0, -1 * height);
  hudContext.quadraticCurveTo(15, -1*height-10, 30, -1*height);
  hudContext.lineTo(80, 0);

  gradient = hudContext.createLinearGradient(-10, -1*height/2+10, 60, -1*height/2+5);
  //gradient = hudContext.createLinearGradient(-10, -90, 60, -99);
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
  let barLength = hudRatio * 14;
  let barThickness = hudRatio * 2;
  let halfBarThickness = barThickness/2;
  if (numBullets <= 0) {
    // TODO: show "Press R to Reload"
  }
  else {
    hudContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
    // horizontal bar
    hudContext.fillRect(viewportWidth/2 - barLength - halfBarThickness, viewportHeight/2 - halfBarThickness, barLength, barThickness);
    hudContext.fillRect(viewportWidth/2 + halfBarThickness, viewportHeight/2 - halfBarThickness, barLength, barThickness);
    // vertical bar
    hudContext.fillRect(viewportWidth/2 - halfBarThickness, viewportHeight/2 - barLength - halfBarThickness, barThickness, barLength);
    hudContext.fillRect(viewportWidth/2 - halfBarThickness, viewportHeight/2 + halfBarThickness, barThickness, barLength);
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

function hud_gunRecoil() {
  gun.y = viewportHeight + GUN_RECOIL;
}

function hud_renderDialog() {
  if (gameState === GAME_STATE_LOADING) {
    hud_renderDialogFrame();

    let str = 'loading...';
    let height = 30;
    let width = text_getWidth(str, height);
    text_renderLine(str, viewportWidth/2 - width/2, viewportHeight/2, height, hudContext);
  }
  else if(gameState === GAME_STATE_START_SCREEN) {
    hud_renderDialogFrame();

    let str = 'press enter to start';
    let height = 30;
    let width = text_getWidth(str, height);
    text_renderLine(str, viewportWidth/2 - width/2, viewportHeight/2, height, hudContext);
  }
  else if(gameState === GAME_STATE_PAUSED) {
    hud_renderDialogFrame();

    let str = 'press enter to resume';
    let height = 30;
    let width = text_getWidth(str, height);
    text_renderLine(str, viewportWidth/2 - width/2, viewportHeight/2, height, hudContext);
  }

}

function hud_renderDialogHorn(flip, angle) {
  let lineWidth = 5;
  let hornRadius = 40;
  let halfLineWidth = lineWidth/2;

  hudContext.save();
  hudContext.scale(flip, 1); // used for flipping
  hudContext.rotate(angle)
  hudContext.beginPath();
  hudContext.moveTo(-halfLineWidth, -halfLineWidth);
  hudContext.quadraticCurveTo(-halfLineWidth, -halfLineWidth-hornRadius, -halfLineWidth+hornRadius, -halfLineWidth-hornRadius);
  hudContext.quadraticCurveTo(halfLineWidth, -halfLineWidth-hornRadius, halfLineWidth, halfLineWidth);

  hudContext.fill();
  hudContext.restore();
}

function hud_renderCorner(x, y, rotation) {
  hudContext.save();

  hudContext.translate(x, y);
  hudContext.rotate(rotation);

  hud_renderDialogHorn(1, 0);
  hud_renderDialogHorn(1, MATH_PI*-0.5);
  hud_renderDialogHorn(-1, MATH_PI*0.5);
  hud_renderDialogHorn(-1, 0);

  hudContext.restore();
}

function hud_renderDialogFrame() {
  let borderColor = '#958e77';
  let x = viewportWidth*0.1;
  let y = viewportHeight*0.1;
  let width = viewportWidth*0.8;
  let height = viewportHeight*0.8;


  // background
  hudContext.beginPath();
  hudContext.moveTo(x, y);
  hudContext.lineTo(x + width, y);
  hudContext.lineTo(x + width, y + height);
  hudContext.lineTo(x, y + height);
  hudContext.save();
  hudContext.scale(10, 10);
  hudContext.fillStyle = hudContext.createPattern(textures[TEXTURES_BURNED_STONE].image, 'repeat');
  hudContext.globalAlpha = 0.7;
  hudContext.fill();
  hudContext.restore();

  // border
  let lineWidth = 5;
  hudContext.lineWidth = lineWidth;
  hudContext.strokeStyle = borderColor;
  hudContext.strokeRect(x, y, width, height);

  // horn corners
  hudContext.fillStyle = borderColor;

  hud_renderCorner(x, y, 0);
  hud_renderCorner(x+width, y, MATH_PI*0.5);
  hud_renderCorner(x+width, y+height, MATH_PI);
  hud_renderCorner(x, y+height, MATH_PI*-0.5);



}