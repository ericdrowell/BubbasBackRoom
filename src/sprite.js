function sprite_init(callback) {
  sprite_addHealth();
  sprite_addGun();
  sprite_addBullet();
  sprite_addMuzzleFlash();

  let image = new Image();
  image.onload = function() {
    spriteContext.drawImage(image, 0, 270);
    callback();
  };

  image.src = 'alphabet-tiny.png'; 
}

function sprite_addHealth() {
  let foamPattern = spriteContext.createPattern(textures[TEXTURES_FOAM].image, 'repeat');

  let gradient = spriteContext.createLinearGradient(-10, 0, 10, 0);

  gradient.addColorStop(0, '#9d170e');
  gradient.addColorStop(0.4, '#c81818');
  gradient.addColorStop(1, '#190b02');



  // gradient.addColorStop(0, '#9d170e');
  // gradient.addColorStop(0.2, '#c81818');
  // gradient.addColorStop(0.4, '#591816');
  // gradient.addColorStop(0.6, '#3f0805');
  // gradient.addColorStop(1, '#190b02');


  spriteContext.save();
    spriteContext.translate(200, 70);

    // bottom disc
    spriteContext.save();
      spriteContext.beginPath();
      spriteContext.translate(0, 42);
      spriteContext.scale(1, 0.5);
      spriteContext.arc(0, 0, 14, 0, 2 * MATH_PI, false);
      spriteContext.fillStyle = gradient;
      spriteContext.fill();
    spriteContext.restore();

    // bottom body
    spriteContext.save();
      spriteContext.translate(0, 32);
      spriteContext.beginPath();
      spriteContext.rect(-14, -10, 28, 20);
      spriteContext.fillStyle = gradient;
      spriteContext.fill();
    spriteContext.restore();

    // middle disc 2 
    
    spriteContext.save();
      spriteContext.beginPath();
      spriteContext.translate(0, 22);
      spriteContext.scale(1, 0.5);
      spriteContext.arc(0, 0, 20, 0, 2 * MATH_PI, false);
      spriteContext.fillStyle = gradient;
      spriteContext.fill();
    spriteContext.restore();

    // middle disc 1
    spriteContext.save();
      spriteContext.scale(2, 2);
      spriteContext.fillStyle = gradient;
      spriteContext.fill();
    spriteContext.restore();


    // top body
    spriteContext.beginPath();
    spriteContext.moveTo(-25, -20);
    spriteContext.lineTo(25, -20);
    spriteContext.lineTo(20, 20);
    spriteContext.lineTo(-20, 20);

    spriteContext.save();
      spriteContext.scale(2, 2);
      spriteContext.fillStyle = gradient;
      spriteContext.fill();
    spriteContext.restore();

    // lid
    spriteContext.save();
      spriteContext.beginPath();
      spriteContext.translate(0, -20);
      spriteContext.scale(1, 0.5);
      spriteContext.arc(0, 0, 25, 0, 2*MATH_PI, false);
      canvas2d_fillPattern(spriteContext, 2, foamPattern);
    spriteContext.restore();

    // x
    spriteContext.save();
      spriteContext.strokeStyle = '#999';
      spriteContext.lineWidth = 2;
      spriteContext.translate(0, -20);

      spriteContext.beginPath();
      spriteContext.moveTo(-6, -3);
      spriteContext.lineTo(6, 3);
      spriteContext.stroke();

      spriteContext.beginPath();
      spriteContext.moveTo(-6, 3);
      spriteContext.lineTo(6, -3);
      spriteContext.stroke();
    spriteContext.restore();

    // straw
    spriteContext.save();
      spriteContext.beginPath();
      spriteContext.translate(-5, -38);
      spriteContext.rotate(-0.3);
      spriteContext.fillStyle = '#9d170e'; // red
      spriteContext.fillRect(-2, -20, 4, 40);
    spriteContext.restore();

  spriteContext.restore();
}

function sprite_addMuzzleFlash() {
    // render flash

  spriteContext.beginPath();
    spriteContext.save();
    spriteContext.translate(400, 100);
    
    let radius = 100;
    spriteContext.moveTo(0, 0);
    let numTips = 12;
    let eachAngle = 2 * MATH_PI / numTips;
    for (let n=0; n<numTips; n++) {
      spriteContext.rotate(eachAngle);
      spriteContext.quadraticCurveTo(-20, radius/2, 0, radius);
      spriteContext.quadraticCurveTo(20, radius/2, 0, 0);
    }

    gradient = spriteContext.createRadialGradient(0, 0, 0, 0, 0, 100);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.7, 'rgba(253, 254, 206, 0.7)');
    gradient.addColorStop(1, 'rgba(166, 82, 40, 0.7)');
    spriteContext.lineJoin = 'round';
    spriteContext.fillStyle = gradient;
    spriteContext.fill();
  spriteContext.restore();
  
}

function sprite_addGun() {
  let gradient;

  let height = 230;
  
  // left barrel
  spriteContext.save();
  spriteContext.beginPath();
  spriteContext.translate(100, 250);
  spriteContext.moveTo(-80, 0);
  spriteContext.lineTo(-30, -1 * height);
  spriteContext.quadraticCurveTo(-15, -1*height - 10, 0, -1*height);
  spriteContext.lineTo(0, 0);

  //gradient = spriteContext.createLinearGradient(-70, -100, 5, -90);
  gradient = spriteContext.createLinearGradient(-70, -1*height/2, 5, -1*height/2+8);
  gradient.addColorStop(0, '#535c57');
  gradient.addColorStop(0.3, '#555d5f');
  gradient.addColorStop(0.5, '#8a918a');
  gradient.addColorStop(0.7, '#3b3d38');
  gradient.addColorStop(1, '#090909');

  spriteContext.fillStyle = gradient;
  spriteContext.fill();
  spriteContext.restore();

  // right barrel
  spriteContext.save();
  spriteContext.beginPath();
  spriteContext.translate(100, 250);
  spriteContext.moveTo(0, 0);
  spriteContext.lineTo(0, -1 * height);
  spriteContext.quadraticCurveTo(15, -1*height-10, 30, -1*height);
  spriteContext.lineTo(80, 0);

  gradient = spriteContext.createLinearGradient(-10, -1*height/2+10, 60, -1*height/2+5);
  //gradient = spriteContext.createLinearGradient(-10, -90, 60, -99);
  gradient.addColorStop(0, '#535c57');
  gradient.addColorStop(0.3, '#555d5f');
  gradient.addColorStop(0.5, '#8a918a');
  gradient.addColorStop(0.7, '#3b3d38');
  gradient.addColorStop(1, '#090909');

  spriteContext.fillStyle = gradient;
  spriteContext.fill();
  spriteContext.restore();
}

function sprite_addBullet() {
  spriteContext.save();
  spriteContext.translate(250, 80);
  

  let x = 0;


  spriteContext.save();
  spriteContext.beginPath();
  spriteContext.moveTo(0, 0);

  let gradient;

  gradient = spriteContext.createLinearGradient(x, 0, x + 20, 0);
  gradient.addColorStop(0, '#9d170e');
  gradient.addColorStop(0.2, '#c81818');
  gradient.addColorStop(0.4, '#591816');
  gradient.addColorStop(0.6, '#3f0805');
  gradient.addColorStop(1, '#190b02');
  spriteContext.fillStyle = gradient;
  spriteContext.fillRect(x, -65, 20, 50);

  spriteContext.save();
  spriteContext.beginPath();
  spriteContext.scale(1, 0.5);
  spriteContext.arc(x + 10, -130, 10, 0, MATH_PI, true);
  spriteContext.fill();
  spriteContext.restore();

  gradient = spriteContext.createLinearGradient(x, 0, x + 20, 0);
  gradient.addColorStop(0, '#936623');
  gradient.addColorStop(0.2, '#b3784c');
  gradient.addColorStop(0.4, '#3f2317');
  gradient.addColorStop(0.6, '#312111');
  gradient.addColorStop(1, '#201408');
  spriteContext.fillStyle = gradient;
  spriteContext.fillRect(x, -25, 20, 10);
  spriteContext.fillRect(x - 2, -15, 24, 10);

  spriteContext.save();
  spriteContext.beginPath();
  spriteContext.scale(1, 0.5);
  spriteContext.arc(x + 10, -30, 12, 0, 2 * MATH_PI, false);
  spriteContext.fill();
  spriteContext.restore();

  spriteContext.save();
  spriteContext.beginPath();
  spriteContext.scale(1, 0.5);
  spriteContext.arc(x + 10, -10, 12, 0, 2 * MATH_PI, false);
  spriteContext.fillStyle = '#140c08';
  spriteContext.fill();
  spriteContext.restore();

  spriteContext.restore();


  spriteContext.restore();
}


function sprite_show() {
  spriteCanvas.style.display = 'fixed';
  spriteCanvas.style.top = 0;
  document.body.appendChild(spriteCanvas);

}

function sprite_draw(context, x, y, width, height) {
  context.drawImage(spriteCanvas, x* PIXEL_RATIO, y* PIXEL_RATIO, width* PIXEL_RATIO, height* PIXEL_RATIO, 0, 0, width, height);
}