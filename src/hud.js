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
  hud_renderDialog();
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
    hud_renderLine(viewportWidth/2, viewportHeight/2, 30, 'loading...');
  }
  else if(gameState === GAME_STATE_START_SCREEN) {
    hud_renderDialogFrame();
    hud_renderLine(viewportWidth/2, viewportHeight/2, 30, 'press enter to start');
  }
  else if(gameState === GAME_STATE_PAUSED) {
    hud_renderDialogFrame();
    hud_renderLine(viewportWidth/2, viewportHeight/2, 30, 'press enter to resume');
  }

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
  hudContext.fillStyle = hudContext.createPattern(textures['burned-stone'].image, 'repeat');
  hudContext.globalAlpha = 0.7;
  hudContext.fill();
  hudContext.restore();

  // border
  hudContext.lineWidth = 5;
  hudContext.strokeStyle = borderColor;
  hudContext.strokeRect(x, y, width, height);

  // fancy corners
  let corderRadius = 40;
  hudContext.beginPath();
  hudContext.strokeStyle = borderColor;

  // top left
  hudContext.moveTo(x, y);
  hudContext.bezierCurveTo(x, y - corderRadius, x - corderRadius, y, x, y);
  hudContext.stroke();

  // top right
  hudContext.moveTo(x+width, y);
  hudContext.bezierCurveTo(x+width, y - corderRadius, x+width + corderRadius, y, x+width, y);
  hudContext.stroke();

  // bottom right
  hudContext.moveTo(x+width, y+height);
  hudContext.bezierCurveTo(x+width, y+height + corderRadius, x+width + corderRadius, y+height, x+width, y+height);
  hudContext.stroke();

  // bottom left
  hudContext.moveTo(x, y+height);
  hudContext.bezierCurveTo(x, y+height + corderRadius, x - corderRadius, y+height, x, y+height);
  hudContext.stroke();
}

function hud_renderLine(startX, y, height, str) {
  let pixelsPerLetter = 9;
  let scale = height / pixelsPerLetter;
  let textColor = '#958e78';


  let x = startX;
  let charHeight = 9;

  for (let n=0; n<str.length; n++) {
    let char = str[n];
    let charObj = ALPHABET_MAP[char];

    if (char === ' ') {
      x += 4 * scale;
    }
    else if (char === '.') {
      hudContext.fillStyle = textColor;
      hudContext.fillRect(x, y+6*scale, scale, scale);
      x += (1 + CHAR_SPACING) * scale;
    }
    else if (charObj) {
      let charX = charObj[0];
      let charWidth = charObj[1];
      hudContext.drawImage(alphabetCanvas, charX * PIXEL_RATIO, 0, charWidth * PIXEL_RATIO, charHeight * PIXEL_RATIO, x, y, charWidth*scale, charHeight*scale);
      x += (charWidth + CHAR_SPACING) * scale;
    }

  }
}