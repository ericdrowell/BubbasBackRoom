function canvas2d_init() {
  hudCanvas = document.getElementById('hudCanvas');
  hudContext = canvas2d_initCanvas(hudCanvas, viewportWidth, viewportHeight, PIXEL_RATIO);

  // very wide screen
  if (windowRatio > GAME_ASPECT_RATIO) {
    hudCanvas.style.left = '50%';
    hudCanvas.style.marginLeft = '-' + (viewportWidth/2) + 'px'
  }
  // very tall screen
  else {
    hudCanvas.style.top = '50%';
    hudCanvas.style.marginTop = '-' + (viewportHeight/2) + 'px'
  }

  textCanvas = document.createElement('canvas');
  textContext = canvas2d_initCanvas(textCanvas, 134, 9, PIXEL_RATIO);
};

function canvas2d_initCanvas(canvas, width, height, pixelRatio) {
  let context = canvas.getContext('2d');
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;

  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  if (pixelRatio !== 1) {
    context.scale(pixelRatio, pixelRatio);
  }

  return context;
}
