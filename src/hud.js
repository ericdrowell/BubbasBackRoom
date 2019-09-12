// hud = "heads up display"
function hud_init() {
  gun = {
    x: OPTIMAL_VIEWPORT_WIDTH / 2,
    y: OPTIMAL_VIEWPORT_HEIGHT
  };

  hudDirty = true;
}

function hud_render() {
  hudContext.clearRect(0, 0, viewportWidth, viewportHeight);

  hudContext.save();
  hudContext.scale(viewportScale, viewportScale);

  hud_renderGun();
  hud_renderCrossHair();
  hud_renderBullets();
  hud_renderHealth();
  hud_renderPainFlash();
  hud_renderDialog();
  
  hudContext.restore();
}

function hud_renderHealth() {
  let x = 0;

  for (let n=0; n<player.health; n++) {
    
    hudContext.save();
    hudContext.translate(x, 0);
    sprite_draw(hudContext, 160, 0, 80, 120);
    hudContext.restore();

    x += 70;
  }
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
  if (gameState === GAME_STATE_PLAYING) {
    if (isRecoiling) {
      let distEachFrame = GUN_RECOIL_RECOVER_SPEED * elapsedTime / 1000;

      gun.y -= distEachFrame;

      if (gun.y < OPTIMAL_VIEWPORT_HEIGHT) {
        gun.y = OPTIMAL_VIEWPORT_HEIGHT;
        isRecoiling = false;
      }
    }

    // bobble as a half circle motion
    if (!player.isAirborne && (player.straightMovement || player.sideMovement)) {
      gunBobbleCounter += elapsedTime;
      gunBobbleX = GUN_BOBBLE_AMPLITUDE * Math.cos((gunBobbleCounter/1000) * GUN_BOBBLE_FREQUENCEY);
      gunBobbleY = Math.abs(GUN_BOBBLE_AMPLITUDE * Math.sin((gunBobbleCounter/1000) * GUN_BOBBLE_FREQUENCEY));
    }
    else {
      gunBobbleX = 0;
      gunBobbleY = 0;
    }

    hudDirty = true;
  } 
}

function hud_renderGun() {
  // muzzle flash 
  if (flashTimeRemaining > 0) {
    hudContext.save();
    hudContext.translate(gun.x-100, gun.y-300);
    sprite_draw(hudContext, 300, 0, 200, 200);
    hudContext.restore();
  }

  // gun
  hudContext.save();
  hudContext.translate(gun.x -70 + gunBobbleX, gun.y-200+ gunBobbleY + GUN_BOBBLE_AMPLITUDE);
  sprite_draw(hudContext, 31, 0, 140, 200);
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
  let x = OPTIMAL_VIEWPORT_WIDTH - 50;

  for (let n=0; n<numBullets; n++) {
    
    hudContext.save();
    hudContext.translate(x, OPTIMAL_VIEWPORT_HEIGHT - 90);
    sprite_draw(hudContext, 245, 0, 30, 80);
    hudContext.restore();

    x-= 40;
  }
}

function hud_gunRecoil() {
  gun.y = OPTIMAL_VIEWPORT_HEIGHT + GUN_RECOIL;
  isRecoiling = true;
}

function hud_renderControlsBottom() {
  text_renderLine('wasd', 30, 260, -1);
  text_renderLine('mouse move', 30, 300, -1);
  text_renderLine('mouse click', 30, 340, -1);
  text_renderLine('r', 30, 380, -1);
  text_renderLine('space', 30, 420, -1);
  text_renderLine('esc', 30, 460, -1);

  text_renderLine('..move', 30, 260, 1);
  text_renderLine('..look', 30, 300, 1);
  text_renderLine('..shoot', 30, 340, 1);
  text_renderLine('..reload', 30, 380, 1);
  text_renderLine('..jump', 30, 420, 1);
  text_renderLine('..pause', 30, 460, 1);
}

function hud_openDialog() {
  player.straightMovement = 0;
  player.sideMovement = 0;
  document.exitPointerLock();
  hudDirty = true;
  gameState = GAME_STATE_STORY;
  soundEffects_play(SOUND_EFFECTS_DIALOG);
}

function hud_renderDialog() {
  let bottomLineY = OPTIMAL_VIEWPORT_HEIGHT - 180;

  if (gameState === GAME_STATE_STORY) {
    hud_renderDialogFrame();
    if (gameStory === 0) {
      
      text_renderLine('bubbas back room', 75, 160, 0);
      text_renderLine('created by @ericdrowell', 30, 280, 0);
      text_renderLine('loading...', 30, bottomLineY, 0);
    }
    else if(gameStory === 1) {
      text_renderLine('bubbas back room', 75, 160, 0);
      text_renderLine('created by @ericdrowell', 30, 280, 0);
      text_renderLine('click to continue', 30, bottomLineY, 0);
    }
    else if(gameStory === 3) {
      text_renderLine('ring. ring. ring.', 30, 170, 0);
      
      text_renderLine('welcome to bubbas gas station.', 30, 260, 0);
      text_renderLine('im bubba your new boss.', 30, 300, 0);
      text_renderLine('my son bubba junior cant wait to eat you.', 30, 340, 0);
      text_renderLine('i mean...meet you...', 30, 380, 0);
      text_renderLine('hes in the back room.', 30, 420, 0);
      text_renderLine('click to continue', 30, bottomLineY, 0);
    }
    else if(gameStory === 5) {
      text_renderLine('controls', 75, 150, 0);
      hud_renderControlsBottom();
      text_renderLine('click to continue', 30, bottomLineY, 0);
    }
    else if(gameStory === 10 || gameStory === 15 || gameStory === 21) {
      text_renderLine('wait a minute.  i should kill the zombies', 30, 260, 0);
      text_renderLine('in case they escape into the gas station.', 30, 300, 0);
      text_renderLine('i dont want my boss to fire me.', 30, 340, 0);
      text_renderLine('click to continue', 30, bottomLineY, 0);
    }
  }
  else if (gameState === GAME_STATE_PAUSED) {
    hud_renderDialogFrame();
    text_renderLine('paused', 75, 150, 0);
    hud_renderControlsBottom();
    text_renderLine('click to resume', 30, bottomLineY, 0);
  }
  else if (gameState === GAME_STATE_DIED) {
    hud_renderDialogFrame();
    text_renderLine('you died', 75, 150, 0);
    text_renderLine('click to try again', 30, bottomLineY, 0);
  }
  else if (gameState === GAME_STATE_WIN) {
    hud_renderDialogFrame();
    text_renderLine('you win', 75, 150, 0);

    if (clickBlock === 0) {
      text_renderLine('click to play again', 30, bottomLineY, 0);
    }
    else {
      text_renderLine('...', 30, bottomLineY, 0);
    }
    
  }
}

function hud_renderCorner(x, y) {
  hudContext.save();
  hudContext.strokeStyle = '#958e77';
  hudContext.lineWidth = 5;
  hudContext.strokeRect(x, y, 20, 20);
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
  hud_renderCorner(x-20, y-20);
  hud_renderCorner(x+width, y-20);
  hud_renderCorner(x+width, y+height);
  hud_renderCorner(x-20, y+height);
}