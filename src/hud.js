// hud = "heads up display"
function hud_init() {
  gun = {
    x: OPTIMAL_VIEWPORT_WIDTH / 2,
    y: OPTIMAL_VIEWPORT_HEIGHT
  };

}

function hud_render() {
  hudContext.clearRect(0, 0, viewportWidth, viewportHeight);

  hudContext.save();
  hudContext.scale(viewportScale, viewportScale);

  hud_renderGun();
  hud_renderCrossHair();
  hud_renderBullets();
  hud_renderPainFlash();
  hud_renderDialog();
  

  hudContext.restore();

  //canvas2d_pixelate(hudCanvas, hudContext, 2);
}

function hud_renderPainFlash() {
  if (playerHurting > 0) {
    hudContext.save();
    hudContext.scale(10, 10);
    hudContext.fillStyle = hudContext.createPattern(textures[TEXTURES_BLOOD_STONE].image, 'repeat');
    hudContext.globalAlpha = 0.2 * playerHurting / PLAYER_PAIN_FLASH_DURATION;
    hudContext.fillRect(0, 0, OPTIMAL_VIEWPORT_WIDTH, OPTIMAL_VIEWPORT_HEIGHT);
    hudContext.restore();
  }
}

function hud_update() {
  // recoil
  if (isRecoiling) {
    let distEachFrame = GUN_RECOIL_RECOVER_SPEED * elapsedTime / 1000;

    gun.y -= distEachFrame;

    if (gun.y < OPTIMAL_VIEWPORT_HEIGHT) {
      gun.y = OPTIMAL_VIEWPORT_HEIGHT;
      isRecoiling = false;
    }
  }

  // else if (isReloading) {
  //   gun.y = OPTIMAL_VIEWPORT_HEIGHT + GUN_RELOAD_DIST;
  // }
  // else {
  //   gun.y = OPTIMAL_VIEWPORT_HEIGHT;
  // }

  // bobble as a half circle motion
  if (!isAirborne && (player.straightMovement || player.sideMovement)) {
    gunBobbleCounter += elapsedTime;
    gunBobbleX = GUN_BOBBLE_AMPLITUDE * MATH_COS((gunBobbleCounter/1000) * GUN_BOBBLE_FREQUENCEY);
    gunBobbleY = MATH_ABS(GUN_BOBBLE_AMPLITUDE * MATH_SIN((gunBobbleCounter/1000) * GUN_BOBBLE_FREQUENCEY));
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
  let barLength = 14;
  let barThickness = 2;
  let halfBarThickness = barThickness/2;
  if (!isReloading && numBullets <= 0) {
    // TODO: show "Press R to Reload"
  }
  else if (numBullets > 0) {
    hudContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
    // horizontal bar
    hudContext.fillRect(OPTIMAL_VIEWPORT_WIDTH/2 - barLength - halfBarThickness, OPTIMAL_VIEWPORT_HEIGHT/2 - halfBarThickness, barLength, barThickness);
    hudContext.fillRect(OPTIMAL_VIEWPORT_WIDTH/2 + halfBarThickness, OPTIMAL_VIEWPORT_HEIGHT/2 - halfBarThickness, barLength, barThickness);
    // vertical bar
    hudContext.fillRect(OPTIMAL_VIEWPORT_WIDTH/2 - halfBarThickness, OPTIMAL_VIEWPORT_HEIGHT/2 - barLength - halfBarThickness, barThickness, barLength);
    hudContext.fillRect(OPTIMAL_VIEWPORT_WIDTH/2 - halfBarThickness, OPTIMAL_VIEWPORT_HEIGHT/2 + halfBarThickness, barThickness, barLength);
  }

}

function hud_renderBullets() {
  hudContext.save();
  hudContext.translate(OPTIMAL_VIEWPORT_WIDTH - 10, OPTIMAL_VIEWPORT_HEIGHT - 10);
  

  let x = -20;

  for (let n=0; n<numBullets; n++) {
    hudContext.save();
    hudContext.beginPath();
    hudContext.moveTo(0, 0);

    let gradient;

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
  gun.y = OPTIMAL_VIEWPORT_HEIGHT + GUN_RECOIL;
  isRecoiling = true;
}

function hud_renderControlsBottom() {
  text_renderLine('wasd', 30, 260, hudContext, -1);
  text_renderLine('mouse move', 30, 300, hudContext, -1);
  text_renderLine('mouse click', 30, 340, hudContext, -1);
  text_renderLine('r', 30, 380, hudContext, -1);
  text_renderLine('space', 30, 420, hudContext, -1);
  text_renderLine('esc', 30, 460, hudContext, -1);

  text_renderLine('..move', 30, 260, hudContext, 1);
  text_renderLine('..look', 30, 300, hudContext, 1);
  text_renderLine('..shoot', 30, 340, hudContext, 1);
  text_renderLine('..reload', 30, 380, hudContext, 1);
  text_renderLine('..jump', 30, 420, hudContext, 1);
  text_renderLine('..pause', 30, 460, hudContext, 1);

  text_renderLine('press enter to start', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
}

function hud_renderDialog() {
  if (gameState === GAME_STATE_STORY) {
    if (gameStory === 0) {
      hud_renderDialogFrame();
      text_renderLine('loading...', 50, OPTIMAL_VIEWPORT_HEIGHT/2-25, hudContext, 0);
    }
    else if(gameStory === 1) {
      hud_renderDialogFrame();
      text_renderLine('back room', 80, 200, hudContext, 0);
      text_renderLine('created by eric rowell', 30, 320, hudContext, 0);
      text_renderLine('press enter to continue', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
    }
    else if(gameStory === 2) {
      hud_renderDialogFrame();
 
      text_renderLine('ring. ring. ring.', 30, 170, hudContext, 0);
      
      text_renderLine('welcome to bubbas gas station.', 30, 260, hudContext, 0);
      text_renderLine('im bubba your new boss.', 30, 300, hudContext, 0);
      text_renderLine('my son bubba junior cant wait to eat you.', 30, 340, hudContext, 0);
      text_renderLine('i mean...meet you...', 30, 380, hudContext, 0);
      text_renderLine('hes in the back room.', 30, 420, hudContext, 0);
      text_renderLine('press enter to continue', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
    }
    else if(gameStory === 3) {
      hud_renderDialogFrame();
      text_renderLine('controls', 80, 150, hudContext, 0);
      hud_renderControlsBottom();
    }
    // else if(gameStory === 4) {
    //   hud_renderDialogFrame();
    //   text_renderLine('oh my god...who did this', 30, 170, hudContext, 0);
    //   text_renderLine('press enter to continue', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
    // }
    // else if(gameStory === 5) {
    //   hud_renderDialogFrame();
    //   text_renderLine('whatever is in there... i gotta ', 30, 170, hudContext, 0);
    //   text_renderLine('press enter to continue', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
    // }
  }
  else if (gameState === GAME_STATE_PAUSED) {
    hud_renderDialogFrame();
    text_renderLine('paused', 80, 150, hudContext, 0);
    hud_renderControlsBottom();
  }
  else if (gameState === GAME_STATE_DIED) {
    hud_renderDialogFrame();
    text_renderLine('you died', 80, 150, hudContext, 0);
    text_renderLine('press enter to try again', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
  }
  else if (gameState === GAME_STATE_WIN) {
    hud_renderDialogFrame();
    text_renderLine('you win', 80, 150, hudContext, 0);
    text_renderLine('press enter to play again', 30, OPTIMAL_VIEWPORT_HEIGHT - 180, hudContext, 0);
  }




}

function hud_renderDialogHorn(angle) {
  let lineWidth = 5;
  let hornLength = 60;
  let halfLineWidth = lineWidth/2;
  let barLength = 30;
  let barSize = 5;
  let barSpacing = 30;

  hudContext.save();
  hudContext.rotate(angle)

  // spike
  hudContext.beginPath();
  hudContext.fillRect(-halfLineWidth, -halfLineWidth - hornLength, lineWidth, hornLength);
  // hudContext.moveTo(-halfLineWidth, -halfLineWidth);
  // hudContext.lineTo(0, -halfLineWidth - hornLength);
  // hudContext.lineTo(halfLineWidth, -halfLineWidth);
  // hudContext.fill();

  // bar
  hudContext.beginPath();
  hudContext.fillRect(-barLength/2, -barSize/2 - barSpacing, barLength, barSize);
  hudContext.restore();

}

function hud_renderCorner(x, y, rotation) {
  hudContext.save();

  hudContext.translate(x, y);
  hudContext.rotate(rotation);

  hud_renderDialogHorn();
  hud_renderDialogHorn(-1 * MATH_PI * 0.5);


  hudContext.restore();
}

function hud_renderDialogFrame() {
  let borderColor = '#958e77';
  let x = 100;
  let y = 100;
  let width = OPTIMAL_VIEWPORT_WIDTH-200;
  let height = OPTIMAL_VIEWPORT_HEIGHT-200;


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